import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react()],
    envPrefix: 'VITE_',
    server: {
      proxy: {
        '/api': env.VITE_APP_API_URL, // Proxy API requests to the Node.js server
      },
    },
  }
});