import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

/**
 * Dev-only plugin: serves data from ../.context/ when available.
 * Falls through to Vite's static file server (public/) when not.
 *
 * Uses a single global middleware to avoid Connect's path-mounted
 * URL stripping, which breaks fallthrough to public/ static files.
 */
function contextDataPlugin(): Plugin {
  const contextDir = path.resolve(__dirname, '../.context');

  const fileMap: Record<string, { contextFile: string; contentType: string }> = {
    '/data/replay-log.md': {
      contextFile: path.join(contextDir, 'exercise-action-log.md'),
      contentType: 'text/plain',
    },
    '/data/design-library.json': {
      contextFile: path.join(contextDir, 'design-library.json'),
      contentType: 'application/json',
    },
  };

  return {
    name: 'context-data',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) return next();

        // Check exact file matches (replay log, design library)
        // Try .context/ first, then public/ as fallback
        const mapped = fileMap[req.url];
        if (mapped) {
          const publicFallback = path.join(__dirname, 'public', req.url);
          const source = fs.existsSync(mapped.contextFile) ? mapped.contextFile :
                         fs.existsSync(publicFallback) ? publicFallback : null;
          if (source) {
            _res.setHeader('Content-Type', mapped.contentType);
            _res.end(fs.readFileSync(source, 'utf-8'));
            return;
          }
        }

        // Check attachment files: try .context/ first, then public/data/
        const attachPrefix = '/data/attachments/';
        if (req.url.startsWith(attachPrefix)) {
          const filename = decodeURIComponent(req.url.slice(attachPrefix.length));
          const candidates = [
            path.join(contextDir, 'attachments', filename),
            path.join(__dirname, 'public', 'data', 'attachments', filename),
          ];
          const found = candidates.find((p) => fs.existsSync(p));
          if (found) {
            const ext = path.extname(found).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
            };
            _res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            _res.setHeader('Content-Length', fs.statSync(found).size);
            fs.createReadStream(found).pipe(_res);
            return;
          }
        }

        next();
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
  plugins: [react(), contextDataPlugin(), spaFallbackPlugin()],
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
