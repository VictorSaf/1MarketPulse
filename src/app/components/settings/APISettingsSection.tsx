/**
 * APISettingsSection Component
 *
 * Configuration section for API keys and endpoints.
 */

import { useState } from 'react';

import { Key, Globe, Brain, TrendingUp, Activity, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { NumberInput } from './NumberInput';
import { SettingsSection, SettingsRow, SettingsGroup } from './SettingsSection';
import { TextInput } from './TextInput';
import { ToggleSwitch } from './ToggleSwitch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

import type { APISettings } from '../../../services/settings/settingsStore';


interface APISettingsSectionProps {
  settings: APISettings;
  onUpdate: (settings: Partial<APISettings>) => void;
  onReset: () => void;
}

export function APISettingsSection({ settings, onUpdate, onReset }: APISettingsSectionProps) {
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error'>>({});

  const testConnection = async (service: string, url: string) => {
    setTesting(service);
    setTestResults((prev) => ({ ...prev, [service]: undefined as any }));

    try {
      const testUrls: Record<string, string> = {
        finnhub: `${settings.backend.url}/api/health/services`,
        coingecko: `${settings.backend.url}/api/health/services`,
        backend: `${settings.backend.url}/api/health`,
        ollama: `${settings.ollama.endpoint}/api/tags`,
      };

      const response = await fetch(testUrls[service] || url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        setTestResults((prev) => ({ ...prev, [service]: 'success' }));
        toast.success(`${service} connection successful`);
      } else {
        setTestResults((prev) => ({ ...prev, [service]: 'error' }));
        toast.error(`${service} connection failed: ${response.status}`);
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [service]: 'error' }));
      toast.error(`${service} connection failed`);
    } finally {
      setTesting(null);
      // Clear result after 3 seconds
      setTimeout(() => {
        setTestResults((prev) => {
          const newResults = { ...prev };
          delete newResults[service];
          return newResults;
        });
      }, 3000);
    }
  };

  const TestButton = ({ service, url }: { service: string; url: string }) => (
    <Button
      className="ml-2"
      disabled={testing === service}
      size="sm"
      variant="ghost"
      onClick={() => testConnection(service, url)}
    >
      {testing === service ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : testResults[service] === 'success' ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : testResults[service] === 'error' ? (
        <XCircle className="w-4 h-4 text-red-400" />
      ) : (
        'Test'
      )}
    </Button>
  );

  return (
    <SettingsSection
      description="Configure API keys, endpoints, and connection settings for external services"
      icon={Key}
      iconColor="from-blue-500 to-cyan-600"
      title="API Configuration"
      onReset={onReset}
    >
      {/* Backend API */}
      <SettingsGroup title="Backend Server">
        <SettingsRow
          description="URL of the backend API server"
          label="Backend URL"
        >
          <div className="flex items-center">
            <TextInput
              className="w-64"
              placeholder="http://localhost:3001"
              value={settings.backend.url}
              onChange={(url) => onUpdate({ backend: { ...settings.backend, url } })}
            />
            <TestButton service="backend" url={settings.backend.url} />
          </div>
        </SettingsRow>

        <SettingsRow
          description="Use backend server for API calls"
          label="Enable Backend"
        >
          <ToggleSwitch
            checked={settings.backend.enabled}
            onChange={(enabled) => onUpdate({ backend: { ...settings.backend, enabled } })}
          />
        </SettingsRow>

        <SettingsRow
          description="Fallback to direct API calls if backend is unavailable"
          label="Fallback to Direct"
        >
          <ToggleSwitch
            checked={settings.backend.fallbackToDirect}
            onChange={(fallbackToDirect) =>
              onUpdate({ backend: { ...settings.backend, fallbackToDirect } })
            }
          />
        </SettingsRow>

        <SettingsRow
          description="Request timeout in milliseconds"
          label="Timeout"
        >
          <NumberInput
            max={60000}
            min={1000}
            step={1000}
            suffix="ms"
            value={settings.backend.timeout}
            onChange={(timeout) => onUpdate({ backend: { ...settings.backend, timeout } })}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Finnhub API */}
      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="Finnhub API">
        <SettingsRow
          description="Your Finnhub API key for stock market data"
          label="API Key"
        >
          <div className="flex items-center">
            <TextInput
              sensitive
              className="w-64"
              placeholder="Enter API key"
              value={settings.finnhub.apiKey}
              onChange={(apiKey) => onUpdate({ finnhub: { ...settings.finnhub, apiKey } })}
            />
            <TestButton service="finnhub" url="" />
          </div>
        </SettingsRow>

        <SettingsRow
          description="Enable stock market data from Finnhub"
          label="Enable Finnhub"
        >
          <ToggleSwitch
            checked={settings.finnhub.enabled}
            onChange={(enabled) => onUpdate({ finnhub: { ...settings.finnhub, enabled } })}
          />
        </SettingsRow>

        <SettingsRow
          description="Request timeout in milliseconds"
          label="Timeout"
        >
          <NumberInput
            max={30000}
            min={1000}
            step={1000}
            suffix="ms"
            value={settings.finnhub.timeout}
            onChange={(timeout) => onUpdate({ finnhub: { ...settings.finnhub, timeout } })}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* CoinGecko API */}
      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="CoinGecko API">
        <SettingsRow
          description="Optional API key for higher rate limits"
          label="API Key (Optional)"
        >
          <TextInput
            sensitive
            className="w-64"
            placeholder="Not required"
            value={settings.coinGecko.apiKey}
            onChange={(apiKey) => onUpdate({ coinGecko: { ...settings.coinGecko, apiKey } })}
          />
        </SettingsRow>

        <SettingsRow
          description="Enable cryptocurrency data from CoinGecko"
          label="Enable CoinGecko"
        >
          <ToggleSwitch
            checked={settings.coinGecko.enabled}
            onChange={(enabled) => onUpdate({ coinGecko: { ...settings.coinGecko, enabled } })}
          />
        </SettingsRow>

        <SettingsRow
          description="Request timeout in milliseconds"
          label="Timeout"
        >
          <NumberInput
            max={30000}
            min={1000}
            step={1000}
            suffix="ms"
            value={settings.coinGecko.timeout}
            onChange={(timeout) => onUpdate({ coinGecko: { ...settings.coinGecko, timeout } })}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Ollama (Local AI) */}
      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="Ollama (Local AI)">
        <SettingsRow
          description="Local Ollama server endpoint"
          label="Endpoint"
        >
          <div className="flex items-center">
            <TextInput
              className="w-64"
              placeholder="http://localhost:11434"
              value={settings.ollama.endpoint}
              onChange={(endpoint) => onUpdate({ ollama: { ...settings.ollama, endpoint } })}
            />
            <TestButton service="ollama" url={settings.ollama.endpoint} />
          </div>
        </SettingsRow>

        <SettingsRow
          description="Ollama model to use for analysis"
          label="Model"
        >
          <TextInput
            className="w-64"
            placeholder="llama3.2:3b"
            value={settings.ollama.model}
            onChange={(model) => onUpdate({ ollama: { ...settings.ollama, model } })}
          />
        </SettingsRow>

        <SettingsRow
          description="Enable local AI analysis features"
          label="Enable Ollama"
        >
          <ToggleSwitch
            checked={settings.ollama.enabled}
            onChange={(enabled) => onUpdate({ ollama: { ...settings.ollama, enabled } })}
          />
        </SettingsRow>

        <SettingsRow
          description="AI request timeout in milliseconds"
          label="Timeout"
        >
          <NumberInput
            max={120000}
            min={5000}
            step={5000}
            suffix="ms"
            value={settings.ollama.timeout}
            onChange={(timeout) => onUpdate({ ollama: { ...settings.ollama, timeout } })}
          />
        </SettingsRow>
      </SettingsGroup>
    </SettingsSection>
  );
}
