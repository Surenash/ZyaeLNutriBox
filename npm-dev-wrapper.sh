#!/bin/bash

# Start FastAPI in background
python run_api.py &
FASTAPI_PID=$!

# Trap exit signals to cleanup FastAPI
cleanup() {
    echo "Stopping FastAPI..."
    kill $FASTAPI_PID 2>/dev/null
    exit
}
trap cleanup EXIT INT TERM

# Wait for FastAPI to start
sleep 3

# Start Express/Vite in foreground
NODE_ENV=development tsx server/index.ts
