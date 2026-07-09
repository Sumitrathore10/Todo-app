# Todo App - Deployment Guide

Complete guide to deploy the Todo App on AWS EC2 using Docker, Docker Compose, and Nginx.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Architecture](#architecture)
3. [Project Configuration](#project-configuration)
4. [EC2 Setup](#ec2-setup)
5. [Deployment](#deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need
- AWS Account with EC2 access
- GitHub repository access
- MongoDB Atlas account (or self-hosted MongoDB)
- Domain name (optional, can use IP directly)
- Terminal/SSH client (PuTTY, WSL, or Mac Terminal)

### Recommended Setup
- **EC2 Instance**: t3.micro (Free Tier eligible) or t3.small
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 20GB minimum
- **Security Group**: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

---

## Architecture

### System Overview
```
┌─────────────────────────────────────────┐
│           AWS EC2 Instance              │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────────┐   │
│  │      Docker Compose (3 services)   │
│  ├────────────────────────────────┤   │
│  │                                │   │
│  │  ┌──────────┐  ┌──────────┐   │   │
│  │  │ Frontend │  │ Backend  │   │   │
│  │  │ (Nginx)  │  │ (Node.js)│   │   │
│  │  │ Port3000 │  │ Port8000 │   │   │
│  │  └──────────┘  └──────────┘   │   │
│  │        ▲             ▲         │   │
│  │        └─────┬───────┘         │   │
│  │              │                 │   │
│  │        ┌──────────┐            │   │
│  │        │  Nginx   │            │   │
│  │        │ (Reverse │            │   │
│  │        │  Proxy)  │            │   │
│  │        └──────────┘            │   │
│  │         Port80/443             │   │
│  │                                │   │
│  └────────────────────────────────┘   │
│              │                        │
│              ▼                        │
│  ┌────────────────────────────────┐   │
│  │   MongoDB Atlas (Cloud)        │   │
│  └────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
         ▲                 ▲
         │                 │
    Users/Clients      Admin Access
```

---

## Project Configuration

### 1. Docker Compose Configuration

**File**: `docker-compose.yml`

```yaml
version: "3.8"

services:
  client:
    build: ./client
    ports:
      - "5173:5173"
    networks:
      - mern
  server:
    build: ./server
    ports:
      - "8000:8000"
    networks: 
      - mern
    
  
networks:
  mern: 
    driver: bridge

volumes:
  data:
    driver: local
```

**Production Version**: `docker-compose.prod.yml`

```yaml
version: "3.8"

services:
  client:
    build: ./client
    ports:
      - "3000:80"
    networks:
      - mern
    restart: unless-stopped
    depends_on:
      - server

  server:
    build: ./server
    ports:
      - "8000:8000"
    networks: 
      - mern
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.config:/etc/nginx/conf.d/default.conf:ro
    networks:
      - mern
    depends_on:
      - client
      - server
    restart: unless-stopped

networks:
  mern: 
    driver: bridge

volumes:
  data:
    driver: local
```

### 2. Frontend Dockerfile

**File**: `client/Dockerfile`

```dockerfile
FROM node:22.17.0 AS build

LABEL maintainer="Sumit Rathore <srathore132005@gmail.com>"

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**What it does:**
- Stage 1: Builds Vite React app
- Stage 2: Serves built files with Nginx
- Output: Production-ready frontend on port 80

### 3. Backend Dockerfile

**File**: `server/Dockerfile`

```dockerfile
FROM node:22.17.0 AS build

LABEL maintainer="Sumit Rathore <srathore132005@gmail.com>"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

FROM node:22.17.0-slim AS production

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package*.json /app/package*.json
COPY --from=build /app /app

EXPOSE 8000

ENTRYPOINT ["npm" , "start"]
```

**What it does:**
- Stage 1: Installs dependencies
- Stage 2: Runs slim production image
- Output: Express API server on port 8000

### 4. Nginx Configuration

**File**: `nginx.config`

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Serve React App
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Backend
    location /api/ {
        proxy_pass http://server:8000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

**How it works:**
- Port 80 (HTTP) listening
- `/` → Routes to React frontend
- `/api/` → Proxies to Node.js backend on port 8000
- WebSocket support for real-time features

---

## EC2 Setup

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click "Launch Instances"
3. Choose Ubuntu 22.04 LTS (free tier eligible)
4. Instance type: t3.micro (free) or t3.small
5. Create security group with:
   - SSH (22): Your IP
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0

### Step 2: Connect via SSH

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Run Setup Script

The `setup.sh` script installs everything needed:

```bash
# Download or copy setup.sh to EC2
curl -O https://raw.githubusercontent.com/youruser/Todo-app/main/setup.sh

# Run with sudo
sudo bash setup.sh
```

**What it installs:**
- Docker & Docker Compose
- Git
- Nginx
- Certbot (for SSL)
- Other utilities (wget, curl, vim, htop)

**Verify Installation:**
```bash
docker --version
docker-compose --version
git --version
```

---

## Deployment

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/Todo-app.git
cd Todo-app
```

### Step 2: Configure Environment Variables

```bash
# Copy example to production file
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Required Variables:**
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/Todo
JWT_SECRET=your-secret-key-here-minimum-32-characters
NODE_ENV=production
```

### Step 3: Run Deployment Script

The `deploy.sh` script automates deployment:

```bash
bash deploy.sh
```

**What it does:**
1. Checks Docker/Docker Compose installation
2. Validates environment file
3. Pulls latest code from GitHub
4. Stops old containers
5. Builds and starts new containers
6. Verifies services are running
7. Cleans up old images

### Step 4: Verify Deployment

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Test frontend
curl http://localhost

# Test backend
curl http://localhost:8000/api/v1/user/me
```

---

## Monitoring & Maintenance

### Use Maintenance Script

The `maintenance.sh` script handles common tasks:

```bash
# View container status
bash maintenance.sh status

# View logs
bash maintenance.sh logs all
bash maintenance.sh logs backend
bash maintenance.sh logs frontend

# Restart services
bash maintenance.sh restart all
bash maintenance.sh restart backend

# Update application
bash maintenance.sh update

# Run health checks
bash maintenance.sh health

# Clean up old images
bash maintenance.sh cleanup
```

### Manual Docker Commands

```bash
# View all containers
docker ps -a

# View logs
docker logs <container-id>

# Stop containers
docker-compose -f docker-compose.prod.yml down

# Start containers
docker-compose -f docker-compose.prod.yml up -d

# View resource usage
docker stats

# Execute command in container
docker exec -it <container-id> bash
```

### Database Backups

MongoDB Atlas provides automated backups:
1. Go to MongoDB Atlas Dashboard
2. Project → Backup
3. Set backup frequency to daily
4. Download backups as needed

### SSL/TLS Configuration

#### With Let's Encrypt (Free)

```bash
# Install certbot (already in setup.sh)
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.config with SSL paths
sudo nano nginx.config
```

Update nginx config:
```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    # ... rest of config
}

server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

#### Auto-renewal Cron Job

```bash
# Edit crontab
crontab -e

# Add this line (renew daily)
0 2 * * * certbot renew --quiet
```

---

## Troubleshooting

### Issue: Containers won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Verify environment file
cat .env.production

# Rebuild containers
docker-compose -f docker-compose.prod.yml up -d --build
```

### Issue: Can't connect to MongoDB

```bash
# Check connection string in .env
grep DATABASE_URL .env.production

# Test connection from backend container
docker exec -it todo-backend node -e "console.log(process.env.DATABASE_URL)"

# Verify MongoDB Atlas whitelist includes EC2 IP
# Go to MongoDB Atlas → Network Access → IP Whitelist
```

### Issue: Frontend/Backend API calls failing

```bash
# Check backend is running
curl http://localhost:8000/api/v1/health

# Check nginx proxy config
docker exec -it todo-nginx nginx -t

# View nginx config
docker exec -it todo-nginx cat /etc/nginx/conf.d/default.conf

# Check API URL in frontend
docker exec -it todo-frontend env | grep VITE_API
```

### Issue: Port already in use

```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :8000

# Kill process
sudo kill -9 <PID>

# Or change port in docker-compose.prod.yml
# "80:80" → "8080:80"
```

### Issue: Running out of disk space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune
```

### Issue: High memory usage

```bash
# Check container resource usage
docker stats

# Limit container memory in docker-compose.prod.yml
services:
  server:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

---

## Production Checklist

- [ ] EC2 instance created and running
- [ ] Security group configured (ports 22, 80, 443)
- [ ] SSH key stored safely
- [ ] Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] `.env.production` created with correct values
- [ ] MongoDB Atlas cluster configured
- [ ] JWT_SECRET generated (min 32 characters)
- [ ] Deployment script executed successfully
- [ ] Frontend accessible at http://your-ip
- [ ] API endpoint working at http://your-ip/api/v1
- [ ] SSL certificate obtained (optional)
- [ ] Domain DNS configured
- [ ] Nginx reverse proxy verified
- [ ] Monitoring enabled (health checks)
- [ ] Backup strategy configured

---

## Cost Estimation

### AWS EC2 (Monthly)
- **t3.micro**: Free for first 12 months (750 hours/month)
- **t3.small**: ~$7/month (730 hours × ~$0.0104/hour)

### MongoDB Atlas (Monthly)
- **Shared Cluster (Free)**: Free tier (512MB storage)
- **Dedicated Cluster**: $57-500+ (depending on size)

### Domain (Annual)
- Most domains: $10-15/year

### Total Estimated Cost
- **Year 1 (Free Tier)**: $0-15 (domain only)
- **Year 2+**: $67-530+ (depending on MongoDB choice)

---

## Performance Optimization

### Frontend Optimization
```javascript
// Use code splitting in Vite
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('./pages/Login'));
const Todo = lazy(() => import('./pages/Todo'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* routes */}
    </Suspense>
  );
}
```

### Backend Optimization
```javascript
// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Implement pagination
router.get('/api/v1/todo', (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  // fetch with pagination
});
```

### Database Optimization
- Create indexes on frequently queried fields
- Use MongoDB projection to return only needed fields
- Enable compression on MongoDB Atlas

---

## Support & Resources

- **Docker Docs**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **Nginx Docs**: https://nginx.org/en/docs
- **MongoDB Atlas**: https://docs.mongodb.com/atlas
- **AWS EC2**: https://docs.aws.amazon.com/ec2
- **Let's Encrypt**: https://letsencrypt.org/docs

---

## Quick Reference

### Common Commands
```bash
# Deploy
bash deploy.sh

# Monitor
bash maintenance.sh status
bash maintenance.sh logs all

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Update
bash maintenance.sh update
```

### Important Files
- `docker-compose.prod.yml` - Production docker configuration
- `nginx.config` - Nginx reverse proxy configuration
- `.env.production` - Environment variables (keep secret!)
- `client/Dockerfile` - Frontend build configuration
- `server/Dockerfile` - Backend build configuration

---

**Last Updated**: 2026-07-10  
**Version**: 1.0  
**Maintainer**: Sumit Rathore
