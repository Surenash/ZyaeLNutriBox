import { spawn } from 'child_process';
import path from 'path';

// Start FastAPI server in background
const fastapi = spawn('python', ['run_api.py'], {
  cwd: path.join(import.meta.dirname, '..'),
  stdio: 'inherit'
});

// Wait for FastAPI to start
await new Promise(resolve => setTimeout(resolve, 3000));

// Import and run the Express server
await import('./index.js');

// Cleanup FastAPI on exit
process.on('SIGINT', () => {
  fastapi.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  fastapi.kill();
  process.exit();
});
