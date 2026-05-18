import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      legacy({
        targets: ['> 0.5%', 'last 2 versions', 'not dead'],
        modernPolyfills: true,
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    css: {
      postcss: {
        plugins: [],
      },
    },
    build: {
      target: ['es2015', 'chrome60', 'firefox60', 'safari12', 'edge79'],
      cssTarget: ['chrome60', 'firefox60', 'safari12', 'edge79'],
    },
    server: {
      hmr: { overlay: false },
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
