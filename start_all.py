#!/usr/bin/env python3
import subprocess
import signal
import sys
import time
import os

# Store child processes
processes = []

def cleanup(signum=None, frame=None):
    """Cleanup all child processes"""
    print("\n🛑 Shutting down servers...")
    for proc in processes:
        try:
            proc.terminate()
            proc.wait(timeout=5)
        except:
            proc.kill()
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

try:
    # Start FastAPI server
    print("🚀 Starting FastAPI server on port 3001...")
    fastapi_proc = subprocess.Popen(
        ['python', 'run_api.py'],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=os.getcwd()
    )
    processes.append(fastapi_proc)
    
    # Wait for FastAPI to start
    time.sleep(3)
    
    # Start Express/Vite server
    print("🚀 Starting Express/Vite server on port 5000...")
    express_proc = subprocess.Popen(
        ['npm', 'run', 'dev'],
        env={**os.environ, 'NODE_ENV': 'development'},
        cwd=os.getcwd()
    )
    processes.append(express_proc)
    
    # Wait for Express process
    express_proc.wait()
    
except KeyboardInterrupt:
    cleanup()
except Exception as e:
    print(f"❌ Error: {e}")
    cleanup()
