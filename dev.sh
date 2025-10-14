#!/bin/bash

# Function to cleanup background processes
cleanup() {
    echo "Shutting down servers..."
    kill $FASTAPI_PID 2>/dev/null
    exit
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

# Start FastAPI server in background
echo "🚀 Starting FastAPI server on port 3001..."
python run_api.py &
FASTAPI_PID=$!

# Wait for FastAPI to be ready
sleep 3

# Start Express/Vite server in foreground
echo "🚀 Starting Express/Vite server on port 5000..."
NODE_ENV=development tsx server/index.ts
