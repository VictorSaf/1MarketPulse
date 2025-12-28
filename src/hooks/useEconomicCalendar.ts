/**
 * React Hook for Economic Calendar
 * Fetches economic events from the backend API
 */

import { useState, useEffect, useCallback } from 'react';

import { BACKEND_URL } from '@/config';

interface CalendarEvent {
  id: string;
  time: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  country: string;
  previous: string;
  forecast: string;
  actual?: string;
  unit?: string;
}

export interface UseEconomicCalendarOptions {
  pollingInterval?: number;
  enabled?: boolean;
}

export interface UseEconomicCalendarResult {
  events: CalendarEvent[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch economic calendar events
 *
 * @example
 * const { events, loading, error } = useEconomicCalendar({
 *   pollingInterval: 1800000 // 30 minutes
 * });
 */
export function useEconomicCalendar(
  options: UseEconomicCalendarOptions = {}
): UseEconomicCalendarResult {
  const {
    pollingInterval = 1800000, // Default: 30 minutes
    enabled = true
  } = options;

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch calendar events
   */
  const fetchCalendar = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/market/calendar/economic`);

      if (!response.ok) {
        throw new Error(`Failed to fetch economic calendar: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setEvents(result.data);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch economic calendar');
      }
    } catch (err) {
      console.error('useEconomicCalendar error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchCalendar();
  }, [fetchCalendar]);

  /**
   * Set up initial fetch and polling
   */
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let mounted = true;
    let intervalId: NodeJS.Timeout;

    // Initial fetch
    fetchCalendar();

    // Set up polling
    if (pollingInterval > 0) {
      intervalId = setInterval(() => {
        if (mounted) {
          fetchCalendar();
        }
      }, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enabled, fetchCalendar, pollingInterval]);

  return {
    events,
    loading,
    error,
    refetch
  };
}
