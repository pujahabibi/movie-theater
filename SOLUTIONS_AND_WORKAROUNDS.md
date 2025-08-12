# Solutions and Workarounds Guide

## Overview

This guide provides comprehensive solutions for running the Movie Theater application, including the recommended Docker setup and alternative workarounds for environments where Docker is not available.

## Solution 1: Docker Installation (Recommended)

### Prerequisites
- Administrative/sudo access to the system
- Internet connection for downloading Docker components

### Docker Installation Instructions

#### For Ubuntu/Debian Systems
```bash
# Update package index
sudo apt-get update

# Install required packages
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

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add current user to docker group (optional, avoids sudo)
sudo usermod -aG docker $USER

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

#### For CentOS/RHEL/Fedora Systems
```bash
# Install Docker using dnf/yum
sudo dnf install -y docker docker-compose

# Or for older systems
sudo yum install -y docker docker-compose

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

# Or download Docker Desktop from:
# https://docs.docker.com/desktop/mac/install/
```

#### For Windows
```bash
# Install Docker Desktop using Chocolatey
choco install docker-desktop

# Or download Docker Desktop from:
# https://docs.docker.com/desktop/windows/install/
```

### Verification
```bash
# Verify Docker installation
docker --version
docker compose version

# Test Docker with hello-world
docker run hello-world
```

### Running the Application with Docker
```bash
# Navigate to project directory
cd /home/daytona/movie-theater

# Make run script executable
chmod +x run.sh

# Start the application (creates .env automatically)
./run.sh

# Verify services are running
docker compose ps

# View logs if needed
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Application Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## Solution 2: Local Development Setup (Without Docker)

### Prerequisites
- Node.js 20.19.1 (recommended) or compatible version
- MySQL 8.0 or alternative database
- Git (for cloning and version control)

### Step 1: Node.js Version Management

#### Install Node.js 20.19.1 using NVM (Recommended)
```bash
# Install NVM (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install and use Node.js 20.19.1
nvm install 20.19.1
nvm use 20.19.1
nvm alias default 20.19.1

# Verify installation
node --version  # Should show v20.19.1
npm --version
```

#### Alternative: Direct Node.js Installation
```bash
# Download and install Node.js 20.19.1 from official website
# https://nodejs.org/en/download/

# Or use package manager (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Database Setup Options

#### Option A: Local MySQL Installation
```bash
# Ubuntu/Debian
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
-- Create database and user for movie theater app
CREATE DATABASE movietheater;
CREATE USER 'movietheateruser'@'localhost' IDENTIFIED BY 'movietheaterpassword';
GRANT ALL PRIVILEGES ON movietheater.* TO 'movietheateruser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Option B: SQLite Alternative (Simpler Setup)
Create a modified Prisma schema for SQLite:

```bash
# Backup original schema
cp /home/daytona/movie-theater/backend/prisma/schema.prisma /home/daytona/movie-theater/backend/prisma/schema.prisma.mysql.backup
```

Then modify the schema to use SQLite by changing the datasource:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3: Environment Configuration

#### Create .env file manually
```bash
# Navigate to project root
cd /home/daytona/movie-theater

# Create .env file for MySQL
cat > .env << EOF
# Database Configuration (MySQL)
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

#### Alternative .env for SQLite
```bash
# Create .env file for SQLite
cat > .env << EOF
# Database Configuration (SQLite)
DATABASE_URL=file:./dev.db

# Application Configuration
PORT=4000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
EOF
```

### Step 4: Backend Setup

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

### Step 5: Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd /home/daytona/movie-theater/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Solution 3: Cloud Development Environment

### GitHub Codespaces
```bash
# Create .devcontainer/devcontainer.json
{
  "name": "Movie Theater App",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "forwardPorts": [3000, 4000, 5173],
  "postCreateCommand": "npm install"
}
```

### Gitpod Configuration
```yaml
# .gitpod.yml
image:
  file: .gitpod.Dockerfile

ports:
  - port: 5173
    onOpen: open-preview
  - port: 4000
    onOpen: ignore
  - port: 3307
    onOpen: ignore

tasks:
  - name: Install Dependencies
    init: |
      cd backend && npm install
      cd ../frontend && npm install
  - name: Start Application
    command: ./run.sh
```

## Solution 4: Alternative Database Configurations

### Using PostgreSQL Instead of MySQL

#### Modify docker-compose.yml
```yaml
services:
  db:
    image: postgres:15
    container_name: movietheater-db
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Update Prisma Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Update .env
```bash
DATABASE_URL=postgresql://movietheateruser:movietheaterpassword@localhost:5432/movietheater
```

### Using SQLite for Development

#### Create SQLite Schema File
```bash
# Create a development schema file
cp backend/prisma/schema.prisma backend/prisma/schema.sqlite.prisma
```

#### Modify for SQLite
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Note: Remove @db.VarChar(), @db.Text, @db.Decimal() decorators
// SQLite handles these automatically
```

## Environment Configuration Steps

### Automatic Environment Setup
The `run.sh` script automatically handles environment configuration:

1. **Detects project slug** from directory name
2. **Creates .env file** from .env.example template
3. **Substitutes placeholders** with project-specific values
4. **Starts all services** in correct order

### Manual Environment Setup
If you need to configure manually:

```bash
# Set project-specific variables
PROJECT_SLUG="movietheater"

# Create .env file
cat > .env << EOF
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=${PROJECT_SLUG}
MYSQL_USER=${PROJECT_SLUG}user
MYSQL_PASSWORD=${PROJECT_SLUG}password
DATABASE_URL=mysql://${PROJECT_SLUG}user:${PROJECT_SLUG}password@db:3306/${PROJECT_SLUG}
PORT=4000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=production
EOF
```

## Troubleshooting Common Issues

### Docker Issues
```bash
# Permission denied errors
sudo usermod -aG docker $USER
newgrp docker

# Docker daemon not running
sudo systemctl start docker

# Port already in use
docker compose down
sudo lsof -i :4000  # Find process using port
sudo kill -9 <PID>  # Kill process if needed
```

### Node.js Version Issues
```bash
# Check current version
node --version

# Switch to correct version with NVM
nvm use 20.19.1

# Install specific version
nvm install 20.19.1
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u movietheateruser -p -h localhost movietheater

# Check if MySQL is running
sudo systemctl status mysql

# Reset MySQL password if needed
sudo mysql_secure_installation
```

### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :5173
sudo netstat -tulpn | grep :3307

# Kill processes using ports
sudo fuser -k 4000/tcp
sudo fuser -k 5173/tcp
sudo fuser -k 3307/tcp
```

## Testing Solutions

### Verify Docker Solution
```bash
# After Docker installation and running ./run.sh
curl http://localhost:4000/api/health
curl http://localhost:5173

# Check all services
docker compose ps
docker compose logs backend --tail=20
```

### Verify Local Development Solution
```bash
# Test backend
cd backend && npm run dev &
curl http://localhost:4000/api/health

# Test frontend
cd frontend && npm run dev &
curl http://localhost:5173
```

### Health Check Endpoints
```bash
# Backend health check
curl -X GET http://localhost:4000/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "database": "connected"
}
```

## Performance Optimization

### Docker Optimization
```bash
# Use multi-stage builds (already implemented)
# Optimize image layers
# Use .dockerignore files

# Monitor resource usage
docker stats
```

### Local Development Optimization
```bash
# Use nodemon for auto-restart
npm install -g nodemon

# Use concurrently to run both services
npm install -g concurrently

# Create combined start script
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

## Security Considerations

### Production Environment Variables
```bash
# Use strong passwords
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_PASSWORD=$(openssl rand -base64 32)

# Use environment-specific CORS origins
CORS_ORIGIN=https://yourdomain.com

# Set production NODE_ENV
NODE_ENV=production
```

### Database Security
```sql
-- Create limited privilege user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON movietheater.* TO 'app_user'@'localhost';
```

## Conclusion

This guide provides multiple pathways to run the Movie Theater application:

1. **Docker (Recommended)**: Full containerized setup with automatic configuration
2. **Local Development**: Manual setup for development environments
3. **Cloud Development**: Using Codespaces or Gitpod
4. **Alternative Databases**: PostgreSQL or SQLite options

Choose the solution that best fits your environment and requirements. The Docker solution is recommended for production and consistent development environments, while local development setup offers more flexibility for debugging and development.
