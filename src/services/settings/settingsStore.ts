/**
 * Settings Store (Zustand)
 *
 * Centralized state management for all application settings.
 * Provides persistence via localStorage and type-safe settings management.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { logAuditEvent } from '../audit/auditLogger';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface APISettings {
  finnhub: {
    apiKey: string;
    enabled: boolean;
    timeout: number;
  };
  coinGecko: {
    apiKey: string;
    enabled: boolean;
    timeout: number;
  };
  backend: {
    url: string;
    enabled: boolean;
    fallbackToDirect: boolean;
    timeout: number;
  };
  ollama: {
    endpoint: string;
    model: string;
    enabled: boolean;
    timeout: number;
  };
}

export interface PollingSettings {
  stockQuote: number; // milliseconds
  cryptoPrice: number;
  news: number;
  fearGreed: number;
  marketIndex: number;
}

export interface CacheSettings {
  enabled: boolean;
  stockQuoteTTL: number; // seconds
  cryptoPriceTTL: number;
  newsTTL: number;
  fearGreedTTL: number;
  maxEntries: number;
}

export interface DisplaySettings {
  defaultTab: string;
  theme: 'dark' | 'light' | 'system';
  decimalPlaces: number;
  compactNumbers: boolean;
  showAnimations: boolean;
  language: string;
}

export interface FeatureFlags {
  aiEnabled: boolean;
  aiAnalysis: boolean;
  aiMorningBrief: boolean;
  aiSentiment: boolean;
  demoMode: boolean;
  realDataEnabled: boolean;
  // Tab visibility
  tabOverview: boolean;
  tabHeartbeat: boolean;
  tabWeather: boolean;
  tabDNA: boolean;
  tabStories: boolean;
  tabPatterns: boolean;
  tabAdvanced: boolean;
  tabLearning: boolean;
}

export interface UserSession {
  id: string;
  email: string;
  role: 'admin' | 'user';
  loginTime: string;
  lastActive: string;
}

export interface AppSettings {
  api: APISettings;
  polling: PollingSettings;
  cache: CacheSettings;
  display: DisplaySettings;
  features: FeatureFlags;
}

// ============================================================================
// Default Settings
// ============================================================================

export const DEFAULT_API_SETTINGS: APISettings = {
  finnhub: {
    apiKey: import.meta.env.VITE_FINNHUB_API_KEY || '',
    enabled: true,
    timeout: 5000,
  },
  coinGecko: {
    apiKey: import.meta.env.VITE_COINGECKO_API_KEY || '',
    enabled: true,
    timeout: 5000,
  },
  backend: {
    url: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
    enabled: true,
    fallbackToDirect: true,
    timeout: 5000,
  },
  ollama: {
    endpoint: 'http://localhost:11434',
    model: 'llama3.2:3b',
    enabled: true,
    timeout: 30000,
  },
};

export const DEFAULT_POLLING_SETTINGS: PollingSettings = {
  stockQuote: 15000, // 15 seconds
  cryptoPrice: 10000, // 10 seconds
  news: 300000, // 5 minutes
  fearGreed: 3600000, // 1 hour
  marketIndex: 30000, // 30 seconds
};

export const DEFAULT_CACHE_SETTINGS: CacheSettings = {
  enabled: true,
  stockQuoteTTL: 15, // seconds
  cryptoPriceTTL: 10,
  newsTTL: 300,
  fearGreedTTL: 3600,
  maxEntries: 500,
};

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  defaultTab: 'overview',
  theme: 'dark',
  decimalPlaces: 2,
  compactNumbers: true,
  showAnimations: true,
  language: 'en',
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  aiEnabled: true,
  aiAnalysis: true,
  aiMorningBrief: true,
  aiSentiment: true,
  demoMode: false,
  realDataEnabled: true,
  tabOverview: true,
  tabHeartbeat: true,
  tabWeather: true,
  tabDNA: true,
  tabStories: true,
  tabPatterns: true,
  tabAdvanced: true,
  tabLearning: true,
};

export const DEFAULT_SETTINGS: AppSettings = {
  api: DEFAULT_API_SETTINGS,
  polling: DEFAULT_POLLING_SETTINGS,
  cache: DEFAULT_CACHE_SETTINGS,
  display: DEFAULT_DISPLAY_SETTINGS,
  features: DEFAULT_FEATURE_FLAGS,
};

// ============================================================================
// Store Interface
// ============================================================================

interface SettingsState {
  // Settings data
  settings: AppSettings;
  isDirty: boolean;
  lastSaved: number | null;

  // Mock user sessions for display
  userSessions: UserSession[];

  // Actions
  updateAPISettings: (settings: Partial<APISettings>) => void;
  updatePollingSettings: (settings: Partial<PollingSettings>) => void;
  updateCacheSettings: (settings: Partial<CacheSettings>) => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updateFeatureFlags: (flags: Partial<FeatureFlags>) => void;

  // Bulk operations
  saveSettings: () => void;
  resetSettings: () => void;
  resetSection: (section: keyof AppSettings) => void;

  // Export/Import
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: DEFAULT_SETTINGS,
      isDirty: false,
      lastSaved: null,

      // User sessions - now fetched from API, keeping empty array for backward compatibility
      userSessions: [],

      // Update API settings
      updateAPISettings: (apiSettings) => {
        // Log API key changes (but not the actual keys)
        if (apiSettings.finnhub?.apiKey || apiSettings.coinGecko?.apiKey) {
          logAuditEvent('API_KEY_CHANGE', {
            finnhubChanged: !!apiSettings.finnhub?.apiKey,
            coinGeckoChanged: !!apiSettings.coinGecko?.apiKey,
          });
        }

        set((state) => ({
          settings: {
            ...state.settings,
            api: {
              ...state.settings.api,
              ...apiSettings,
              finnhub: {
                ...state.settings.api.finnhub,
                ...apiSettings.finnhub,
              },
              coinGecko: {
                ...state.settings.api.coinGecko,
                ...apiSettings.coinGecko,
              },
              backend: {
                ...state.settings.api.backend,
                ...apiSettings.backend,
              },
              ollama: {
                ...state.settings.api.ollama,
                ...apiSettings.ollama,
              },
            },
          },
          isDirty: true,
        }));
      },

      // Update polling settings
      updatePollingSettings: (pollingSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            polling: {
              ...state.settings.polling,
              ...pollingSettings,
            },
          },
          isDirty: true,
        }));
      },

      // Update cache settings
      updateCacheSettings: (cacheSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            cache: {
              ...state.settings.cache,
              ...cacheSettings,
            },
          },
          isDirty: true,
        }));
      },

      // Update display settings
      updateDisplaySettings: (displaySettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            display: {
              ...state.settings.display,
              ...displaySettings,
            },
          },
          isDirty: true,
        }));
      },

      // Update feature flags
      updateFeatureFlags: (flags) => {
        set((state) => ({
          settings: {
            ...state.settings,
            features: {
              ...state.settings.features,
              ...flags,
            },
          },
          isDirty: true,
        }));
      },

      // Save settings
      saveSettings: () => {
        set({
          isDirty: false,
          lastSaved: Date.now(),
        });
      },

      // Reset all settings to defaults
      resetSettings: () => {
        logAuditEvent('SETTINGS_RESET', { scope: 'all' });
        set({
          settings: DEFAULT_SETTINGS,
          isDirty: true,
        });
      },

      // Reset a specific section
      resetSection: (section) => {
        logAuditEvent('SETTINGS_RESET', { scope: section });
        const defaults: Record<keyof AppSettings, any> = {
          api: DEFAULT_API_SETTINGS,
          polling: DEFAULT_POLLING_SETTINGS,
          cache: DEFAULT_CACHE_SETTINGS,
          display: DEFAULT_DISPLAY_SETTINGS,
          features: DEFAULT_FEATURE_FLAGS,
        };

        set((state) => ({
          settings: {
            ...state.settings,
            [section]: defaults[section],
          },
          isDirty: true,
        }));
      },

      // Export settings as JSON (with sensitive data sanitized)
      exportSettings: () => {
        logAuditEvent('SETTINGS_EXPORT', { type: 'settings' });
        const settings = get().settings;

        // Create sanitized copy - remove API keys for security
        const sanitizedSettings = {
          ...settings,
          api: {
            ...settings.api,
            finnhub: {
              ...settings.api.finnhub,
              apiKey: settings.api.finnhub.apiKey ? '[REDACTED]' : '',
            },
            coinGecko: {
              ...settings.api.coinGecko,
              apiKey: settings.api.coinGecko.apiKey ? '[REDACTED]' : '',
            },
          },
        };

        return JSON.stringify(sanitizedSettings, null, 2);
      },

      // Import settings from JSON
      importSettings: (json) => {
        try {
          const imported = JSON.parse(json) as AppSettings;

          // Validate structure
          if (!imported.api || !imported.polling || !imported.cache || !imported.display || !imported.features) {
            logAuditEvent('SETTINGS_IMPORT', { success: false, reason: 'invalid_structure' }, false);
            return false;
          }

          logAuditEvent('SETTINGS_IMPORT', { success: true });

          // Preserve existing API keys if imported ones are redacted
          const currentSettings = get().settings;
          const preserveApiKeys = {
            finnhub: imported.api.finnhub.apiKey === '[REDACTED]'
              ? currentSettings.api.finnhub.apiKey
              : imported.api.finnhub.apiKey,
            coinGecko: imported.api.coinGecko.apiKey === '[REDACTED]'
              ? currentSettings.api.coinGecko.apiKey
              : imported.api.coinGecko.apiKey,
          };

          set({
            settings: {
              ...DEFAULT_SETTINGS,
              ...imported,
              api: {
                ...imported.api,
                finnhub: {
                  ...imported.api.finnhub,
                  apiKey: preserveApiKeys.finnhub,
                },
                coinGecko: {
                  ...imported.api.coinGecko,
                  apiKey: preserveApiKeys.coinGecko,
                },
              },
            },
            isDirty: true,
          });

          return true;
        } catch (error) {
          console.error('[SettingsStore] Failed to import settings:', error);
          return false;
        }
      },
    }),
    {
      name: 'pulse-settings-storage',
      partialize: (state) => ({
        settings: state.settings,
        lastSaved: state.lastSaved,
      }),
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectAPISettings = (state: SettingsState) => state.settings.api;
export const selectPollingSettings = (state: SettingsState) => state.settings.polling;
export const selectCacheSettings = (state: SettingsState) => state.settings.cache;
export const selectDisplaySettings = (state: SettingsState) => state.settings.display;
export const selectFeatureFlags = (state: SettingsState) => state.settings.features;
export const selectUserSessions = (state: SettingsState) => state.userSessions;
