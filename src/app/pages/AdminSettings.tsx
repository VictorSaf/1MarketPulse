/**
 * Admin Settings Page - Comprehensive Configuration Panel
 *
 * Complete admin settings with:
 * - API Configuration (Finnhub, CoinGecko, Backend, Ollama)
 * - Polling Intervals
 * - Cache Settings
 * - Display Settings
 * - Feature Toggles
 * - User Management (view only)
 * - Settings Export/Import
 *
 * Only accessible to users with admin role.
 */

import { useState, useEffect } from 'react';

import {
  Save,
  RotateCcw,
  Download,
  Upload,
  ArrowLeft,
  Settings,
  AlertCircle,
  CheckCircle,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthStore } from '../../services/auth';
import {
  useSettingsStore,
  selectAPISettings,
  selectPollingSettings,
  selectCacheSettings,
  selectDisplaySettings,
  selectFeatureFlags,
  selectUserSessions,
  DEFAULT_API_SETTINGS,
  DEFAULT_POLLING_SETTINGS,
  DEFAULT_CACHE_SETTINGS,
  DEFAULT_DISPLAY_SETTINGS,
  DEFAULT_FEATURE_FLAGS,
} from '../../services/settings/settingsStore';
import {
  APISettingsSection,
  PollingSettingsSection,
  CacheSettingsSection,
  DisplaySettingsSection,
  FeatureTogglesSection,
  UserManagementSection,
  SystemHealthSection,
} from '../components/settings';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';


export function AdminSettings() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('api');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportWarningOpen, setExportWarningOpen] = useState(false);
  const [importJson, setImportJson] = useState('');

  // Set tab from URL query param
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['api', 'polling', 'cache', 'display', 'features', 'users', 'health'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Auth state
  const { user } = useAuthStore();

  // Settings state
  const {
    isDirty,
    lastSaved,
    updateAPISettings,
    updatePollingSettings,
    updateCacheSettings,
    updateDisplaySettings,
    updateFeatureFlags,
    saveSettings,
    resetSettings,
    resetSection,
    exportSettings,
    importSettings,
  } = useSettingsStore();

  const apiSettings = useSettingsStore(selectAPISettings);
  const pollingSettings = useSettingsStore(selectPollingSettings);
  const cacheSettings = useSettingsStore(selectCacheSettings);
  const displaySettings = useSettingsStore(selectDisplaySettings);
  const featureFlags = useSettingsStore(selectFeatureFlags);
  const userSessions = useSettingsStore(selectUserSessions);

  // Handle save
  const handleSave = () => {
    saveSettings();
    setShowSaveSuccess(true);
    toast.success('Settings saved successfully');
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Handle reset all
  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      resetSettings();
      toast.info('All settings reset to defaults');
    }
  };

  // Show export warning first
  const handleExportClick = () => {
    setExportWarningOpen(true);
  };

  // Handle actual export
  const handleExportConfirm = () => {
    setExportWarningOpen(false);
    const json = exportSettings();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully (API keys redacted)');
  };

  // Handle import
  const handleImport = () => {
    if (importSettings(importJson)) {
      setImportModalOpen(false);
      setImportJson('');
      toast.success('Settings imported successfully');
    } else {
      toast.error('Failed to import settings. Please check the JSON format.');
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportJson(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) {return 'Never';}
    const date = new Date(lastSaved);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              to="/admin"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Application Settings</h1>
                <p className="text-sm text-gray-400">
                  Configure all aspects of 1MarketPulse
                </p>
              </div>
            </div>
          </div>

          {/* User and Status Bar */}
          <div className="flex items-center justify-between mt-4 p-4 rounded-lg bg-gray-800/30 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Logged in as:</span>
                <span className="text-white font-medium">{user?.email}</span>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                  Admin
                </Badge>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Last saved:</span>
                <span className="text-white">{formatLastSaved()}</span>
              </div>
              {isDirty && (
                <>
                  <div className="w-px h-4 bg-white/10" />
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                    Unsaved Changes
                  </Badge>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                className="text-gray-400 hover:text-white"
                size="sm"
                variant="ghost"
                onClick={() => setImportModalOpen(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                className="text-gray-400 hover:text-white"
                size="sm"
                variant="ghost"
                onClick={handleExportClick}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                size="sm"
                variant="ghost"
                onClick={handleResetAll}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
              <Button
                className={`${
                  isDirty
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={!isDirty}
                onClick={handleSave}
              >
                {showSaveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800/50 border border-white/10 p-1 rounded-lg">
            <TabsTrigger
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              value="api"
            >
              API Config
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:text-white"
              value="polling"
            >
              Polling
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-yellow-500/20 data-[state=active]:text-white"
              value="cache"
            >
              Cache
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white"
              value="display"
            >
              Display
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white"
              value="features"
            >
              Features
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              value="users"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-red-500/20 data-[state=active]:text-white"
              value="health"
            >
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-6" value="api">
            <APISettingsSection
              settings={apiSettings}
              onReset={() => resetSection('api')}
              onUpdate={updateAPISettings}
            />
          </TabsContent>

          <TabsContent className="space-y-6" value="polling">
            <PollingSettingsSection
              settings={pollingSettings}
              onReset={() => resetSection('polling')}
              onUpdate={updatePollingSettings}
            />
          </TabsContent>

          <TabsContent className="space-y-6" value="cache">
            <CacheSettingsSection
              settings={cacheSettings}
              onReset={() => resetSection('cache')}
              onUpdate={updateCacheSettings}
            />
          </TabsContent>

          <TabsContent className="space-y-6" value="display">
            <DisplaySettingsSection
              settings={displaySettings}
              onReset={() => resetSection('display')}
              onUpdate={updateDisplaySettings}
            />
          </TabsContent>

          <TabsContent className="space-y-6" value="features">
            <FeatureTogglesSection
              settings={featureFlags}
              onReset={() => resetSection('features')}
              onUpdate={updateFeatureFlags}
            />
          </TabsContent>

          <TabsContent className="space-y-6" value="users">
            <UserManagementSection
              currentUserEmail={user?.email}
              sessions={userSessions}
            />
          </TabsContent>

          <TabsContent className="space-y-6" value="health">
            <SystemHealthSection />
          </TabsContent>
        </Tabs>

        {/* Export Warning Modal */}
        {exportWarningOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 bg-gray-800 border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Export Settings</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Security Notice
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-gray-300 text-sm">
                  The exported settings file will contain your configuration, but sensitive data will be protected:
                </p>
                <ul className="text-sm text-gray-400 space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>API keys will be replaced with <code className="text-yellow-300">[REDACTED]</code></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Non-sensitive settings (polling, cache, display) will be exported</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>When importing, existing API keys will be preserved</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setExportWarningOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={handleExportConfirm}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Import Modal */}
        {importModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg p-6 bg-gray-800 border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Import Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Upload JSON file or paste settings:
                  </label>
                  <input
                    accept=".json"
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 cursor-pointer"
                    type="file"
                    onChange={handleFileUpload}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Or paste JSON directly:
                  </label>
                  <textarea
                    className="w-full h-40 px-3 py-2 rounded-lg bg-gray-700/50 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder='{"api": {...}, "polling": {...}}'
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 justify-end pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setImportModalOpen(false);
                      setImportJson('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    disabled={!importJson.trim()}
                    onClick={handleImport}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>
              1MarketPulse Admin Settings v3.2.0
            </p>
            <p>
              Changes are automatically persisted to localStorage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
