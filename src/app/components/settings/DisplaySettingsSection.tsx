/**
 * DisplaySettingsSection Component
 *
 * Configuration section for display preferences.
 */

import { Monitor, Palette } from 'lucide-react';

import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';
import { SettingsSection, SettingsRow, SettingsGroup } from './SettingsSection';
import { ToggleSwitch } from './ToggleSwitch';

import type { DisplaySettings } from '../../../services/settings/settingsStore';

interface DisplaySettingsSectionProps {
  settings: DisplaySettings;
  onUpdate: (settings: Partial<DisplaySettings>) => void;
  onReset: () => void;
}

const TAB_OPTIONS = [
  { value: 'overview', label: 'Overview' },
  { value: 'heartbeat', label: 'Heartbeat' },
  { value: 'weather', label: 'Weather' },
  { value: 'dna', label: 'DNA' },
  { value: 'stories', label: 'Stories' },
  { value: 'patterns', label: 'Patterns' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'learning', label: 'Learning' },
];

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark Mode' },
  { value: 'light', label: 'Light Mode' },
  { value: 'system', label: 'System Default' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ro', label: 'Romanian' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
];

export function DisplaySettingsSection({
  settings,
  onUpdate,
  onReset,
}: DisplaySettingsSectionProps) {
  return (
    <SettingsSection
      description="Customize the appearance and default view of the application"
      icon={Monitor}
      iconColor="from-purple-500 to-pink-600"
      title="Display Settings"
      onReset={onReset}
    >
      <SettingsGroup title="Layout">
        <SettingsRow
          description="The tab shown when opening the app"
          label="Default Tab"
        >
          <SelectInput
            className="w-48"
            options={TAB_OPTIONS}
            value={settings.defaultTab}
            onChange={(defaultTab) => onUpdate({ defaultTab })}
          />
        </SettingsRow>

        <SettingsRow
          description="Application interface language"
          label="Language"
        >
          <SelectInput
            className="w-48"
            options={LANGUAGE_OPTIONS}
            value={settings.language}
            onChange={(language) => onUpdate({ language })}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="Appearance">
        <SettingsRow
          description="Color scheme for the application"
          label="Theme"
        >
          <SelectInput
            className="w-48"
            options={THEME_OPTIONS}
            value={settings.theme}
            onChange={(theme) => onUpdate({ theme: theme as DisplaySettings['theme'] })}
          />
        </SettingsRow>

        <SettingsRow
          description="Enable UI animations and transitions"
          label="Show Animations"
        >
          <ToggleSwitch
            checked={settings.showAnimations}
            onChange={(showAnimations) => onUpdate({ showAnimations })}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="Number Formatting">
        <SettingsRow
          description="Number of decimal places for prices"
          label="Decimal Places"
        >
          <NumberInput
            max={6}
            min={0}
            step={1}
            value={settings.decimalPlaces}
            onChange={(decimalPlaces) => onUpdate({ decimalPlaces })}
          />
        </SettingsRow>

        <SettingsRow
          description="Show large numbers in compact format (e.g., 1.2M instead of 1,200,000)"
          label="Compact Numbers"
        >
          <ToggleSwitch
            checked={settings.compactNumbers}
            onChange={(compactNumbers) => onUpdate({ compactNumbers })}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* Preview */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Preview
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-700/50 border border-white/10">
            <p className="text-xs text-gray-400 mb-2">Price Example</p>
            <p className="text-xl font-bold text-white">
              ${(1234.567890).toFixed(settings.decimalPlaces)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-700/50 border border-white/10">
            <p className="text-xs text-gray-400 mb-2">Volume Example</p>
            <p className="text-xl font-bold text-white">
              {settings.compactNumbers
                ? new Intl.NumberFormat('en', { notation: 'compact' }).format(1234567890)
                : new Intl.NumberFormat('en').format(1234567890)}
            </p>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
