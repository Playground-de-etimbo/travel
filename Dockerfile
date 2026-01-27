# Development Dockerfile for Travel Motivation Planner
# This provides a consistent development environment

FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
# Note: These will be created during project initialization
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
# This layer is cached unless package files change
RUN pnpm install

# Copy rest of the application
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
# --host flag allows access from outside the container
CMD ["pnpm", "dev", "--host"]
