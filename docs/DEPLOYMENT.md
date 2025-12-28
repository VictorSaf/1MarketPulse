# 1MarketPulse - Deployment Guide

This guide covers deploying PULSE to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Deployment](#docker-deployment)
3. [Manual Deployment](#manual-deployment)
4. [Cloud Platforms](#cloud-platforms)
5. [SSL/TLS Configuration](#ssltls-configuration)
6. [Monitoring](#monitoring)
7. [Backup & Recovery](#backup--recovery)

---

## Prerequisites

### System Requirements

- **CPU**: 2+ cores (4+ recommended for AI)
- **RAM**: 4GB minimum (8GB+ for AI models)
- **Storage**: 20GB+ (more for Ollama models)
- **GPU**: Optional, but recommended for faster AI inference

### Software

- Docker 20.10+ and Docker Compose 2.0+
- OR Node.js 20+ for manual deployment
- Nginx or similar reverse proxy
- SSL certificate (Let's Encrypt recommended)

---

## Docker Deployment

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pulse2.git
cd pulse2
```

### 2. Configure Environment

```bash
# Copy production template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Critical settings to change:**
- `JWT_SECRET` - Generate secure random string
- `ALPHAVANTAGE_API_KEY` - Your API key
- `FINNHUB_API_KEY` - Your API key
- `FRONTEND_URL` - Your domain

### 3. Build and Start

```bash
# Build images
docker-compose -f docker-compose.yml build

# Start services
docker-compose -f docker-compose.yml up -d

# Initialize Ollama models (first time)
docker-compose --profile init run ollama-init
```

### 4. Verify Deployment

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Test endpoints
curl http://localhost/api/health
curl http://localhost/api/ai/health
```

### 5. Set Up Reverse Proxy

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Manual Deployment

### 1. Build Frontend

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Output is in ./dist
```

### 2. Build Backend

```bash
cd server

# Install dependencies
npm ci

# Build TypeScript
npm run build

# Start server
NODE_ENV=production npm start
```

### 3. Serve with PM2

```bash
# Install PM2
npm install -g pm2

# Start backend
cd server
pm2 start dist/index.js --name pulse-api

# Serve frontend with Nginx (copy dist/ to /var/www/pulse)
```

---

## Cloud Platforms

### AWS

**Recommended Architecture:**
- ECS/Fargate for containers
- Application Load Balancer
- RDS for database (future)
- ElastiCache for Redis (future)
- EC2 with GPU for Ollama

**Steps:**
1. Push images to ECR
2. Create ECS cluster
3. Deploy services with task definitions
4. Configure ALB with SSL

### Google Cloud

**Recommended:**
- Cloud Run for containers
- Cloud Load Balancing
- Compute Engine with GPU for Ollama

### DigitalOcean

**Simple setup:**
1. Create Droplet (4GB+ RAM)
2. Install Docker
3. Clone repo and run docker-compose
4. Use DO Load Balancer for SSL

### Railway/Render

**Easiest option:**
1. Connect GitHub repo
2. Configure environment variables
3. Deploy (auto-builds on push)

Note: Ollama requires a separate GPU server

---

## SSL/TLS Configuration

### Let's Encrypt (Recommended)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

### Manual Certificate

1. Obtain certificate from CA
2. Place files in `/etc/ssl/certs/`
3. Update Nginx configuration
4. Reload Nginx: `nginx -s reload`

---

## Monitoring

### Health Checks

```bash
# API Health
curl https://yourdomain.com/api/health

# AI Health
curl https://yourdomain.com/api/ai/health

# Frontend
curl https://yourdomain.com/health
```

### Docker Health

```bash
# View container status
docker-compose ps

# View resource usage
docker stats

# View logs
docker-compose logs -f --tail=100
```

### Recommended Tools

- **Uptime**: UptimeRobot, Pingdom
- **Logs**: Grafana Loki, ELK Stack
- **Metrics**: Prometheus + Grafana
- **Errors**: Sentry

### Basic Monitoring Script

```bash
#!/bin/bash
# save as monitor.sh

API_URL="https://yourdomain.com/api/health"
ALERT_EMAIL="admin@yourdomain.com"

if ! curl -sf "$API_URL" > /dev/null; then
    echo "PULSE API is down!" | mail -s "PULSE Alert" "$ALERT_EMAIL"
fi
```

Add to cron:
```bash
*/5 * * * * /path/to/monitor.sh
```

---

## Backup & Recovery

### Data to Backup

1. **Environment files** - `.env`, `.env.production`
2. **Ollama models** - Docker volume `ollama-data`
3. **User data** - Database (when implemented)

### Backup Script

```bash
#!/bin/bash
BACKUP_DIR="/backups/pulse2"
DATE=$(date +%Y%m%d)

mkdir -p "$BACKUP_DIR/$DATE"

# Backup env files
cp .env* "$BACKUP_DIR/$DATE/"

# Backup Ollama models
docker run --rm -v ollama-data:/data -v "$BACKUP_DIR/$DATE":/backup \
    alpine tar czf /backup/ollama-models.tar.gz /data

echo "Backup completed: $BACKUP_DIR/$DATE"
```

### Recovery

```bash
# Restore Ollama models
docker run --rm -v ollama-data:/data -v /backups/pulse2/20241224:/backup \
    alpine tar xzf /backup/ollama-models.tar.gz -C /

# Restore env
cp /backups/pulse2/20241224/.env* .

# Restart services
docker-compose down && docker-compose up -d
```

---

## Troubleshooting

### Common Issues

**Container won't start:**
```bash
docker-compose logs <service-name>
docker-compose down && docker-compose up -d
```

**Ollama models not loading:**
```bash
docker-compose exec ollama ollama list
docker-compose --profile init run ollama-init
```

**API rate limited:**
- Check API usage on provider dashboards
- Consider upgrading to paid tiers
- Implement caching

**High memory usage:**
- Reduce Ollama model size (use llama3.2:3b)
- Add swap space
- Increase server RAM

### Getting Help

1. Check logs: `docker-compose logs -f`
2. Review documentation
3. Open GitHub issue with logs and details

---

## Security Checklist

- [ ] Changed default JWT_SECRET
- [ ] Changed default admin password
- [ ] SSL/TLS enabled
- [ ] Firewall configured (only 80/443 open)
- [ ] Rate limiting enabled
- [ ] API keys secured (not in code)
- [ ] Regular backups configured
- [ ] Monitoring set up
- [ ] Log rotation configured
