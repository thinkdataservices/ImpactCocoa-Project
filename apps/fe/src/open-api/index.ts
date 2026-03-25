import createClient, { type Middleware, wrapAsPathBasedClient } from 'openapi-fetch';
import type { paths } from './generated/api';

const baseUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

let refreshRequest: Promise<Response> | null = null;

const myMiddleware: Middleware = {
  async onRequest({ request, options }) {
    // accessToken, refreshToken is set in httpOnly cookie from server, so client do not need to set them in header
    return request;
  },
  async onResponse({ request, response, options }) {
    const { body, ...resOptions } = response;
    // check status of response and handle accordingly
    // If the response status is 401, call API to get a new token
    if (response.status === 401) {
      try {
        // prevent multiple refresh requests
        refreshRequest =
          refreshRequest ||
          fetch(`${baseUrl}/api/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        const refreshResponse = await refreshRequest;
        if (refreshResponse.ok) {
          // retry the original request with the new token
          // Resume the old/original request after a successful refresh
          return fetch(request);
        }
      } catch (err) {
        console.error('Error during token exchange', err);
      } finally {
        refreshRequest = null;
      }
    } else if (response.status === 403) {
      // redirect user to permission denied page
      window.location.href = '/403';
    } else if (response.status === 404) {
      // redirect user to not found page
      window.location.href = '/404';
    } else if (response.status === 500) {
      // redirect user to server error page
      window.location.href = '/500';
    }
    return new Response(body, { ...resOptions, status: 200 });
  },
  async onError({ error }) {
    // wrap errors thrown by fetch
    return new Error('Oops, fetch failed', { cause: error });
  },
};

const _client = createClient<paths>({ baseUrl });
_client.use(myMiddleware);

export const client = wrapAsPathBasedClient(_client);
