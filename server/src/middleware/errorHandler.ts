// Global error handling middleware
import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

export const errorHandler = (err: Error, c: Context) => {
  console.error('[Error]', err);

  // Parse error message to determine status code
  let status: StatusCode = 500;
  let message = 'Internal Server Error';

  if (err.message.includes('not found')) {
    status = 404;
    message = err.message;
  } else if (err.message.includes('API error')) {
    status = 502;
    message = 'External API error';
  } else if (err.message.includes('Invalid')) {
    status = 400;
    message = err.message;
  }

  return c.json(
    {
      error: true,
      message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    status
  );
};
