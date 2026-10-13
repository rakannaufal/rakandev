import { defineConfig } from 'astro/config';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

try {
  loadEnvFile(fileURLToPath(new URL('.env', import.meta.url)));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

export default defineConfig({
  site: process.env.SITE_URL || 'http://127.0.0.1:4321',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  server: { host: '127.0.0.1', port: 4321 },
});
