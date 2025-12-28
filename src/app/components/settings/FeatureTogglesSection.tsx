/**
 * FeatureTogglesSection Component
 *
 * Configuration section for feature flags and toggles.
 */

import { ToggleRight, Brain, FlaskConical, Eye, EyeOff } from 'lucide-react';

import { SettingsSection, SettingsRow, SettingsGroup } from './SettingsSection';
import { ToggleSwitch } from './ToggleSwitch';
import { Badge } from '../ui/badge';

import type { FeatureFlags } from '../../../services/settings/settingsStore';

interface FeatureTogglesSectionProps {
  settings: FeatureFlags;
  onUpdate: (settings: Partial<FeatureFlags>) => void;
  onReset: () => void;
}

export function FeatureTogglesSection({
  settings,
  onUpdate,
  onReset,
}: FeatureTogglesSectionProps) {
  const visibleTabs = [
    settings.tabOverview,
    settings.tabHeartbeat,
    settings.tabWeather,
    settings.tabDNA,
    settings.tabStories,
    settings.tabPatterns,
    settings.tabAdvanced,
    settings.tabLearning,
  ].filter(Boolean).length;

  return (
    <SettingsSection
      description="Enable or disable application features"
      icon={ToggleRight}
      iconColor="from-cyan-500 to-blue-600"
      title="Feature Toggles"
      onReset={onReset}
    >
      <SettingsGroup title="AI Features">
        <SettingsRow
          description="Master toggle for all AI-powered features"
          label="Enable AI"
        >
          <ToggleSwitch
            checked={settings.aiEnabled}
            onChange={(aiEnabled) => onUpdate({ aiEnabled })}
          />
        </SettingsRow>

        <SettingsRow
          description="AI-powered market analysis and insights"
          label="AI Analysis"
        >
          <ToggleSwitch
            checked={settings.aiAnalysis && settings.aiEnabled}
            disabled={!settings.aiEnabled}
            onChange={(aiAnalysis) => onUpdate({ aiAnalysis })}
          />
        </SettingsRow>

        <SettingsRow
          description="AI-generated daily market summaries"
          label="AI Morning Brief"
        >
          <ToggleSwitch
            checked={settings.aiMorningBrief && settings.aiEnabled}
            disabled={!settings.aiEnabled}
            onChange={(aiMorningBrief) => onUpdate({ aiMorningBrief })}
          />
        </SettingsRow>

        <SettingsRow
          description="AI-powered news sentiment analysis"
          label="AI Sentiment"
        >
          <ToggleSwitch
            checked={settings.aiSentiment && settings.aiEnabled}
            disabled={!settings.aiEnabled}
            onChange={(aiSentiment) => onUpdate({ aiSentiment })}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="Data Source">
        <SettingsRow
          description="Use real market data from APIs (vs mock data)"
          label="Real Data"
        >
          <ToggleSwitch
            checked={settings.realDataEnabled}
            onChange={(realDataEnabled) => onUpdate({ realDataEnabled })}
          />
        </SettingsRow>

        <SettingsRow
          description="Show demo data for testing purposes"
          label="Demo Mode"
        >
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={settings.demoMode}
              onChange={(demoMode) => onUpdate({ demoMode })}
            />
            {settings.demoMode && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                Demo Active
              </Badge>
            )}
          </div>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup className="mt-6 pt-6 border-t border-white/10" title="Tab Visibility">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-gray-400">{visibleTabs} of 8 tabs visible</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <SettingsRow description="Main dashboard" label="Overview">
            <ToggleSwitch
              checked={settings.tabOverview}
              onChange={(tabOverview) => onUpdate({ tabOverview })}
            />
          </SettingsRow>

          <SettingsRow description="Market volatility" label="Heartbeat">
            <ToggleSwitch
              checked={settings.tabHeartbeat}
              onChange={(tabHeartbeat) => onUpdate({ tabHeartbeat })}
            />
          </SettingsRow>

          <SettingsRow description="Sentiment indicators" label="Weather">
            <ToggleSwitch
              checked={settings.tabWeather}
              onChange={(tabWeather) => onUpdate({ tabWeather })}
            />
          </SettingsRow>

          <SettingsRow description="Pattern genetics" label="DNA">
            <ToggleSwitch
              checked={settings.tabDNA}
              onChange={(tabDNA) => onUpdate({ tabDNA })}
            />
          </SettingsRow>

          <SettingsRow description="Signal narratives" label="Stories">
            <ToggleSwitch
              checked={settings.tabStories}
              onChange={(tabStories) => onUpdate({ tabStories })}
            />
          </SettingsRow>

          <SettingsRow description="Pattern discovery" label="Patterns">
            <ToggleSwitch
              checked={settings.tabPatterns}
              onChange={(tabPatterns) => onUpdate({ tabPatterns })}
            />
          </SettingsRow>

          <SettingsRow description="Pro tools" label="Advanced">
            <ToggleSwitch
              checked={settings.tabAdvanced}
              onChange={(tabAdvanced) => onUpdate({ tabAdvanced })}
            />
          </SettingsRow>

          <SettingsRow description="Education" label="Learning">
            <ToggleSwitch
              checked={settings.tabLearning}
              onChange={(tabLearning) => onUpdate({ tabLearning })}
            />
          </SettingsRow>
        </div>
      </SettingsGroup>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-sm hover:bg-green-500/30 transition-colors flex items-center gap-1"
            onClick={() =>
              onUpdate({
                tabOverview: true,
                tabHeartbeat: true,
                tabWeather: true,
                tabDNA: true,
                tabStories: true,
                tabPatterns: true,
                tabAdvanced: true,
                tabLearning: true,
              })
            }
          >
            <Eye className="w-3 h-3" />
            Show All Tabs
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 text-sm hover:bg-yellow-500/30 transition-colors flex items-center gap-1"
            onClick={() =>
              onUpdate({
                tabOverview: true,
                tabHeartbeat: false,
                tabWeather: false,
                tabDNA: false,
                tabStories: false,
                tabPatterns: false,
                tabAdvanced: false,
                tabLearning: false,
              })
            }
          >
            <EyeOff className="w-3 h-3" />
            Essential Only
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors flex items-center gap-1"
            onClick={() =>
              onUpdate({
                aiEnabled: true,
                aiAnalysis: true,
                aiMorningBrief: true,
                aiSentiment: true,
              })
            }
          >
            <Brain className="w-3 h-3" />
            Enable All AI
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
