# Development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite port
EXPOSE 3000

# Start development server with host flag to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
