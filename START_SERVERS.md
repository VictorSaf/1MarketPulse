# Start Pulse2 Application

## Quick Start

### 1. Start Backend API Server (Port 3001)
```bash
cd server
npm start
```

Or with Bun (if installed):
```bash
cd server
bun run start
```

### 2. Start Frontend Dev Server (Port 5173 or 5174)
```bash
# In a new terminal
npm run dev
```

## Verify Everything is Running

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3001/api/health
   ```

   Expected output:
   ```json
   {
     "status": "ok",
     "uptime": 0.123,
     "timestamp": 1234567890,
     "version": "1.0.0"
   }
   ```

2. **Frontend**: Open http://localhost:5173 in browser

3. **Backend Services Status**:
   ```bash
   curl http://localhost:3001/api/health/services
   ```

## Troubleshooting

### Backend won't start
- Check if port 3001 is in use: `lsof -ti:3001`
- Kill existing process: `lsof -ti:3001 | xargs kill -9`
- Verify `.env` file exists in `/server` directory
- Check FINNHUB_API_KEY is set

### Frontend won't connect to backend
- Verify backend is running on port 3001
- Check CORS settings in `/server/.env`
- Check frontend `.env` has `VITE_BACKEND_URL=http://localhost:3001`

### API errors
- Check service health: `curl http://localhost:3001/api/health/services`
- Verify API keys are valid
- Check network connectivity

## Development Mode (Hot Reload)

### Backend
```bash
cd server
npm run dev  # or: bun run dev
```

### Frontend
```bash
npm run dev
```

## Production Mode

### Build Frontend
```bash
npm run build
```

### Serve Frontend
```bash
npm run preview
```

### Backend (already production-ready)
```bash
cd server
npm start  # or: bun run start
```

## Environment Variables

### Backend (`/server/.env`)
```env
PORT=3001
FINNHUB_API_KEY=your_key_here
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### Frontend (`/.env`)
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_USE_BACKEND=true
VITE_BACKEND_FALLBACK=true
VITE_FINNHUB_API_KEY=your_key_here
```

## Testing API Endpoints

### Market Data
```bash
# Single stock quote
curl http://localhost:3001/api/market/quote/SPY

# Multiple quotes
curl "http://localhost:3001/api/market/quotes?symbols=SPY,QQQ,DIA"
```

### Crypto
```bash
# Single crypto price
curl http://localhost:3001/api/crypto/price/BTC

# Multiple crypto prices
curl "http://localhost:3001/api/crypto/prices?symbols=BTC,ETH,SOL"
```

### News
```bash
# General news
curl "http://localhost:3001/api/news?category=general"

# Company news
curl http://localhost:3001/api/news/AAPL
```

### Sentiment
```bash
curl http://localhost:3001/api/sentiment/fear-greed
```

## Stopping Servers

### Backend
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

### Frontend
```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9
# or press Ctrl+C in terminal
```
