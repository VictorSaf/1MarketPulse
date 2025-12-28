/**
 * PollingSettingsSection Component
 *
 * Configuration section for data refresh intervals.
 */

import { RefreshCw } from 'lucide-react';

import { NumberInput } from './NumberInput';
import { SettingsSection, SettingsRow, SettingsGroup } from './SettingsSection';
import { Slider } from '../ui/slider';

import type { PollingSettings } from '../../../services/settings/settingsStore';

interface PollingSettingsSectionProps {
  settings: PollingSettings;
  onUpdate: (settings: Partial<PollingSettings>) => void;
  onReset: () => void;
}

const formatInterval = (ms: number): string => {
  if (ms >= 3600000) {
    return `${ms / 3600000} hour${ms > 3600000 ? 's' : ''}`;
  }
  if (ms >= 60000) {
    return `${ms / 60000} minute${ms > 60000 ? 's' : ''}`;
  }
  return `${ms / 1000} second${ms > 1000 ? 's' : ''}`;
};

interface IntervalSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function IntervalSlider({ value, onChange, min, max, step }: IntervalSliderProps) {
  return (
    <div className="flex items-center gap-4 min-w-[280px]">
      <Slider
        className="flex-1"
        max={max}
        min={min}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
      <span className="text-sm text-white font-medium w-24 text-right">
        {formatInterval(value)}
      </span>
    </div>
  );
}

export function PollingSettingsSection({
  settings,
  onUpdate,
  onReset,
}: PollingSettingsSectionProps) {
  return (
    <SettingsSection
      description="Configure how frequently data is refreshed from external sources"
      icon={RefreshCw}
      iconColor="from-green-500 to-emerald-600"
      title="Polling Intervals"
      onReset={onReset}
    >
      <SettingsGroup title="Market Data">
        <SettingsRow
          description="Refresh interval for stock prices (during market hours)"
          label="Stock Quote Refresh"
        >
          <IntervalSlider
            max={60000}
            min={5000}
            step={5000}
            value={settings.stockQuote}
            onChange={(stockQuote) => onUpdate({ stockQuote })}
          />
        </SettingsRow>

        <SettingsRow
          description="Refresh interval for market indices (VIX, S&P 500, etc.)"
          label="Market Index Refresh"
        >
          <IntervalSlider
            max={120000}
            min={15000}
            step={15000}
            value={settings.marketIndex}
            onChange={(marketIndex) => onUpdate({ marketIndex })}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="Cryptocurrency">
        <SettingsRow
          description="Refresh interval for cryptocurrency prices (24/7)"
          label="Crypto Price Refresh"
        >
          <IntervalSlider
            max={60000}
            min={5000}
            step={5000}
            value={settings.cryptoPrice}
            onChange={(cryptoPrice) => onUpdate({ cryptoPrice })}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="News & Sentiment">
        <SettingsRow
          description="Refresh interval for market news"
          label="News Refresh"
        >
          <IntervalSlider
            max={900000}
            min={60000}
            step={60000}
            value={settings.news}
            onChange={(news) => onUpdate({ news })}
          />
        </SettingsRow>

        <SettingsRow
          description="Refresh interval for Fear & Greed Index"
          label="Fear & Greed Refresh"
        >
          <IntervalSlider
            max={7200000}
            min={1800000}
            step={1800000}
            value={settings.fearGreed}
            onChange={(fearGreed) => onUpdate({ fearGreed })}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Quick presets */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Quick Presets
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/30 transition-colors"
            onClick={() =>
              onUpdate({
                stockQuote: 5000,
                cryptoPrice: 5000,
                news: 60000,
                fearGreed: 1800000,
                marketIndex: 15000,
              })
            }
          >
            Fast (High API Usage)
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-sm hover:bg-green-500/30 transition-colors"
            onClick={() =>
              onUpdate({
                stockQuote: 15000,
                cryptoPrice: 10000,
                news: 300000,
                fearGreed: 3600000,
                marketIndex: 30000,
              })
            }
          >
            Balanced (Recommended)
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 text-sm hover:bg-yellow-500/30 transition-colors"
            onClick={() =>
              onUpdate({
                stockQuote: 60000,
                cryptoPrice: 60000,
                news: 900000,
                fearGreed: 7200000,
                marketIndex: 120000,
              })
            }
          >
            Slow (Low API Usage)
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
