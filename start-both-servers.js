import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting ZyaeL NutriBox Multi-Server Environment...\n');

// Start FastAPI server
const fastapiProcess = spawn('python', ['run_api.py'], {
  cwd: __dirname,
  env: { ...process.env, PYTHONUNBUFFERED: '1' },
  stdio: ['inherit', 'pipe', 'pipe']
});

fastapiProcess.stdout.on('data', (data) => {
  console.log(`[FastAPI] ${data.toString().trim()}`);
});

fastapiProcess.stderr.on('data', (data) => {
  console.log(`[FastAPI] ${data.toString().trim()}`);
});

fastapiProcess.on('error', (error) => {
  console.error(`[FastAPI Error] ${error.message}`);
  process.exit(1);
});

// Wait a bit for FastAPI to start, then start Express
setTimeout(() => {
  console.log('\n🔗 Starting Express proxy server...\n');
  
  const expressProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'development' },
    stdio: 'inherit',
    shell: true
  });

  expressProcess.on('error', (error) => {
    console.error(`[Express Error] ${error.message}`);
    fastapiProcess.kill();
    process.exit(1);
  });

  expressProcess.on('exit', (code) => {
    console.log(`\n[Express] Process exited with code ${code}`);
    fastapiProcess.kill();
    process.exit(code || 0);
  });
}, 3000);

fastapiProcess.on('exit', (code) => {
  console.log(`\n[FastAPI] Process exited with code ${code}`);
  process.exit(code || 0);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down servers...');
  fastapiProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Shutting down servers...');
  fastapiProcess.kill('SIGTERM');
  process.exit(0);
});
