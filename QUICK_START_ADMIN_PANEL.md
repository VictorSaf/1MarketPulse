# Quick Start: Admin Settings Panel

## 1. Start the Backend Server

```bash
cd /Users/victorsafta/Downloads/Pulse2/server
npm run dev
```

Expected output:
```
🚀 Pulse2 API Server Starting...
Environment: development
Port:        3001
```

## 2. Start the Frontend

```bash
cd /Users/victorsafta/Downloads/Pulse2
npm run dev
```

Expected output:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5174/
```

## 3. Login as Admin

1. Open browser: http://localhost:5174
2. Login with:
   - Email: `vict0r@vict0r.ro`
   - Password: `Vict0r`

## 4. Access Admin Settings

1. From the dashboard, click "Admin Settings" or navigate to `/admin/settings`
2. You should see the full admin panel with:
   - Real-time statistics (4 cards at top)
   - System health panel (3 radial charts)
   - Service status table
   - 4 service configuration cards
   - Environment variables info

## 5. Test Features

### Real-time Monitoring
- Observe the "LIVE" badge (green, pulsing)
- Watch statistics update every 5 seconds
- Check browser console for polling requests

### Service Testing
- Click "Test" button on any service card
- Toast notification should appear with result
- Check latency displayed in service status

### Manual Controls
- Click Pause button → "LIVE" badge becomes "PAUSED" (gray)
- Click Play button → Resume auto-refresh
- Click refresh button → Manual update with spinner

### Cache Management
- Scroll to "Cache Management" section
- Click "Curatare Cache" button
- Verify toast notification appears
- Stats should refresh automatically

## 6. Check Service Health

Service status indicators:
- 🟢 Live = Service is healthy
- 🔴 Down = Service is unavailable
- ⚪ Unknown = Status unknown

Expected states (with backend running):
- Finnhub API: 🟢 Live (if API key configured)
- CoinGecko API: 🟢 Live
- Fear & Greed Index: 🟢 Live
- Ollama: 🔴 Down (unless Ollama is running locally)
- Backend API: 🟢 Live

## 7. Verify Romanian Text

All UI text should be in Romanian:
- "Monitorizare in Timp Real"
- "Stare Sistem"
- "Sanatate Sistem"
- "Configurare Servicii"
- "Curatare Cache"
- etc.

## Troubleshooting

### Backend not starting
```bash
cd /Users/victorsafta/Downloads/Pulse2/server
npm install
npm run dev
```

### Frontend errors
```bash
cd /Users/victorsafta/Downloads/Pulse2
npm install
npm run dev
```

### Services showing "Down"
- Check backend server is running on port 3001
- Verify API keys in `/server/.env` file
- Check CORS configuration allows localhost:5174

### No statistics updating
- Check browser console for errors
- Verify backend is accessible at http://localhost:3001
- Click manual refresh button
- Check network tab for API calls

## API Endpoints for Manual Testing

Test backend directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Service status
curl http://localhost:3001/api/health/services

# Admin stats
curl http://localhost:3001/api/admin/stats

# Test Finnhub
curl -X POST http://localhost:3001/api/admin/test/finnhub

# Clear cache
curl -X POST http://localhost:3001/api/admin/cache/clear
```

## Success Criteria

✅ Backend running on port 3001
✅ Frontend running on port 5174
✅ Admin login successful
✅ Admin Settings page loads
✅ Real-time stats display and update
✅ Service health checks complete
✅ Test buttons work
✅ Cache clear works
✅ No console errors
✅ Romanian text displays correctly

---

**Implementation Date**: 2025-12-24
**Status**: PRODUCTION READY
