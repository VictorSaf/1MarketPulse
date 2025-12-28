/**
 * Backend Status Banner
 * Displays a warning when the backend is not connected
 */

import { memo } from 'react';

import { AlertTriangle, RefreshCw, Server, CheckCircle } from 'lucide-react';

import { useBackendHealth } from '@/hooks/useBackendHealth';

import { Button } from './ui/button';

export const BackendStatusBanner = memo(function BackendStatusBanner() {
  const { isHealthy, isChecking, error, services, recheckNow } = useBackendHealth(30000);

  // Don't show anything if healthy and not checking
  if (isHealthy && !isChecking) {
    return null;
  }

  // Show checking state only on initial load
  if (isChecking && error === null) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-sm text-blue-300">Connecting to backend server...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (!isHealthy) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-300 mb-1">
              Backend Server Not Connected
            </h4>
            <p className="text-xs text-red-300/80 mb-2">
              {error || 'Unable to connect to the backend API server.'}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Make sure the backend is running: <code className="bg-gray-800 px-1 rounded">cd server && npm run dev</code>
            </p>
            <Button
              className="border-red-400/30 text-red-300 hover:bg-red-500/10"
              disabled={isChecking}
              size="sm"
              variant="outline"
              onClick={recheckNow}
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry Connection
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show service status if some services are down
  if (services && (!services.finnhub || !services.coingecko || !services.feargreed)) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-yellow-400" />
          <div className="flex-1">
            <span className="text-sm text-yellow-300">Some data services unavailable:</span>
            <div className="flex gap-3 mt-1 text-xs">
              <span className={services.finnhub ? 'text-green-400' : 'text-red-400'}>
                {services.finnhub ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                Finnhub
              </span>
              <span className={services.coingecko ? 'text-green-400' : 'text-red-400'}>
                {services.coingecko ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                CoinGecko
              </span>
              <span className={services.feargreed ? 'text-green-400' : 'text-red-400'}>
                {services.feargreed ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                Fear & Greed
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
});
