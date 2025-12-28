/**
 * Security Headers Middleware
 *
 * Adds security-related HTTP headers to all responses.
 * Implements OWASP security headers recommendations.
 */

import { Context, Next } from 'hono';

export async function securityHeadersMiddleware(c: Context, next: Next) {
  await next();

  // Prevent clickjacking attacks
  c.res.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  c.res.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter in browsers
  c.res.headers.set('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent the browser from caching sensitive responses
  if (c.req.path.includes('/api/admin') || c.req.path.includes('/api/auth')) {
    c.res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    c.res.headers.set('Pragma', 'no-cache');
  }

  // Content Security Policy (less restrictive for API server)
  c.res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; frame-ancestors 'none';"
  );

  // Permissions Policy (disable unnecessary browser features)
  c.res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Strict Transport Security (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    c.res.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
}
