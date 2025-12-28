/**
 * HealthStatusBadge Component
 *
 * Displays the health status of a service with color-coded indicator
 * and optional latency information.
 */

import { Activity, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

import { Badge } from './ui/badge';

interface HealthStatusBadgeProps {
  status: 'healthy' | 'unhealthy' | 'unknown';
  latency?: number;
  showIcon?: boolean;
  showLatency?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthStatusBadge({
  status,
  latency,
  showIcon = true,
  showLatency = true,
  size = 'md',
}: HealthStatusBadgeProps) {
  // Determine badge style based on status
  const getStatusStyle = () => {
    switch (status) {
      case 'healthy':
        return {
          className: 'bg-green-500/20 text-green-300 border-green-400/30',
          icon: CheckCircle,
          label: 'Live',
          emoji: '🟢',
        };
      case 'unhealthy':
        return {
          className: 'bg-red-500/20 text-red-300 border-red-400/30',
          icon: AlertCircle,
          label: 'Down',
          emoji: '🔴',
        };
      case 'unknown':
      default:
        return {
          className: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
          icon: HelpCircle,
          label: 'Unknown',
          emoji: '⚪',
        };
    }
  };

  // Determine latency color
  const getLatencyColor = (ms: number) => {
    if (ms < 100) {return 'text-green-300';}
    if (ms < 300) {return 'text-yellow-300';}
    return 'text-red-300';
  };

  const style = getStatusStyle();
  const Icon = showIcon ? style.icon : null;

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge className={`${style.className} ${sizeClasses[size]} flex items-center gap-1.5`}>
      {showIcon && Icon && <Icon className="w-3 h-3" />}
      <span>{style.label}</span>
      {showLatency && latency !== undefined && status === 'healthy' && (
        <span className={`ml-1 ${getLatencyColor(latency)}`}>
          {latency}ms
        </span>
      )}
    </Badge>
  );
}

interface HealthStatusIndicatorProps {
  status: 'healthy' | 'unhealthy' | 'unknown';
  label?: string;
  description?: string;
  latency?: number;
  lastCheck?: number;
  className?: string;
}

export function HealthStatusIndicator({
  status,
  label,
  description,
  latency,
  lastCheck,
  className = '',
}: HealthStatusIndicatorProps) {
  const getStatusEmoji = () => {
    switch (status) {
      case 'healthy':
        return '🟢';
      case 'unhealthy':
        return '🔴';
      case 'unknown':
      default:
        return '⚪';
    }
  };

  const formatTimeSince = (timestamp?: number) => {
    if (!timestamp) {return '-';}

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) {return `${seconds}s ago`;}
    if (seconds < 3600) {return `${Math.floor(seconds / 60)}m ago`;}
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getStatusEmoji()}</span>
        <div>
          {label && <p className="text-white font-medium">{label}</p>}
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {latency !== undefined && status === 'healthy' && (
          <div className="text-center">
            <p className="text-gray-500 text-xs">Latency</p>
            <p className={latency < 100 ? 'text-green-300' : latency < 300 ? 'text-yellow-300' : 'text-red-300'}>
              {latency}ms
            </p>
          </div>
        )}
        <div className="text-center">
          <p className="text-gray-500 text-xs">Last Check</p>
          <p className="text-gray-300">{formatTimeSince(lastCheck)}</p>
        </div>
      </div>
    </div>
  );
}

interface LiveIndicatorProps {
  isLive: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LiveIndicator({ isLive, size = 'md' }: LiveIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
      <span className={`text-sm font-medium ${isLive ? 'text-green-300' : 'text-gray-400'}`}>
        {isLive ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  );
}
