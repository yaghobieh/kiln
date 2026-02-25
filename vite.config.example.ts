/**
 * Run the example app against the built dist: npm run example
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Use ESM build so named exports (CompassProvider, Routes, etc.) work
const forgeCompassPath = resolve(__dirname, '../forge-compass/dist/index.mjs');
const useLocalCompass = existsSync(resolve(__dirname, '../forge-compass/package.json'));

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'example'),
  resolve: {
    alias: {
      '../src': resolve(__dirname, 'dist/index.js'),
      '../src/types': resolve(__dirname, 'dist/index.js'),
      '@forgedevstack/kiln': resolve(__dirname, 'dist/index.js'),
      ...(useLocalCompass ? { '@forgedevstack/forge-compass': forgeCompassPath } : {}),
    },
  },
  server: {
    port: 6006,
    open: true,
  },
});
