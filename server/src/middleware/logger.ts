// Request logging middleware
import type { Context, Next } from 'hono';

export const loggerMiddleware = async (c: Context, next: Next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  // Color code based on status
  let statusColor = '\x1b[32m'; // Green for 2xx
  if (status >= 400 && status < 500) statusColor = '\x1b[33m'; // Yellow for 4xx
  if (status >= 500) statusColor = '\x1b[31m'; // Red for 5xx

  console.log(
    `[${new Date().toISOString()}] ${method} ${path} ${statusColor}${status}\x1b[0m ${duration}ms`
  );
};
