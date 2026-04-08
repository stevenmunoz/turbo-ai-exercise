import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function replayLogPlugin(): Plugin {
  return {
    name: 'serve-replay-log',
    configureServer(server) {
      // Serve the action log markdown
      server.middlewares.use('/data/replay-log.md', (_req, res) => {
        const logPath = path.resolve(__dirname, '../.context/exercise-action-log.md');
        try {
          const content = fs.readFileSync(logPath, 'utf-8');
          res.setHeader('Content-Type', 'text/plain');
          res.end(content);
        } catch {
          res.statusCode = 404;
          res.end('Log file not found');
        }
      });

      // Serve design library JSON
      server.middlewares.use('/data/design-library.json', (_req, res) => {
        const libPath = path.resolve(__dirname, '../.context/design-library.json');
        try {
          const content = fs.readFileSync(libPath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.end(content);
        } catch {
          res.setHeader('Content-Type', 'application/json');
          res.end('[]');
        }
      });

      // Serve screenshot attachments
      server.middlewares.use('/data/attachments', (req, res) => {
        const filename = decodeURIComponent((req.url || '').replace(/^\//, ''));
        const filePath = path.resolve(__dirname, '../.context/attachments', filename);
        try {
          const stat = fs.statSync(filePath);
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
          };
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
          res.setHeader('Content-Length', stat.size);
          fs.createReadStream(filePath).pipe(res);
        } catch {
          res.statusCode = 404;
          res.end('File not found');
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
  base: process.env.GITHUB_PAGES === 'true' ? '/trubo-ai-exercise/' : '/',
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
