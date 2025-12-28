# 1MarketPulse Backend API Server

High-performance backend API server built with **Bun** and **Hono** for the 1MarketPulse market intelligence platform.

## Features

- **Lightning Fast**: Built on Bun runtime (3x faster than Node.js)
- **Lightweight Framework**: Hono web framework (minimal overhead)
- **Smart Caching**: In-memory cache with TTL (Redis-like interface)
- **Rate Limiting**: Prevents API abuse (100 req/min per IP)
- **CORS Enabled**: Configured for frontend communication
- **Health Checks**: Monitor service status and cache performance

## Tech Stack

- **Runtime**: Bun 1.0+
- **Framework**: Hono 4.0+
- **Language**: TypeScript
- **Cache**: In-memory with TTL
- **APIs**: Finnhub, CoinGecko, CNN Fear & Greed

## Installation

### Prerequisites

1. Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Install dependencies:
```bash
cd server
bun install
```

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your API keys to `.env`:
```env
FINNHUB_API_KEY=your_key_here
```

## Usage

### Development Mode (with hot reload)
```bash
bun run dev
```

### Production Mode
```bash
bun run start
```

### Build
```bash
bun run build
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```http
GET /api/health
GET /api/health/services
GET /api/health/cache
```

### Market Data
```http
GET /api/market/quote/:symbol
GET /api/market/quotes?symbols=SPY,QQQ,DIA
```

Example:
```bash
curl http://localhost:3001/api/market/quote/SPY
```

### News
```http
GET /api/news?category=general
GET /api/news/:symbol
```

Example:
```bash
curl http://localhost:3001/api/news?category=forex
curl http://localhost:3001/api/news/AAPL
```

### Sentiment
```http
GET /api/sentiment/fear-greed
GET /api/sentiment/fear-greed/historical
```

Example:
```bash
curl http://localhost:3001/api/sentiment/fear-greed
```

### Cryptocurrency
```http
GET /api/crypto/price/:symbol
GET /api/crypto/prices?symbols=BTC,ETH,SOL
```

Example:
```bash
curl http://localhost:3001/api/crypto/price/BTC
curl http://localhost:3001/api/crypto/prices?symbols=BTC,ETH,SOL
```

## Response Format

All endpoints return JSON with consistent structure:

```json
{
  "success": true,
  "data": { ... },
  "cached": false,
  "timestamp": 1234567890
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Caching Strategy

- **Stock Quotes**: 15 seconds
- **Crypto Prices**: 10 seconds
- **News**: 5 minutes (300 seconds)
- **Fear & Greed**: 1 hour (3600 seconds)

Cache automatically cleans up expired entries every 60 seconds.

## Rate Limiting

- **Window**: 60 seconds
- **Max Requests**: 100 per IP
- **Headers**:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Configuration

All configuration is in `.env`:

```env
PORT=3001                     # Server port
NODE_ENV=development          # Environment
FINNHUB_API_KEY=xxx          # Finnhub API key
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
CACHE_TTL_QUOTES=15          # Cache duration (seconds)
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window
```

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── env.ts           # Environment configuration
│   ├── middleware/
│   │   ├── cors.ts          # CORS configuration
│   │   ├── rateLimit.ts     # Rate limiting
│   │   ├── logger.ts        # Request logging
│   │   └── errorHandler.ts  # Error handling
│   ├── services/
│   │   ├── cache.ts         # In-memory cache
│   │   ├── finnhub.ts       # Finnhub API client
│   │   ├── coingecko.ts     # CoinGecko client
│   │   └── feargreed.ts     # Fear & Greed client
│   ├── routes/
│   │   ├── market.ts        # Market endpoints
│   │   ├── news.ts          # News endpoints
│   │   ├── sentiment.ts     # Sentiment endpoints
│   │   ├── crypto.ts        # Crypto endpoints
│   │   ├── health.ts        # Health endpoints
│   │   └── index.ts         # Route aggregator
│   └── index.ts             # Server entry point
├── package.json
├── .env
└── README.md
```

## Deployment

### Railway
1. Install Railway CLI
2. Run `railway init`
3. Add environment variables in Railway dashboard
4. Deploy: `railway up`

### Docker
```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
EXPOSE 3001
CMD ["bun", "run", "start"]
```

## Monitoring

Check service health:
```bash
curl http://localhost:3001/api/health/services
```

Response:
```json
{
  "status": "healthy",
  "services": {
    "finnhub": { "status": "healthy" },
    "coingecko": { "status": "healthy" },
    "fearGreed": { "status": "healthy" }
  },
  "cache": {
    "totalEntries": 42,
    "activeEntries": 38,
    "expiredEntries": 4
  }
}
```

## Troubleshooting

### Port already in use
```bash
lsof -ti:3001 | xargs kill -9
```

### API key errors
Verify your Finnhub API key is correct in `.env`

### CORS errors
Add your frontend URL to `CORS_ORIGIN` in `.env`

## License

MIT
