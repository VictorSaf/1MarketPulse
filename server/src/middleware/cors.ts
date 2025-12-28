// CORS middleware for Hono
import { cors as honoCors } from 'hono/cors';
import { config } from '../config/env';

export const corsMiddleware = honoCors({
  origin: config.corsOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400, // 24 hours
  credentials: true,
});
