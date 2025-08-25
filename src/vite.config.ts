import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          lucide: ['lucide-react']
        }
      }
    },
    target: 'es2020',
    chunkSizeWarningLimit: 1600
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@/components': resolve(__dirname, 'components'),
      '@/contexts': resolve(__dirname, 'contexts'),
      '@/hooks': resolve(__dirname, 'hooks'),
      '@/utils': resolve(__dirname, 'utils'),
      '@/locales': resolve(__dirname, 'locales'),
      '@/styles': resolve(__dirname, 'styles')
    }
  },
  server: {
    port: 3000,
    host: true,
    cors: true
  },
  preview: {
    port: 3000,
    host: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'sonner',
      'date-fns',
      'clsx',
      'class-variance-authority',
      'tailwind-merge'
    ]
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
});