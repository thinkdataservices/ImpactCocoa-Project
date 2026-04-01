import 'dotenv/config';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { initDb } from '../db/index.js';
import { auth } from './auth.js';
import { cardsRoutes } from './features/cards/index.js';
import { generalRoutes } from './features/general/index.js';
import { stacksRoutes } from './features/stacks/index.js';

const app = new Hono();
const PORT = Number(process.env.PORT) || 8000;

app.use(
  '*',
  cors({
    origin: [process.env.FE_URL || 'http://localhost:3030', 'https://thinkdata.creativext.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Better Auth routes
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

// Routes
app.route('/', generalRoutes);
app.route('/', stacksRoutes);
app.route('/', cardsRoutes);

// Serve static swagger files from public folder
app.use(
  '/swagger/*',
  serveStatic({ root: './public', rewriteRequestPath: (p) => p.replace('/swagger', '') }),
);
app.get('/swagger', (c) => c.redirect('/swagger/swagger.html'));

// 404
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Initialize database and start server
async function start() {
  await initDb();
  console.log('📦 Database initialized');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📚 Swagger: http://localhost:${PORT}/swagger`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  serve({ fetch: app.fetch, port: PORT });
}

start().catch(console.error);
