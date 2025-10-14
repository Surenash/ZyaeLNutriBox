import express, { type Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from 'http-proxy-middleware';
import http from 'http';
import { spawn } from 'child_process';
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Proxy all /api requests to FastAPI server on port 3001
// IMPORTANT: Proxy must come BEFORE body parsers to avoid consuming request body
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: false,
  pathRewrite: { '^/api': '' }, // Remove /api prefix before forwarding
}));

// Body parsers for non-proxied routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WebSocket proxy configuration
const wsProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true,
});

// Apply WebSocket proxy middleware  
app.use('/ws', wsProxy);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Start FastAPI server as a child process
let fastapiProcess: any = null;
if (process.env.NODE_ENV === "development") {
  log("🚀 Starting FastAPI backend server on port 3001...");
  fastapiProcess = spawn('python', ['run_api.py'], {
    cwd: process.cwd(),
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  fastapiProcess.stdout.on('data', (data: Buffer) => {
    const message = data.toString().trim();
    if (message && !message.includes('INFO:')) {
      log(`[FastAPI] ${message}`);
    }
  });

  fastapiProcess.stderr.on('data', (data: Buffer) => {
    const message = data.toString().trim();
    if (message && !message.includes('INFO:')) {
      log(`[FastAPI] ${message}`);
    }
  });

  fastapiProcess.on('error', (error: Error) => {
    log(`[FastAPI Error] ${error.message}`);
  });

  fastapiProcess.on('exit', (code: number) => {
    if (code !== 0 && code !== null) {
      log(`[FastAPI] Process exited with code ${code}`);
    }
  });

  // Give FastAPI a moment to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  log("✅ FastAPI backend ready");
}

(async () => {
  // Removed registerRoutes - using FastAPI backend instead
  const server = http.createServer(app);

  // Handle WebSocket upgrade requests
  server.on('upgrade', (req, socket, head) => {
    if (req.url?.startsWith('/ws')) {
      wsProxy.upgrade!(req, socket as any, head);
    } else {
      socket.destroy();
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });

  // Cleanup FastAPI process on exit
  process.on('SIGINT', () => {
    if (fastapiProcess) {
      log('⏹️  Shutting down FastAPI server...');
      fastapiProcess.kill('SIGTERM');
    }
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    if (fastapiProcess) {
      log('⏹️  Shutting down FastAPI server...');
      fastapiProcess.kill('SIGTERM');
    }
    process.exit(0);
  });
})();
