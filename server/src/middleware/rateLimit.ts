// Simple rate limiting middleware
import type { Context, Next } from 'hono';
import { config } from '../config/env';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const rateLimitMiddleware = async (c: Context, next: Next) => {
  // Get client identifier (IP address)
  const clientId = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(clientId);

  if (!entry || now > entry.resetAt) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(clientId, entry);
  }

  // Increment request count
  entry.count++;

  // Set rate limit headers
  c.header('X-RateLimit-Limit', maxRequests.toString());
  c.header('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString());
  c.header('X-RateLimit-Reset', new Date(entry.resetAt).toISOString());

  // Check if rate limit exceeded
  if (entry.count > maxRequests) {
    return c.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      },
      429
    );
  }

  await next();
};
