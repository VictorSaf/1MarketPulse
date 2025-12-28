/**
 * CacheSettingsSection Component
 *
 * Configuration section for cache TTL and management.
 */

import { useState } from 'react';

import { Database, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { NumberInput } from './NumberInput';
import { SettingsSection, SettingsRow, SettingsGroup } from './SettingsSection';
import { ToggleSwitch } from './ToggleSwitch';
import { BACKEND_URL } from '../../../config/backend.config';
import { Button } from '../ui/button';

import type { CacheSettings } from '../../../services/settings/settingsStore';



interface CacheSettingsSectionProps {
  settings: CacheSettings;
  onUpdate: (settings: Partial<CacheSettings>) => void;
  onReset: () => void;
}

export function CacheSettingsSection({
  settings,
  onUpdate,
  onReset,
}: CacheSettingsSectionProps) {
  const [clearing, setClearing] = useState(false);
  const [clearingType, setClearingType] = useState<string | null>(null);

  const clearCache = async (type?: string) => {
    const typeLabel = type || 'all';
    setClearing(true);
    setClearingType(typeLabel);

    try {
      // Clear IndexedDB cache
      const request = indexedDB.deleteDatabase('PulseCache');
      request.onsuccess = () => {
        toast.success(`${type ? `${type} cache` : 'All caches'} cleared successfully`);
      };
      request.onerror = () => {
        toast.error('Failed to clear local cache');
      };

      // Also try to clear backend cache if available
      try {
        await fetch(`${BACKEND_URL}/api/admin/cache/clear`, {
          method: 'POST',
          body: JSON.stringify({ type }),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {
        // Backend might not be available
      }
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setClearing(false);
      setClearingType(null);
    }
  };

  const formatTTL = (seconds: number): string => {
    if (seconds >= 3600) {
      return `${seconds / 3600} hour${seconds > 3600 ? 's' : ''}`;
    }
    if (seconds >= 60) {
      return `${seconds / 60} minute${seconds > 60 ? 's' : ''}`;
    }
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  };

  return (
    <SettingsSection
      description="Configure cache time-to-live (TTL) for different data types"
      icon={Database}
      iconColor="from-orange-500 to-yellow-600"
      title="Cache Settings"
      onReset={onReset}
    >
      <SettingsGroup title="General">
        <SettingsRow
          description="Cache API responses to reduce load and improve performance"
          label="Enable Caching"
        >
          <ToggleSwitch
            checked={settings.enabled}
            onChange={(enabled) => onUpdate({ enabled })}
          />
        </SettingsRow>

        <SettingsRow
          description="Maximum number of entries to keep in cache"
          label="Max Cache Entries"
        >
          <NumberInput
            max={5000}
            min={100}
            step={100}
            value={settings.maxEntries}
            onChange={(maxEntries) => onUpdate({ maxEntries })}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="TTL Settings (seconds)">
        <SettingsRow
          description={`Cache duration: ${formatTTL(settings.stockQuoteTTL)}`}
          label="Stock Quotes"
        >
          <NumberInput
            max={300}
            min={5}
            step={5}
            suffix="s"
            value={settings.stockQuoteTTL}
            onChange={(stockQuoteTTL) => onUpdate({ stockQuoteTTL })}
          />
        </SettingsRow>

        <SettingsRow
          description={`Cache duration: ${formatTTL(settings.cryptoPriceTTL)}`}
          label="Crypto Prices"
        >
          <NumberInput
            max={300}
            min={5}
            step={5}
            suffix="s"
            value={settings.cryptoPriceTTL}
            onChange={(cryptoPriceTTL) => onUpdate({ cryptoPriceTTL })}
          />
        </SettingsRow>

        <SettingsRow
          description={`Cache duration: ${formatTTL(settings.newsTTL)}`}
          label="News Articles"
        >
          <NumberInput
            max={1800}
            min={60}
            step={60}
            suffix="s"
            value={settings.newsTTL}
            onChange={(newsTTL) => onUpdate({ newsTTL })}
          />
        </SettingsRow>

        <SettingsRow
          description={`Cache duration: ${formatTTL(settings.fearGreedTTL)}`}
          label="Fear & Greed Index"
        >
          <NumberInput
            max={86400}
            min={300}
            step={300}
            suffix="s"
            value={settings.fearGreedTTL}
            onChange={(fearGreedTTL) => onUpdate({ fearGreedTTL })}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Cache Management */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Cache Management
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700"
            disabled={clearing}
            variant="ghost"
            onClick={() => clearCache('quotes')}
          >
            {clearingType === 'quotes' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Clear Quotes
          </Button>

          <Button
            className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700"
            disabled={clearing}
            variant="ghost"
            onClick={() => clearCache('crypto')}
          >
            {clearingType === 'crypto' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Clear Crypto
          </Button>

          <Button
            className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700"
            disabled={clearing}
            variant="ghost"
            onClick={() => clearCache('news')}
          >
            {clearingType === 'news' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Clear News
          </Button>

          <Button
            className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300"
            disabled={clearing}
            variant="ghost"
            onClick={() => clearCache()}
          >
            {clearingType === 'all' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear All
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}
