import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface DataSource {
  name: string;
  lastUpdate: Date | null;
  status: 'fresh' | 'stale' | 'error' | 'loading';
}

interface LastUpdateIndicatorProps {
  className?: string;
}

// Global store for update times (shared across components)
const updateStore: Record<string, { timestamp: Date; status: 'fresh' | 'stale' | 'error' }> = {};

// Function to register updates from other components
export function registerDataUpdate(source: string, status: 'fresh' | 'error' = 'fresh') {
  updateStore[source] = { timestamp: new Date(), status };
  // Dispatch custom event to notify the indicator
  window.dispatchEvent(new CustomEvent('data-update', { detail: { source, status } }));
}

export function LastUpdateIndicator({ className = '' }: LastUpdateIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { name: 'SPY', lastUpdate: null, status: 'loading' },
    { name: 'VIX', lastUpdate: null, status: 'loading' },
    { name: 'Fear & Greed', lastUpdate: null, status: 'loading' },
    { name: 'News', lastUpdate: null, status: 'loading' },
  ]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for data updates
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      const { source, status } = event.detail;
      setDataSources(prev => prev.map(ds => {
        if (ds.name === source ||
            (source === 'stock:SPY' && ds.name === 'SPY') ||
            (source === 'stock:^VIX' && ds.name === 'VIX') ||
            (source === 'fearGreed' && ds.name === 'Fear & Greed') ||
            (source === 'news' && ds.name === 'News')) {
          return { ...ds, lastUpdate: new Date(), status: status === 'error' ? 'error' : 'fresh' };
        }
        return ds;
      }));
    };

    window.addEventListener('data-update', handleDataUpdate as EventListener);
    return () => window.removeEventListener('data-update', handleDataUpdate as EventListener);
  }, []);

  // Calculate the most recent update
  const lastGlobalUpdate = useMemo(() => {
    const updates = dataSources
      .filter(ds => ds.lastUpdate !== null)
      .map(ds => ds.lastUpdate!.getTime());

    if (updates.length === 0) return null;
    return new Date(Math.max(...updates));
  }, [dataSources]);

  // Format time as HH:MM:SS
  const formatTime = (date: Date | null): string => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Calculate seconds since last update
  const getSecondsSince = (date: Date | null): number => {
    if (!date) return -1;
    return Math.floor((currentTime.getTime() - date.getTime()) / 1000);
  };

  // Get status color
  const getStatusColor = (seconds: number): string => {
    if (seconds < 0) return 'text-gray-500';
    if (seconds < 30) return 'text-green-400';
    if (seconds < 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const allLoading = dataSources.every(ds => ds.status === 'loading');
  const hasErrors = dataSources.some(ds => ds.status === 'error');
  const freshCount = dataSources.filter(ds => ds.status === 'fresh').length;

  return (
    <div className={`p-3 rounded-lg bg-gray-800/50 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Current Time */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-400">Ora curentă:</span>
          <span className="text-sm font-mono text-white font-semibold">
            {formatTime(currentTime)}
          </span>
        </div>

        {/* Last Update Time */}
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${allLoading ? 'animate-spin text-blue-400' : 'text-green-400'}`} />
          <span className="text-sm text-gray-400">Ultima actualizare:</span>
          <span className={`text-sm font-mono font-semibold ${getStatusColor(getSecondsSince(lastGlobalUpdate))}`}>
            {formatTime(lastGlobalUpdate)}
          </span>
          {lastGlobalUpdate && (
            <span className="text-xs text-gray-500">
              (acum {getSecondsSince(lastGlobalUpdate)}s)
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {allLoading ? (
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Se încarcă...
            </Badge>
          ) : hasErrors ? (
            <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
              <AlertCircle className="w-3 h-3 mr-1" />
              Erori
            </Badge>
          ) : (
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live ({freshCount}/{dataSources.length})
            </Badge>
          )}
        </div>
      </div>

      {/* Individual Data Sources - Compact View */}
      <div className="mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-4 flex-wrap text-xs">
          {dataSources.map((source) => {
            const seconds = getSecondsSince(source.lastUpdate);
            return (
              <div key={source.name} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  source.status === 'loading' ? 'bg-blue-400 animate-pulse' :
                  source.status === 'error' ? 'bg-red-400' :
                  seconds < 30 ? 'bg-green-400' :
                  seconds < 60 ? 'bg-yellow-400' : 'bg-orange-400'
                }`} />
                <span className="text-gray-400">{source.name}:</span>
                <span className={`font-mono ${getStatusColor(seconds)}`}>
                  {source.status === 'loading' ? '...' : formatTime(source.lastUpdate)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
