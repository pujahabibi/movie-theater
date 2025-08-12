# Movie Theater Application - Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide provides step-by-step instructions to resolve the primary issue preventing the Movie Theater application from running: **Docker is not installed or available in the environment**. Follow these instructions to get your application up and running successfully.

## Quick Diagnosis

### Check Current Status
```bash
# Check if Docker is installed
docker --version
docker compose version

# Check Node.js version
node --version

# Check if application files exist
ls -la /home/daytona/movie-theater/
```

**Expected vs Current State:**
- ❌ Docker: `command not found` (ISSUE)
- ❌ Docker Compose: `command not found` (ISSUE)
- ✅ Node.js: `v24.1.0` (Version mismatch - requires v20.19.1)
- ✅ Application files: Present and verified

## Solution 1: Docker Installation (Recommended)

### Step 1: Install Docker Engine

#### For Ubuntu/Debian Systems
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine and Docker Compose
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (optional, avoids sudo)
sudo usermod -aG docker $USER
```

#### For CentOS/RHEL/Fedora Systems
```bash
# Install Docker
sudo dnf install -y docker docker-compose

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

#### For macOS
```bash
# Install Docker Desktop using Homebrew
brew install --cask docker

# Or download from: https://docs.docker.com/desktop/mac/install/
```

#### For Windows
```bash
# Install Docker Desktop using Chocolatey
choco install docker-desktop

# Or download from: https://docs.docker.com/desktop/windows/install/
```

### Step 2: Verify Docker Installation
```bash
# Verify Docker is installed and running
docker --version
# Expected output: Docker version 20.10.x or higher

docker compose version
# Expected output: Docker Compose version v2.x.x or higher

# Test Docker with hello-world
docker run hello-world
# Expected: "Hello from Docker!" message

# Check Docker service status
sudo systemctl status docker
# Expected: Active (running)
```

**Troubleshooting Docker Installation:**
```bash
# If Docker daemon is not running
sudo systemctl start docker

# If permission denied errors
sudo usermod -aG docker $USER
newgrp docker  # Or logout and login again

# If Docker Compose not found
sudo apt-get install docker-compose-plugin  # Ubuntu/Debian
# Or
sudo dnf install docker-compose  # CentOS/RHEL/Fedora
```

### Step 3: Start the Movie Theater Application
```bash
# Navigate to project directory
cd /home/daytona/movie-theater

# Make run script executable
chmod +x run.sh

# Start the application (this will auto-generate .env file)
./run.sh
```

**Expected Output:**
```
.env not found. Creating from .env.example with project-scoped credentials
[+] Building 45.2s (19/19) FINISHED
[+] Running 3/3
 ✔ Container movietheater-db       Healthy
 ✔ Container movietheater-backend  Started
 ✔ Container movietheater-frontend Started
Waiting for MySQL to become healthy...
MySQL is healthy.
Waiting for backend to be ready...
Database schema applied successfully.
Seeding database with sample data...

App is up!
API: http://localhost:4000
Frontend: http://localhost:5173
Health: curl http://localhost:4000/api/health
```

### Step 4: Verify Application is Running
```bash
# Check all services are running
docker compose ps
# Expected: All services should show "Up" status

# Test health endpoint
curl http://localhost:4000/api/health
# Expected JSON response with "status": "healthy"

# Test frontend access
curl -I http://localhost:5173
# Expected: HTTP/1.1 200 OK
```

## Solution 2: Local Development Setup (Without Docker)

### Step 1: Install Correct Node.js Version
```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install and use Node.js 20.19.1
nvm install 20.19.1
nvm use 20.19.1
nvm alias default 20.19.1

# Verify installation
node --version
# Expected: v20.19.1
```

### Step 2: Install and Configure MySQL Database
```bash
# Install MySQL (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y mysql-server mysql-client

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
-- Execute these SQL commands
CREATE DATABASE movietheater;
CREATE USER 'movietheateruser'@'localhost' IDENTIFIED BY 'movietheaterpassword';
GRANT ALL PRIVILEGES ON movietheater.* TO 'movietheateruser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Configure Environment Variables
```bash
# Navigate to project root
cd /home/daytona/movie-theater

# Create .env file
cat > .env << EOF
# Database Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=movietheater
MYSQL_USER=movietheateruser
MYSQL_PASSWORD=movietheaterpassword
DATABASE_URL=mysql://movietheateruser:movietheaterpassword@localhost:3306/movietheater

# Application Configuration
PORT=4000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
EOF
```

### Step 4: Setup Backend
```bash
# Navigate to backend directory
cd /home/daytona/movie-theater/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply database schema
npx prisma db push

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

**Expected Backend Output:**
```
🎬 Movie Theater API running on port 4000
🏥 Health check: http://localhost:4000/api/health
🌍 Environment: development
```

### Step 5: Setup Frontend
```bash
# Open new terminal and navigate to frontend directory
cd /home/daytona/movie-theater/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Frontend Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Testing Application Health Endpoints

### Backend Health Check
```bash
# Test health endpoint
curl -X GET http://localhost:4000/api/health

# Expected successful response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "database": "connected"
}

# Expected error response (if database is down):
{
  "status": "unhealthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "database": "disconnected",
  "error": "Connection error message"
}
```

### API Endpoints Testing
```bash
# Test movies endpoint
curl -X GET http://localhost:4000/api/movies

# Test snacks endpoint
curl -X GET http://localhost:4000/api/snacks

# Test showtimes endpoint
curl -X GET http://localhost:4000/api/showtimes

# Expected response format for all endpoints:
{
  "success": true,
  "data": [...]
}
```

### Frontend Health Check
```bash
# Test frontend accessibility
curl -I http://localhost:5173

# Expected response:
HTTP/1.1 200 OK
Content-Type: text/html
```

### Database Connection Testing
```bash
# Test MySQL connection directly
mysql -u movietheateruser -p -h localhost movietheater

# If successful, you should see:
# Welcome to the MySQL monitor...
# mysql>

# Test database tables exist
mysql -u movietheateruser -p -e "SHOW TABLES;" movietheater

# Expected tables:
# movies, showtimes, seats, snacks, bookings, booking_seats, booking_snacks
```

## Common Issues and Solutions

### Issue 1: Docker Permission Denied
**Symptoms:**
```
docker: Got permission denied while trying to connect to the Docker daemon socket
```

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Or logout and login again
```

### Issue 2: Port Already in Use
**Symptoms:**
```
Error: Port 4000 is already in use
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Find processes using ports
sudo lsof -i :4000
sudo lsof -i :5173
sudo lsof -i :3307

# Kill processes if needed
sudo fuser -k 4000/tcp
sudo fuser -k 5173/tcp
sudo fuser -k 3307/tcp

# Or use different ports in .env file
```

### Issue 3: Database Connection Failed
**Symptoms:**
```
Error: P1001: Can't reach database server at `db:3306`
```

**Solutions:**
```bash
# For Docker setup - check if database container is healthy
docker compose ps
docker compose logs db

# For local setup - check MySQL service
sudo systemctl status mysql
sudo systemctl start mysql

# Test database connection
mysql -u movietheateruser -p -h localhost movietheater
```

### Issue 4: Node.js Version Issues
**Symptoms:**
```
Error: Unsupported Node.js version
npm ERR! node_modules/some-package requires Node.js 20.x
```

**Solution:**
```bash
# Check current version
node --version

# Install correct version with NVM
nvm install 20.19.1
nvm use 20.19.1
nvm alias default 20.19.1

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: Prisma Client Generation Failed
**Symptoms:**
```
Error: Prisma Client could not be generated
```

**Solution:**
```bash
# Navigate to backend directory
cd /home/daytona/movie-theater/backend

# Regenerate Prisma client
npx prisma generate

# If still failing, reset and regenerate
rm -rf node_modules
npm install
npx prisma generate
```

### Issue 6: Frontend Build Errors
**Symptoms:**
```
Error: Failed to resolve import
Module not found
```

**Solution:**
```bash
# Navigate to frontend directory
cd /home/daytona/movie-theater/frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm audit
npm audit fix
```

## Environment-Specific Troubleshooting

### GitHub Codespaces
```bash
# Docker should be pre-installed, but if not:
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Start Docker service
sudo service docker start
```

### WSL2 (Windows Subsystem for Linux)
```bash
# Install Docker Desktop for Windows first
# Then in WSL2:
sudo service docker start

# If Docker daemon not accessible:
echo 'export DOCKER_HOST=tcp://localhost:2375' >> ~/.bashrc
source ~/.bashrc
```

### Cloud Development Environments
```bash
# Most cloud environments have Docker pre-installed
# If not, use the standard installation commands for your Linux distribution

# For environments without sudo access:
# Use the local development setup without Docker
```

## Performance Optimization

### Docker Performance
```bash
# Monitor resource usage
docker stats

# Optimize images (already done in Dockerfiles)
# Clean up unused containers and images
docker system prune -a
```

### Local Development Performance
```bash
# Use nodemon for auto-restart (already configured)
# Monitor Node.js memory usage
node --max-old-space-size=4096 src/server.js
```

## Monitoring and Logging

### Docker Logs
```bash
# View all service logs
docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs frontend
docker compose logs db

# Follow logs in real-time
docker compose logs -f backend
```

### Application Logs
```bash
# Backend logs (local development)
cd /home/daytona/movie-theater/backend
npm run dev  # Logs will appear in console

# Check for error logs
grep -r "Error" src/
```

## Success Verification Checklist

### ✅ Docker Setup Success Indicators
- [ ] `docker --version` returns version information
- [ ] `docker compose version` returns version information
- [ ] `docker compose ps` shows all services as "Up"
- [ ] `curl http://localhost:4000/api/health` returns healthy status
- [ ] `curl http://localhost:5173` returns HTML content
- [ ] Frontend loads in browser at http://localhost:5173
- [ ] Backend API responds at http://localhost:4000

### ✅ Local Development Success Indicators
- [ ] `node --version` returns v20.19.1
- [ ] `mysql -u movietheateruser -p movietheater` connects successfully
- [ ] Backend starts without errors on port 4000
- [ ] Frontend starts without errors on port 5173
- [ ] Health endpoint returns database "connected" status
- [ ] All API endpoints return proper JSON responses

## Getting Help

### Log Collection for Support
```bash
# Collect system information
echo "=== System Information ===" > debug.log
uname -a >> debug.log
docker --version >> debug.log 2>&1
node --version >> debug.log 2>&1

# Collect application logs
echo "=== Docker Compose Status ===" >> debug.log
docker compose ps >> debug.log 2>&1

echo "=== Backend Logs ===" >> debug.log
docker compose logs backend --tail=50 >> debug.log 2>&1

echo "=== Database Logs ===" >> debug.log
docker compose logs db --tail=50 >> debug.log 2>&1

# Share debug.log for support
```

### Common Support Resources
- **Docker Documentation**: https://docs.docker.com/
- **Node.js Documentation**: https://nodejs.org/en/docs/
- **Prisma Documentation**: https://www.prisma.io/docs/
- **MySQL Documentation**: https://dev.mysql.com/doc/

## Conclusion

This troubleshooting guide provides comprehensive solutions for the primary issue preventing the Movie Theater application from running. The **Docker installation approach is strongly recommended** as it provides:

- ✅ **Consistent Environment**: Identical setup across all systems
- ✅ **Automatic Configuration**: Environment variables and database setup handled automatically
- ✅ **Easy Deployment**: Single command (`./run.sh`) to start everything
- ✅ **Isolation**: No conflicts with system-installed software

Once Docker is installed and the application is running, you should be able to access:
- **Frontend**: http://localhost:5173 (Movie booking interface)
- **Backend API**: http://localhost:4000 (REST API endpoints)
- **Health Check**: http://localhost:4000/api/health (System status)

The application is well-built and will work perfectly once the infrastructure requirements are met.
