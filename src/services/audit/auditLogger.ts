/**
 * Audit Logger Service
 *
 * Tracks admin actions for security monitoring.
 * Logs are stored in localStorage with a rolling window.
 */

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'SETTINGS_VIEW'
  | 'SETTINGS_UPDATE'
  | 'SETTINGS_EXPORT'
  | 'SETTINGS_IMPORT'
  | 'SETTINGS_RESET'
  | 'API_KEY_CHANGE'
  | 'CACHE_CLEAR'
  | 'ADMIN_ACCESS';

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  user: string | null;
  details: Record<string, unknown>;
  userAgent: string;
  success: boolean;
}

const AUDIT_LOG_KEY = 'pulse_audit_log';
const MAX_ENTRIES = 500;
const RETENTION_DAYS = 30;

/**
 * Get all audit entries
 */
export function getAuditLog(): AuditEntry[] {
  try {
    const data = localStorage.getItem(AUDIT_LOG_KEY);
    if (!data) {return [];}
    return JSON.parse(data) as AuditEntry[];
  } catch {
    return [];
  }
}

/**
 * Add an audit entry
 */
export function logAuditEvent(
  action: AuditAction,
  details: Record<string, unknown> = {},
  success = true
): void {
  try {
    const entries = getAuditLog();

    // Get current user from session
    const sessionData = localStorage.getItem('pulse_mock_session');
    let user: string | null = null;
    if (sessionData) {
      try {
        const { user: sessionUser } = JSON.parse(sessionData);
        user = sessionUser?.email || null;
      } catch {
        // Ignore parse errors
      }
    }

    // Create new entry
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      user,
      details: sanitizeDetails(details),
      userAgent: navigator.userAgent,
      success,
    };

    // Add to beginning
    entries.unshift(entry);

    // Cleanup old entries
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    const filteredEntries = entries
      .filter((e) => new Date(e.timestamp) > cutoffDate)
      .slice(0, MAX_ENTRIES);

    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(filteredEntries));

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Audit] ${action}`, { user, details, success });
    }
  } catch (error) {
    console.error('[Audit] Failed to log event:', error);
  }
}

/**
 * Sanitize details to remove sensitive data
 */
function sanitizeDetails(details: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...details };

  // List of keys to redact
  const sensitiveKeys = ['password', 'apiKey', 'token', 'secret', 'key'];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Clear audit log (admin action)
 */
export function clearAuditLog(): void {
  logAuditEvent('SETTINGS_UPDATE', { action: 'clear_audit_log' });
  localStorage.removeItem(AUDIT_LOG_KEY);
}

/**
 * Export audit log as JSON
 */
export function exportAuditLog(): string {
  logAuditEvent('SETTINGS_EXPORT', { type: 'audit_log' });
  return JSON.stringify(getAuditLog(), null, 2);
}

/**
 * Get audit summary stats
 */
export function getAuditSummary(): {
  totalEvents: number;
  loginAttempts: number;
  failedLogins: number;
  settingsChanges: number;
  lastActivity: string | null;
} {
  const entries = getAuditLog();

  return {
    totalEvents: entries.length,
    loginAttempts: entries.filter((e) => e.action === 'LOGIN' || e.action === 'LOGIN_FAILED').length,
    failedLogins: entries.filter((e) => e.action === 'LOGIN_FAILED').length,
    settingsChanges: entries.filter((e) =>
      ['SETTINGS_UPDATE', 'SETTINGS_RESET', 'API_KEY_CHANGE'].includes(e.action)
    ).length,
    lastActivity: entries[0]?.timestamp || null,
  };
}
