# 1MarketPulse API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@pulse.local",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "admin@pulse.local",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## Market Data

### Get Stock Quote

```http
GET /api/quotes/:symbol
```

**Parameters:**
- `symbol` - Stock ticker symbol (e.g., AAPL, MSFT, SPY)

**Response:**
```json
{
  "symbol": "AAPL",
  "price": 195.27,
  "change": 2.45,
  "changePercent": 1.27,
  "volume": 45678900,
  "high": 196.50,
  "low": 193.10,
  "open": 193.50,
  "previousClose": 192.82,
  "timestamp": "2024-12-24T16:00:00Z",
  "source": "finnhub"
}
```

### Batch Quotes

```http
GET /api/quotes/batch?symbols=AAPL,MSFT,GOOGL
```

**Response:**
```json
{
  "quotes": {
    "AAPL": { "price": 195.27, "change": 2.45, ... },
    "MSFT": { "price": 378.91, "change": 1.23, ... },
    "GOOGL": { "price": 141.80, "change": -0.45, ... }
  }
}
```

### Fear & Greed Index

```http
GET /api/fear-greed
```

**Response:**
```json
{
  "score": 62,
  "rating": "Greed",
  "previousClose": 58,
  "oneWeekAgo": 55,
  "oneMonthAgo": 45,
  "timestamp": "2024-12-24T12:00:00Z"
}
```

### Market News

```http
GET /api/news?category=general&limit=10
```

**Parameters:**
- `category` - Optional: general, forex, crypto, merger
- `limit` - Optional: Number of articles (default: 10)

**Response:**
```json
{
  "articles": [
    {
      "id": "1",
      "headline": "Fed Signals Rate Cut",
      "summary": "Federal Reserve hints at...",
      "source": "Reuters",
      "url": "https://...",
      "image": "https://...",
      "datetime": "2024-12-24T10:30:00Z",
      "sentiment": "bullish"
    }
  ]
}
```

---

## AI Features

### Health Check

```http
GET /api/ai/health
```

**Response:**
```json
{
  "available": true,
  "models": ["qwen2.5:14b", "llama3.2:3b"],
  "defaultModel": "qwen2.5:14b"
}
```

### Sentiment Analysis

```http
POST /api/ai/sentiment
Content-Type: application/json

{
  "text": "Apple beats earnings expectations by 15%"
}
```

**Response:**
```json
{
  "sentiment": "bullish",
  "confidence": 0.92,
  "reasoning": "Strong earnings beat indicates positive momentum"
}
```

### Batch Sentiment

```http
POST /api/ai/sentiment/batch
Content-Type: application/json

{
  "texts": [
    "Apple beats earnings",
    "Oil prices crash 5%",
    "Market trades sideways"
  ]
}
```

**Response:**
```json
{
  "results": [
    { "text": "Apple beats earnings", "sentiment": "bullish", "confidence": 0.92 },
    { "text": "Oil prices crash 5%", "sentiment": "bearish", "confidence": 0.88 },
    { "text": "Market trades sideways", "sentiment": "neutral", "confidence": 0.75 }
  ]
}
```

### Morning Brief

```http
POST /api/ai/morning-brief
Content-Type: application/json

{
  "marketData": {
    "spx": { "price": 4783.45, "change": 1.24 },
    "nasdaq": { "price": 15095.14, "change": 2.18 },
    "fearGreed": 62
  }
}
```

**Response:**
```json
{
  "brief": "Markets showing bullish momentum with S&P up 1.24%...",
  "generatedAt": "2024-12-24T08:00:00Z",
  "model": "qwen2.5:14b"
}
```

### Coaching Tip

```http
POST /api/ai/coaching-tip
Content-Type: application/json

{
  "context": {
    "userLevel": "intermediate",
    "recentActivity": "pattern_recognition",
    "marketConditions": "volatile"
  }
}
```

**Response:**
```json
{
  "tip": "In volatile markets, consider reducing position sizes...",
  "category": "risk_management",
  "generatedAt": "2024-12-24T10:00:00Z"
}
```

### General Generation

```http
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "Explain the VIX index in simple terms",
  "options": {
    "temperature": 0.7,
    "maxTokens": 200
  }
}
```

**Response:**
```json
{
  "content": "The VIX, often called the 'fear index'...",
  "model": "qwen2.5:14b",
  "generatedAt": "2024-12-24T10:00:00Z"
}
```

---

## Admin

### Get Settings

```http
GET /api/admin/settings
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "general": {
    "siteName": "1MarketPulse",
    "maintenanceMode": false
  },
  "apis": {
    "finnhub": { "enabled": true, "key": "***" },
    "alphaVantage": { "enabled": true, "key": "***" }
  },
  "ai": {
    "enabled": true,
    "model": "qwen2.5:14b"
  },
  "features": {
    "paperTrading": true,
    "dailyChallenges": true
  }
}
```

### Update Settings

```http
PUT /api/admin/settings
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "general": {
    "maintenanceMode": false
  },
  "ai": {
    "model": "llama3.2:3b"
  }
}
```

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `AI_UNAVAILABLE` | 503 | Ollama not running |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/api/quotes/*` | 60/min |
| `/api/ai/*` | 30/min |
| `/api/news` | 30/min |
| Other endpoints | 100/min |

---

## WebSocket (Future)

Real-time updates will be available via WebSocket at:

```
ws://localhost:3001/ws
```

Events:
- `quote:update` - Real-time price updates
- `news:new` - New article published
- `alert:trigger` - Price alert triggered
