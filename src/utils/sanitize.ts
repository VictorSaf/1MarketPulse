/**
 * Sanitization utilities for XSS protection
 * Uses DOMPurify to sanitize user input and external content
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize text content (strips all HTML)
 * Use for plain text that should never contain HTML
 */
export function sanitizeText(text: string | undefined | null): string {
  if (!text) return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Sanitize HTML content with safe defaults
 * Allows basic formatting tags but strips scripts and dangerous attributes
 */
export function sanitizeHTML(html: string | undefined | null): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize URL - validates and sanitizes URLs
 * Prevents javascript: and data: URLs
 */
export function sanitizeURL(url: string | undefined | null): string {
  if (!url) return '';

  // Basic sanitization
  const cleaned = DOMPurify.sanitize(url, { ALLOWED_TAGS: [] });

  // Check for valid protocol
  try {
    const parsed = new URL(cleaned);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return cleaned;
    }
    return '';
  } catch {
    // If it's a relative URL, allow it
    if (cleaned.startsWith('/') || cleaned.startsWith('./')) {
      return cleaned;
    }
    return '';
  }
}

/**
 * Sanitize a news item object
 * Cleans all text fields that could contain malicious content
 */
export function sanitizeNewsItem<T extends {
  title?: string;
  summary?: string;
  source?: string;
  category?: string;
  url?: string;
}>(item: T): T {
  return {
    ...item,
    title: sanitizeText(item.title),
    summary: sanitizeText(item.summary),
    source: sanitizeText(item.source),
    category: sanitizeText(item.category),
    url: sanitizeURL(item.url),
  };
}

/**
 * Sanitize AI response content
 * Strips all HTML since AI responses should be plain text
 */
export function sanitizeAIResponse(content: string | undefined | null): string {
  return sanitizeText(content);
}
