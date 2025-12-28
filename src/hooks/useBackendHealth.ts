/**
 * Backend Health Check Hook
 * Monitors backend connectivity and displays status
 */

import { useState, useEffect, useCallback } from 'react';

import { BACKEND_URL } from '@/config/backend.config';

export interface BackendHealthStatus {
  isHealthy: boolean;
  isChecking: boolean;
  lastCheck: Date | null;
  error: string | null;
  services: {
    finnhub: boolean;
    coingecko: boolean;
    feargreed: boolean;
  } | null;
}

export function useBackendHealth(checkInterval = 60000) {
  const [status, setStatus] = useState<BackendHealthStatus>({
    isHealthy: false,
    isChecking: true,
    lastCheck: null,
    error: null,
    services: null,
  });

  const checkHealth = useCallback(async () => {
    setStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${BACKEND_URL}/api/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();

      // Also check services endpoint for detailed status
      let services = null;
      try {
        const servicesResponse = await fetch(`${BACKEND_URL}/api/health/services`);
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          services = {
            finnhub: servicesData.services?.finnhub?.status === 'ok',
            coingecko: servicesData.services?.coingecko?.status === 'ok',
            feargreed: servicesData.services?.feargreed?.status === 'ok',
          };
        }
      } catch {
        // Services check is optional
      }

      setStatus({
        isHealthy: data.status === 'ok',
        isChecking: false,
        lastCheck: new Date(),
        error: null,
        services,
      });
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.name === 'AbortError'
          ? 'Backend not responding (timeout)'
          : err.message
        : 'Unknown error';

      setStatus({
        isHealthy: false,
        isChecking: false,
        lastCheck: new Date(),
        error: errorMessage,
        services: null,
      });
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Periodic health checks
  useEffect(() => {
    if (checkInterval > 0) {
      const interval = setInterval(checkHealth, checkInterval);
      return () => clearInterval(interval);
    }
  }, [checkHealth, checkInterval]);

  return {
    ...status,
    recheckNow: checkHealth,
  };
}
