import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function replayLogPlugin(): Plugin {
  return {
    name: 'serve-replay-log',
    configureServer(server) {
      // Serve from .context/ if available, otherwise fall through to public/data/
      server.middlewares.use('/data/replay-log.md', (_req, res, next) => {
        const logPath = path.resolve(__dirname, '../.context/exercise-action-log.md');
        if (fs.existsSync(logPath)) {
          res.setHeader('Content-Type', 'text/plain');
          res.end(fs.readFileSync(logPath, 'utf-8'));
        } else {
          next();
        }
      });

      server.middlewares.use('/data/design-library.json', (_req, res, next) => {
        const libPath = path.resolve(__dirname, '../.context/design-library.json');
        if (fs.existsSync(libPath)) {
          res.setHeader('Content-Type', 'application/json');
          res.end(fs.readFileSync(libPath, 'utf-8'));
        } else {
          next();
        }
      });

      server.middlewares.use((req, res, next) => {
        const prefix = '/data/attachments/';
        if (!req.url || !req.url.startsWith(prefix)) return next();
        const filename = decodeURIComponent(req.url.slice(prefix.length));
        const contextPath = path.resolve(__dirname, '../.context/attachments', filename);
        if (fs.existsSync(contextPath)) {
          const stat = fs.statSync(contextPath);
          const ext = path.extname(contextPath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
          };
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
          res.setHeader('Content-Length', stat.size);
          fs.createReadStream(contextPath).pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

// SPA fallback for GitHub Pages: copy index.html → 404.html after build
function spaFallbackPlugin(): Plugin {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const index = path.resolve(outDir, 'index.html');
      const fallback = path.resolve(outDir, '404.html');
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, fallback);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/turbo-ai-exercise/' : '/',
  plugins: [react(), replayLogPlugin(), spaFallbackPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/core': path.resolve(__dirname, './src/core'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
});
