/**
 * SystemHealthSection Component
 *
 * Displays system health status for all services including backend,
 * external APIs, and local AI services.
 */

import { useState, useEffect, useCallback } from 'react';

import {
  Activity,
  RefreshCw,
  Server,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  Database,
  Brain,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { BACKEND_URL } from '@/config/backend.config';
import { useSettingsStore, selectAPISettings } from '@/services/settings/settingsStore';

import { SettingsSection, SettingsRow, SettingsGroup } from './SettingsSection';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown' | 'checking';
  latency?: number;
  lastCheck?: Date;
  error?: string;
  details?: string;
}

const AUTO_REFRESH_INTERVALS = [
  { label: 'Off', value: 0 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
];

export function SystemHealthSection() {
  const [services, setServices] = useState<ServiceHealth[]>([
    { name: 'Backend Server', status: 'unknown' },
    { name: 'Finnhub API', status: 'unknown' },
    { name: 'CoinGecko API', status: 'unknown' },
    { name: 'Fear & Greed Index', status: 'unknown' },
    { name: 'Ollama (Local AI)', status: 'unknown' },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFullCheck, setLastFullCheck] = useState<Date | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30); // Default 30s
  const [nextRefreshIn, setNextRefreshIn] = useState<number | null>(null);

  const apiSettings = useSettingsStore(selectAPISettings);

  const checkService = async (
    name: string,
    checkFn: () => Promise<{ healthy: boolean; latency: number; details?: string }>
  ): Promise<ServiceHealth> => {
    try {
      const startTime = Date.now();
      const result = await checkFn();
      return {
        name,
        status: result.healthy ? 'healthy' : 'unhealthy',
        latency: result.latency || Date.now() - startTime,
        lastCheck: new Date(),
        details: result.details,
      };
    } catch (error) {
      return {
        name,
        status: 'unhealthy',
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  };

  const checkAllServices = useCallback(async () => {
    setIsRefreshing(true);

    // Set all to checking
    setServices(prev => prev.map(s => ({ ...s, status: 'checking' as const })));

    const checks: Promise<ServiceHealth>[] = [
      // Backend Server
      checkService('Backend Server', async () => {
        const start = Date.now();
        const response = await fetch(`${apiSettings.backend.url}/api/health`, {
          signal: AbortSignal.timeout(5000),
        });
        const data = await response.json();
        return {
          healthy: response.ok && data.status === 'ok',
          latency: Date.now() - start,
          details: data.version ? `v${data.version}` : undefined,
        };
      }),

      // Finnhub API (via backend)
      checkService('Finnhub API', async () => {
        const start = Date.now();
        const response = await fetch(`${apiSettings.backend.url}/api/health/services`, {
          signal: AbortSignal.timeout(5000),
        });
        const data = await response.json();
        return {
          healthy: response.ok && data.services?.finnhub?.status === 'ok',
          latency: Date.now() - start,
          details: data.services?.finnhub?.rateLimit ?
            `${data.services.finnhub.rateLimit.remaining}/${data.services.finnhub.rateLimit.limit} calls remaining` :
            undefined,
        };
      }),

      // CoinGecko API (via backend)
      checkService('CoinGecko API', async () => {
        const start = Date.now();
        const response = await fetch(`${apiSettings.backend.url}/api/health/services`, {
          signal: AbortSignal.timeout(5000),
        });
        const data = await response.json();
        return {
          healthy: response.ok && data.services?.coingecko?.status === 'ok',
          latency: Date.now() - start,
        };
      }),

      // Fear & Greed Index (via backend)
      checkService('Fear & Greed Index', async () => {
        const start = Date.now();
        const response = await fetch(`${apiSettings.backend.url}/api/health/services`, {
          signal: AbortSignal.timeout(5000),
        });
        const data = await response.json();
        return {
          healthy: response.ok && data.services?.feargreed?.status === 'ok',
          latency: Date.now() - start,
        };
      }),

      // Ollama (Local AI)
      checkService('Ollama (Local AI)', async () => {
        const start = Date.now();
        const response = await fetch(`${apiSettings.ollama.endpoint}/api/tags`, {
          signal: AbortSignal.timeout(5000),
        });
        const data = await response.json();
        const modelCount = data.models?.length || 0;
        return {
          healthy: response.ok,
          latency: Date.now() - start,
          details: modelCount > 0 ? `${modelCount} model${modelCount !== 1 ? 's' : ''} available` : 'No models installed',
        };
      }),
    ];

    const results = await Promise.all(checks);
    setServices(results);
    setLastFullCheck(new Date());
    setIsRefreshing(false);

    // Show summary toast
    const healthyCount = results.filter(s => s.status === 'healthy').length;
    const totalCount = results.length;

    if (healthyCount === totalCount) {
      toast.success('All services are healthy');
    } else if (healthyCount === 0) {
      toast.error('All services are unavailable');
    } else {
      toast.warning(`${healthyCount}/${totalCount} services healthy`);
    }
  }, [apiSettings.backend.url, apiSettings.ollama.endpoint]);

  // Initial check on mount
  useEffect(() => {
    checkAllServices();
  }, [checkAllServices]);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefreshInterval === 0) {
      setNextRefreshIn(null);
      return;
    }

    // Set initial countdown
    setNextRefreshIn(autoRefreshInterval);

    // Countdown timer (updates every second)
    const countdownId = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev === null || prev <= 1) {
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    // Actual refresh timer
    const refreshId = setInterval(() => {
      checkAllServices();
    }, autoRefreshInterval * 1000);

    return () => {
      clearInterval(countdownId);
      clearInterval(refreshId);
    };
  }, [autoRefreshInterval, checkAllServices]);

  const getStatusIcon = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
            Healthy
          </Badge>
        );
      case 'unhealthy':
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
            Unavailable
          </Badge>
        );
      case 'checking':
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
            Checking...
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30">
            Unknown
          </Badge>
        );
    }
  };

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Backend Server':
        return <Server className="w-5 h-5" />;
      case 'Finnhub API':
        return <TrendingUp className="w-5 h-5" />;
      case 'CoinGecko API':
        return <Database className="w-5 h-5" />;
      case 'Fear & Greed Index':
        return <Activity className="w-5 h-5" />;
      case 'Ollama (Local AI)':
        return <Brain className="w-5 h-5" />;
      default:
        return <Wifi className="w-5 h-5" />;
    }
  };

  const getLatencyColor = (latency?: number) => {
    if (!latency) return 'text-gray-400';
    if (latency < 100) return 'text-green-300';
    if (latency < 300) return 'text-yellow-300';
    return 'text-red-300';
  };

  const formatLastCheck = (date?: Date) => {
    if (!date) return 'Never';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  // Calculate overall health
  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const totalCount = services.length;
  const overallHealth = healthyCount === totalCount ? 'healthy' : healthyCount === 0 ? 'unhealthy' : 'degraded';

  return (
    <SettingsSection
      description="Monitor the health and status of all connected services"
      icon={Activity}
      iconColor="from-orange-500 to-red-600"
      title="System Health"
    >
      {/* Overall Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-700/30 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              overallHealth === 'healthy'
                ? 'bg-green-500/20'
                : overallHealth === 'degraded'
                  ? 'bg-yellow-500/20'
                  : 'bg-red-500/20'
            }`}>
              {overallHealth === 'healthy' ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : overallHealth === 'degraded' ? (
                <Activity className="w-6 h-6 text-yellow-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {overallHealth === 'healthy'
                  ? 'All Systems Operational'
                  : overallHealth === 'degraded'
                    ? 'Partial Service Degradation'
                    : 'Major Outage'}
              </p>
              <p className="text-sm text-gray-400">
                {healthyCount} of {totalCount} services healthy
                {lastFullCheck && ` | Last checked ${formatLastCheck(lastFullCheck)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-refresh selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Auto:</span>
              <select
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              >
                {AUTO_REFRESH_INTERVALS.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
              {nextRefreshIn !== null && autoRefreshInterval > 0 && (
                <span className="text-xs text-gray-500 min-w-[40px]">
                  {nextRefreshIn}s
                </span>
              )}
            </div>

            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={isRefreshing}
              onClick={checkAllServices}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Service List */}
      <SettingsGroup title="Services">
        {services.map((service) => (
          <SettingsRow
            key={service.name}
            description={
              service.error
                ? service.error
                : service.details
                  ? service.details
                  : service.status === 'healthy'
                    ? 'Connected and responding'
                    : service.status === 'checking'
                      ? 'Checking connection...'
                      : 'Not connected'
            }
            label={service.name}
          >
            <div className="flex items-center gap-4">
              {/* Latency */}
              {service.latency !== undefined && service.status === 'healthy' && (
                <span className={`text-sm ${getLatencyColor(service.latency)}`}>
                  {service.latency}ms
                </span>
              )}

              {/* Last Check */}
              <span className="text-xs text-gray-500">
                {formatLastCheck(service.lastCheck)}
              </span>

              {/* Status Badge */}
              {getStatusBadge(service.status)}
            </div>
          </SettingsRow>
        ))}
      </SettingsGroup>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <SettingsGroup title="Connection Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-4 rounded-lg bg-gray-700/30 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Server className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Backend URL</span>
              </div>
              <p className="text-sm text-gray-400 font-mono truncate">
                {apiSettings.backend.url}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-700/30 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Ollama Endpoint</span>
              </div>
              <p className="text-sm text-gray-400 font-mono truncate">
                {apiSettings.ollama.endpoint}
              </p>
            </div>
          </div>
        </SettingsGroup>
      </div>
    </SettingsSection>
  );
}
