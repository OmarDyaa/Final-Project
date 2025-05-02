import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Helper to get the absolute path to SSL files
const sslDir = './ssl';
const getPath = (file: string) => path.resolve(sslDir, file);

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false
      },
      '/hubs': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    https: {
      key: fs.readFileSync(getPath('localhost-key.pem')),
      cert: fs.readFileSync(getPath('localhost.pem')),
    },
    hmr: {
      protocol: 'wss', // Use secure WebSockets for HMR
      host: 'localhost',
      port: 4200 // Use the same port as your dev server
    }
  }
});