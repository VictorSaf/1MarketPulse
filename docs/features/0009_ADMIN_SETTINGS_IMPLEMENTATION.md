# Admin Settings Page Implementation

**Feature ID**: 0009
**Created**: 2025-12-27
**Status**: Implemented
**Author**: Claude (Orchestrator Agent)

---

## Overview

Comprehensive Admin Settings page for 1MarketPulse that allows administrators to configure all application parameters through an intuitive UI. The settings page is accessible only to users with admin role.

---

## Access Control

### Admin Credentials
- **Email**: `admin@admin.ro`
- **Password**: `Victor`

Alternative admin:
- **Email**: `vict0r@vict0r.ro`
- **Password**: `Vict0r`

### Route Protection
- **Route**: `/admin/settings`
- **Guard**: `AdminGuard` component
- **Requirements**:
  - User must be authenticated
  - User must have `role: 'admin'`

---

## Features Implemented

### 1. API Configuration
Location: `src/app/components/settings/APISettingsSection.tsx`

**Configurable Options:**
- **Backend Server**
  - Backend URL (default: `http://localhost:3001`)
  - Enable/disable backend
  - Fallback to direct API calls
  - Request timeout (1000-60000ms)

- **Finnhub API**
  - API key (masked by default, reveal on click)
  - Enable/disable
  - Request timeout

- **CoinGecko API**
  - API key (optional)
  - Enable/disable
  - Request timeout

- **Ollama (Local AI)**
  - Endpoint URL (default: `http://localhost:11434`)
  - Model selection (default: `llama3.2:3b`)
  - Enable/disable
  - Request timeout

**Test Connection Feature:**
- Each service has a "Test" button
- Shows success/error indicators
- Displays connection latency

### 2. Polling Intervals
Location: `src/app/components/settings/PollingSettingsSection.tsx`

**Configurable Intervals:**
| Data Type | Default | Range |
|-----------|---------|-------|
| Stock Quotes | 15s | 5s - 60s |
| Market Index | 30s | 15s - 120s |
| Crypto Prices | 10s | 5s - 60s |
| News | 5 min | 1 - 15 min |
| Fear & Greed | 1 hour | 30 min - 2 hours |

**Quick Presets:**
- Fast (High API Usage)
- Balanced (Recommended)
- Slow (Low API Usage)

### 3. Cache Settings
Location: `src/app/components/settings/CacheSettingsSection.tsx`

**Configurable Options:**
- Enable/disable caching globally
- Max cache entries (100-5000)
- TTL per data type:
  - Stock Quotes (5-300s)
  - Crypto Prices (5-300s)
  - News Articles (60-1800s)
  - Fear & Greed Index (300-86400s)

**Cache Management:**
- Clear Quotes cache
- Clear Crypto cache
- Clear News cache
- Clear All caches

### 4. Display Settings
Location: `src/app/components/settings/DisplaySettingsSection.tsx`

**Configurable Options:**
- Default tab (Overview, Heartbeat, Weather, etc.)
- Theme (Dark, Light, System)
- Language (English, Romanian, Spanish, German, French)
- Show/hide animations
- Decimal places (0-6)
- Compact number formatting

**Live Preview:**
- Price format preview
- Volume format preview

### 5. Feature Toggles
Location: `src/app/components/settings/FeatureTogglesSection.tsx`

**AI Features:**
- Master AI toggle
- AI Analysis
- AI Morning Brief
- AI Sentiment Analysis

**Data Source:**
- Real data enabled
- Demo mode toggle

**Tab Visibility:**
- Toggle each of 8 tabs independently
- Show All Tabs / Essential Only quick actions

### 6. User Management (View Only)
Location: `src/app/components/settings/UserManagementSection.tsx`

**Displays:**
- Total users count
- Admin count
- Regular user count
- User sessions list:
  - Email
  - Role (Admin/User)
  - Login time
  - Last active time

---

## Technical Architecture

### State Management
**Store**: `src/services/settings/settingsStore.ts`

Uses Zustand with persistence middleware:
```typescript
const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isDirty: false,
      lastSaved: null,
      // ... actions
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
```

### Settings Persistence
- Automatically persisted to `localStorage`
- Key: `pulse-settings-storage`
- Survives page refresh
- Can be exported/imported as JSON

### Component Structure
```
src/app/components/settings/
├── index.ts                    # Exports all components
├── SettingsSection.tsx         # Reusable section wrapper
├── ToggleSwitch.tsx           # Toggle switch input
├── NumberInput.tsx            # Number input with +/- buttons
├── SelectInput.tsx            # Styled select dropdown
├── TextInput.tsx              # Text input with reveal option
├── APISettingsSection.tsx     # API configuration
├── PollingSettingsSection.tsx # Polling intervals
├── CacheSettingsSection.tsx   # Cache settings
├── DisplaySettingsSection.tsx # Display preferences
├── FeatureTogglesSection.tsx  # Feature flags
└── UserManagementSection.tsx  # User management (view only)
```

---

## UI/UX Design

### Color Coding (Tab Gradient Colors)
| Tab | Gradient |
|-----|----------|
| API Config | Blue to Purple |
| Polling | Green to Emerald |
| Cache | Orange to Yellow |
| Display | Purple to Pink |
| Features | Cyan to Blue |
| Users | Indigo to Purple |

### Status Indicators
- **Unsaved Changes**: Yellow badge
- **Save Success**: Green checkmark animation
- **Test Success**: Green checkmark
- **Test Failure**: Red X icon
- **Loading**: Spinning loader

### Layout
- Max width: 6xl (1152px)
- Responsive design
- Card-based sections with glassmorphism
- Tabbed navigation for sections

---

## Files Created/Modified

### New Files
1. `/src/services/settings/settingsStore.ts` - Zustand store with persistence
2. `/src/services/settings/index.ts` - Service exports
3. `/src/app/components/settings/SettingsSection.tsx` - Section wrapper
4. `/src/app/components/settings/ToggleSwitch.tsx` - Toggle component
5. `/src/app/components/settings/NumberInput.tsx` - Number input component
6. `/src/app/components/settings/SelectInput.tsx` - Select component
7. `/src/app/components/settings/TextInput.tsx` - Text input component
8. `/src/app/components/settings/APISettingsSection.tsx` - API settings
9. `/src/app/components/settings/PollingSettingsSection.tsx` - Polling settings
10. `/src/app/components/settings/CacheSettingsSection.tsx` - Cache settings
11. `/src/app/components/settings/DisplaySettingsSection.tsx` - Display settings
12. `/src/app/components/settings/FeatureTogglesSection.tsx` - Feature toggles
13. `/src/app/components/settings/UserManagementSection.tsx` - User management
14. `/src/app/components/settings/index.ts` - Component exports

### Modified Files
1. `/src/services/auth/mockAuthService.ts` - Added admin@admin.ro credentials
2. `/src/app/pages/AdminSettings.tsx` - Complete rewrite with new features

---

## Usage Instructions

### Accessing Settings
1. Login with admin credentials (`admin@admin.ro` / `Victor`)
2. Navigate to `/admin` (Admin Dashboard)
3. Click "System Settings" card
4. Or directly navigate to `/admin/settings`

### Saving Changes
1. Make desired changes in any section
2. Yellow "Unsaved Changes" badge appears
3. Click green "Save Settings" button
4. Settings are persisted to localStorage

### Exporting Settings
1. Click "Export" button in header
2. JSON file downloads automatically
3. File named: `pulse-settings-YYYY-MM-DD.json`

### Importing Settings
1. Click "Import" button in header
2. Either upload JSON file OR paste JSON text
3. Click "Import" button in modal
4. Settings are loaded (still need to save)

### Resetting Settings
- **Reset Section**: Click "Reset to defaults" button in any section
- **Reset All**: Click "Reset All" button in header (requires confirmation)

---

## Default Settings Reference

```typescript
DEFAULT_API_SETTINGS = {
  finnhub: { apiKey: '', enabled: true, timeout: 5000 },
  coinGecko: { apiKey: '', enabled: true, timeout: 5000 },
  backend: { url: 'http://localhost:3001', enabled: true, fallbackToDirect: true, timeout: 5000 },
  ollama: { endpoint: 'http://localhost:11434', model: 'llama3.2:3b', enabled: true, timeout: 30000 }
}

DEFAULT_POLLING_SETTINGS = {
  stockQuote: 15000,
  cryptoPrice: 10000,
  news: 300000,
  fearGreed: 3600000,
  marketIndex: 30000
}

DEFAULT_CACHE_SETTINGS = {
  enabled: true,
  stockQuoteTTL: 15,
  cryptoPriceTTL: 10,
  newsTTL: 300,
  fearGreedTTL: 3600,
  maxEntries: 500
}

DEFAULT_DISPLAY_SETTINGS = {
  defaultTab: 'overview',
  theme: 'dark',
  decimalPlaces: 2,
  compactNumbers: true,
  showAnimations: true,
  language: 'en'
}

DEFAULT_FEATURE_FLAGS = {
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
  tabLearning: true
}
```

---

## Future Enhancements

1. **User Management (Full)**
   - Add/edit/delete users
   - Role assignment
   - Session management

2. **Settings Sync**
   - Sync settings to backend/database
   - Multi-device settings sync

3. **Audit Log**
   - Track settings changes
   - Show who changed what and when

4. **Theme Customization**
   - Custom color schemes
   - Font size adjustments
   - Layout options

5. **Notifications**
   - Email alerts configuration
   - Push notification settings

---

## Testing Checklist

- [x] Admin login works with new credentials
- [x] Non-admin users see "Access Denied"
- [x] All settings sections render correctly
- [x] Toggle switches work
- [x] Number inputs work with +/- buttons
- [x] Select dropdowns work
- [x] Text inputs work (including masked API keys)
- [x] Save button enables on changes
- [x] Settings persist after refresh
- [x] Export downloads JSON file
- [x] Import loads settings from JSON
- [x] Reset section works
- [x] Reset all works with confirmation
- [x] Quick presets apply correctly
- [x] Connection tests show results

---

**Implementation Complete**: 2025-12-27
