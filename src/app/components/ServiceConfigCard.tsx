/**
 * ServiceConfigCard Component
 *
 * Configurable service card with status, settings, and test functionality.
 */

import { useState } from 'react';

import {
  Activity,
  Settings,
  TrendingUp,
  Database,
  Brain,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';

import { HealthStatusBadge } from './HealthStatusBadge';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


import type { LucideIcon } from 'lucide-react';

interface ServiceConfig {
  [key: string]: string | number | boolean;
}

interface ServiceConfigCardProps {
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  description: string;
  config: ServiceConfig;
  icon?: LucideIcon;
  color?: string;
  latency?: number;
  lastCheck?: number;
  onTest?: () => Promise<boolean>;
  onSave?: (config: ServiceConfig) => void;
  editable?: boolean;
}

export function ServiceConfigCard({
  name,
  status,
  description,
  config,
  icon: Icon = Settings,
  color = 'from-blue-500 to-purple-600',
  latency,
  lastCheck,
  onTest,
  onSave,
  editable = false,
}: ServiceConfigCardProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState(config);

  const handleTest = async () => {
    if (!onTest) {return;}

    setTesting(true);
    setTestResult(null);

    try {
      const success = await onTest();
      setTestResult(success ? 'success' : 'error');
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      setTestResult('error');
      setTimeout(() => setTestResult(null), 3000);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedConfig);
      setIsEditing(false);
    }
  };

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) {return '••••••••';}
    return key.substring(0, 4) + '••••' + key.substring(key.length - 4);
  };

  const formatTimeSince = (timestamp?: number) => {
    if (!timestamp) {return '-';}
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) {return `${seconds}s ago`;}
    if (seconds < 3600) {return `${Math.floor(seconds / 60)}m ago`;}
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              <HealthStatusBadge latency={latency} showLatency={false} status={status} />
            </div>
            <p className="text-sm text-gray-400">{description}</p>
            {lastCheck && (
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {formatTimeSince(lastCheck)}
              </p>
            )}
          </div>
        </div>

        {/* Test Button */}
        {onTest && (
          <Button
            className="flex items-center gap-2"
            disabled={testing}
            size="sm"
            variant="ghost"
            onClick={handleTest}
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testare...
              </>
            ) : testResult === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                Success
              </>
            ) : testResult === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-400" />
                Failed
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Test
              </>
            )}
          </Button>
        )}
      </div>

      {/* Configuration Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {Object.entries(editedConfig).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              {formatKey(key)}
            </label>

            {/* API Key Field */}
            {key.toLowerCase().includes('key') && value !== 'Not required' && typeof value === 'string' ? (
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={!isEditing}
                  type={showApiKey ? 'text' : 'password'}
                  value={isEditing ? value : maskApiKey(value)}
                  onChange={(e) => setEditedConfig({ ...editedConfig, [key]: e.target.value })}
                />
                <Button
                  className="flex-shrink-0"
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            ) : key === 'enabled' && typeof value === 'boolean' ? (
              /* Toggle Switch */
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  checked={value}
                  className="sr-only peer"
                  disabled={!isEditing}
                  type="checkbox"
                  onChange={(e) => setEditedConfig({ ...editedConfig, [key]: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50" />
              </label>
            ) : isEditing && typeof value === 'string' ? (
              /* Editable Text Field */
              <input
                className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={value}
                onChange={(e) => setEditedConfig({ ...editedConfig, [key]: e.target.value })}
              />
            ) : (
              /* Read-only Display */
              <p className="text-white font-medium">{String(value)}</p>
            )}
          </div>
        ))}
      </div>

      {/* Edit/Save Buttons */}
      {editable && (
        <div className="mt-4 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditedConfig(config);
                }}
              >
                Anulare
              </Button>
              <Button
                className="bg-gradient-to-r from-green-500 to-blue-600"
                size="sm"
                onClick={handleSave}
              >
                Salvare
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Editare
            </Button>
          )}
        </div>
      )}

      {/* Latency Display */}
      {latency !== undefined && status === 'healthy' && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Response Time</span>
            <span className={latency < 100 ? 'text-green-300' : latency < 300 ? 'text-yellow-300' : 'text-red-300'}>
              {latency}ms
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
