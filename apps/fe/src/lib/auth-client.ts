import { createAuthClient } from 'better-auth/react';
import { magicLinkClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_API_URL || 'http://localhost:8000',
  plugins: [magicLinkClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
