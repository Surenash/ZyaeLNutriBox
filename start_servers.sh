#!/bin/bash

# Start FastAPI in the background
python run_api.py &
FASTAPI_PID=$!

# Wait a bit for FastAPI to start
sleep 2

# Start the Vite dev server (which will proxy to FastAPI)
npm run dev:old

# Cleanup on exit
trap "kill $FASTAPI_PID" EXIT
