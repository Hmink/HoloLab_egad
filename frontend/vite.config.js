import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// EGAD React app. The 3D lab is the static app in web/ (served at /); this app is built into
// web/app/ and served at /app/. The lab's own React library shell has a separate config:
// vite.shell.config.js (npm run build:shell) -> web/ui/.
const BACKEND = 'http://127.0.0.1:8765';
const proxy = {
  target: BACKEND,
  // The backend only accepts POSTs whose Origin is itself, so rewrite it in dev.
  configure: (p) => p.on('proxyReq', (req) => req.setHeader('origin', BACKEND)),
};

export default defineConfig({
  plugins: [react()],
  base: '/app/',
  publicDir: false,
  build: { outDir: 'web/app', emptyOutDir: true },
  server: { port: 5173, proxy: { '/api': proxy, '/data': proxy } },
});
