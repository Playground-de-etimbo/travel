# Docker Development Guide

## Overview
This project includes Docker configuration for a consistent development environment. You can develop entirely within Docker without installing Node.js, pnpm, or any dependencies locally.

---

## Prerequisites

### Required
- **Docker Desktop** (or Docker Engine + Docker Compose)
  - Mac: https://docs.docker.com/desktop/install/mac-install/
  - Windows: https://docs.docker.com/desktop/install/windows-install/
  - Linux: https://docs.docker.com/engine/install/

### Verify Installation
```bash
docker --version
docker-compose --version
```

---

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

#### 1. Build and start the container
```bash
docker-compose up
```

This will:
- Build the Docker image (first time only)
- Install dependencies with pnpm
- Start the Vite dev server
- Mount your code for hot reload
- Expose the app at http://localhost:5173

#### 2. Access the application
Open your browser to: **http://localhost:5173**

#### 3. Stop the container
Press `Ctrl+C` in the terminal, or:
```bash
docker-compose down
```

---

### Option 2: Using Docker Directly

#### Build the image
```bash
docker build -t travel-planner .
```

#### Run the container
```bash
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules travel-planner
```

---

## Common Docker Commands

### Development Workflow

```bash
# Start in detached mode (runs in background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild after changing Dockerfile
docker-compose up --build

# Stop and remove volumes (fresh start)
docker-compose down -v
```

### Running Commands Inside Container

```bash
# Open a shell in the running container
docker-compose exec app sh

# Run pnpm commands
docker-compose exec app pnpm install
docker-compose exec app pnpm add react-router-dom
docker-compose exec app pnpm build

# Run one-off commands
docker-compose run --rm app pnpm test
```

### Managing Dependencies

```bash
# Add a new package
docker-compose exec app pnpm add package-name

# Add a dev dependency
docker-compose exec app pnpm add -D package-name

# Remove a package
docker-compose exec app pnpm remove package-name

# Update all dependencies
docker-compose exec app pnpm update
```

---

## File Structure for Docker

```
travel/
├── Dockerfile              # Container definition
├── docker-compose.yml      # Service orchestration
├── .dockerignore          # Files to exclude from image
├── .env.local             # Environment variables (gitignored)
└── ...
```

---

## How It Works

### Hot Reload
Your local code is mounted into the container via volumes:
```yaml
volumes:
  - .:/app                    # Your code
  - node_modules:/app/node_modules  # Isolated node_modules
```

When you edit files locally, Vite detects changes and hot-reloads automatically.

### Node Modules
`node_modules` uses a Docker volume instead of your local filesystem. This:
- Prevents conflicts between host and container
- Improves performance (especially on Mac/Windows)
- Keeps your local directory clean

---

## Environment Variables

### Setup
1. Create `.env.local` in the project root
2. Add your Firebase config:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Docker Compose automatically loads `.env.local`

### Verify Variables
```bash
docker-compose exec app printenv | grep VITE
```

---

## Troubleshooting

### Port Already in Use
If port 5173 is already taken:

**Option 1:** Stop the conflicting process
```bash
lsof -ti:5173 | xargs kill -9
```

**Option 2:** Use a different port
Edit `docker-compose.yml`:
```yaml
ports:
  - "3000:5173"  # Map container 5173 to host 3000
```

Access at: http://localhost:3000

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Changes Not Reflecting

```bash
# Restart the container
docker-compose restart

# Or rebuild
docker-compose up --build
```

### Permission Issues (Linux)

If you see permission errors:
```bash
# Run with your user ID
docker-compose run --user $(id -u):$(id -g) app pnpm install
```

Or add to `docker-compose.yml`:
```yaml
user: "${UID}:${GID}"
```

### Out of Disk Space

```bash
# Clean up unused Docker resources
docker system prune -a --volumes

# Remove just stopped containers and unused images
docker system prune
```

---

## Development Options

You have two ways to develop:

### Option A: Docker (Consistent Environment)
```bash
docker-compose up
# Edit files in your editor
# Browser auto-refreshes
```

**Pros:**
- No local Node.js install needed
- Same environment as teammates
- Clean local system

**Cons:**
- Slightly slower file watching (Mac/Windows)
- Extra Docker commands

### Option B: Local (Faster)
```bash
pnpm install
pnpm dev
```

**Pros:**
- Faster hot reload
- Simpler commands
- Direct access to node_modules

**Cons:**
- Need Node.js 18+ and pnpm installed
- Potential environment differences

**Recommendation:** Use Docker for consistency, local for speed. Both work great!

---

## CI/CD with Docker

### GitHub Actions Example
```yaml
name: Build and Test
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker-compose build
      - name: Run tests
        run: docker-compose run app pnpm test
```

---

## Production Build in Docker

### Build optimized image
```bash
# Development (with dev server)
docker-compose up

# Production build
docker-compose exec app pnpm build
```

The `dist/` folder contains the production build, which you can:
- Deploy to Firebase Hosting: `firebase deploy`
- Copy from container: `docker cp travel-planner-dev:/app/dist ./dist`

---

## Docker Compose Configuration Explained

```yaml
services:
  app:
    build: .                    # Build from Dockerfile in current dir
    ports:
      - "5173:5173"            # Expose Vite dev server
    volumes:
      - .:/app                 # Mount source code
      - node_modules:/app/node_modules  # Isolate dependencies
    env_file:
      - .env.local             # Load environment variables
    restart: unless-stopped    # Auto-restart on crash
```

---

## Advanced: Multi-Stage Dockerfile (Future)

For production deployments, you could use multi-stage builds:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Not needed for MVP (Firebase Hosting handles this), but useful for self-hosting.

---

## Summary

```bash
# Most common commands you'll use:

# Start development
docker-compose up

# Stop development
docker-compose down

# Add a package
docker-compose exec app pnpm add package-name

# Open shell in container
docker-compose exec app sh

# View logs
docker-compose logs -f

# Rebuild after Dockerfile changes
docker-compose up --build
```

---

## Next Steps

1. Install Docker Desktop
2. Create `.env.local` with Firebase config
3. Run `docker-compose up`
4. Start coding! 🚀

For non-Docker setup, see [SETUP.md](SETUP.md)

---

Last updated: 2026-01-27
