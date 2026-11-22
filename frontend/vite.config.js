import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend (python server.py) listens on 127.0.0.1:8765 and serves frontend/web.
// `npm run build` writes index.html + assets/ into web/ next to the static data/ folder.
const BACKEND = 'http://127.0.0.1:8765';
const proxy = {
  target: BACKEND,
  // The backend only accepts POSTs whose Origin is itself, so rewrite it in dev.
  configure: (p) => p.on('proxyReq', (req) => req.setHeader('origin', BACKEND)),
};

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: { outDir: 'web', emptyOutDir: false, assetsDir: 'assets' },
  server: { port: 5173, proxy: { '/api': proxy, '/data': proxy } },
});
