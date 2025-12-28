import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Target modern browsers for smaller bundle
    target: 'esnext',

    // Minification
    minify: 'esbuild',

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Chunk size warning limit
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Improved chunking strategy to reduce main bundle size
        manualChunks: (id) => {
          // React core libraries
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // UI component libraries
          if (id.includes('node_modules/@radix-ui/') ||
              id.includes('node_modules/lucide-react/') ||
              id.includes('node_modules/class-variance-authority/') ||
              id.includes('node_modules/clsx/') ||
              id.includes('node_modules/tailwind-merge/')) {
            return 'vendor-ui';
          }
          // State management and utilities
          if (id.includes('node_modules/zustand/') ||
              id.includes('node_modules/immer/')) {
            return 'vendor-state';
          }
          // Data fetching and caching
          if (id.includes('node_modules/axios/') ||
              id.includes('node_modules/idb/')) {
            return 'vendor-data';
          }
          // Security utilities
          if (id.includes('node_modules/dompurify/')) {
            return 'vendor-security';
          }
          // Charting libraries (if any)
          if (id.includes('node_modules/recharts/') ||
              id.includes('node_modules/d3')) {
            return 'vendor-charts';
          }
        },

        // Filename patterns for long-term caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@radix-ui/react-tabs',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
    ],
  },

  // Development server settings
  server: {
    port: 5173,
    hmr: true,
  },

  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
