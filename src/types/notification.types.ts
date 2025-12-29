/**
 * Notification Types
 *
 * Type definitions for application notifications.
 */

/**
 * Represents a user notification displayed in the notification dropdown
 */
export interface Notification {
  /** Unique identifier for the notification */
  id: string;
  /** Title of the notification */
  title: string;
  /** Detailed message content */
  message: string;
  /** Human-readable time string (e.g., "2 hours ago") */
  time: string;
  /** Type of notification affecting icon and styling */
  type: 'alert' | 'achievement' | 'insight' | 'reminder';
}
