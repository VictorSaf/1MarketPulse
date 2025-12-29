/**
 * Date Utility Functions
 *
 * Common date/time formatting and manipulation utilities.
 */

/**
 * Formats a timestamp as a human-readable "time ago" string.
 *
 * @param timestamp - Unix timestamp in milliseconds, Date object, or ISO string
 * @returns A human-readable string like "2m ago", "3h ago", "1d ago"
 *
 * @example
 * getTimeAgo(Date.now() - 120000) // "2m ago"
 * getTimeAgo(new Date('2024-01-01')) // "365d ago" (approximately)
 */
export function getTimeAgo(timestamp: number | Date | string): string {
  const time = typeof timestamp === 'number'
    ? timestamp
    : new Date(timestamp).getTime();

  const seconds = Math.floor((Date.now() - time) / 1000);

  if (seconds < 0) {
    return 'just now';
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
