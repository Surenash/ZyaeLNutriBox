# Build stage for Node.js
FROM node:20-slim AS node-builder

# Install Python and other dependencies needed for building
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the frontend and backend server
RUN npm run build

# Final stage
FROM node:20-slim

# Install Python and venv
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=node-builder /app/dist ./dist
COPY --from=node-builder /app/package*.json ./
COPY --from=node-builder /app/api ./api
COPY --from=node-builder /app/run_api.py ./
COPY --from=node-builder /app/pyproject.toml ./

# Install only production Node dependencies
RUN npm ci --omit=dev

# Set up Python virtual environment and install dependencies
RUN python3 -m venv .venv
RUN .venv/bin/pip install --upgrade pip
RUN .venv/bin/pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-multipart websockets

# Expose the port (App Runner usually uses 8080 or the port specified in PORT env var)
ENV PORT=5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
