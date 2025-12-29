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
          // React core (smallest possible chunk)
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // React ecosystem (router, forms, hooks)
          if (id.includes('react-router') ||
              id.includes('react-hook-form') ||
              id.includes('react-day-picker') ||
              id.includes('react-dnd') ||
              id.includes('react-slick') ||
              id.includes('react-resizable-panels') ||
              id.includes('react-responsive-masonry') ||
              id.includes('react-popper')) {
            return 'vendor-react-ecosystem';
          }
          // Sentry monitoring (large library, should be separate)
          if (id.includes('@sentry/')) {
            return 'vendor-monitoring';
          }
          // Supabase client
          if (id.includes('@supabase/')) {
            return 'vendor-supabase';
          }
          // Icons (lucide is very large)
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          // Animation libraries
          if (id.includes('motion') || id.includes('framer-motion')) {
            return 'vendor-animation';
          }
          // Charts and visualization
          if (id.includes('recharts') ||
              id.includes('d3') ||
              id.includes('victory')) {
            return 'vendor-charts';
          }
          // Date/time utilities
          if (id.includes('date-fns')) {
            return 'vendor-date';
          }
          // UI framework (Radix)
          if (id.includes('@radix-ui/')) {
            return 'vendor-ui-radix';
          }
          // UI utilities
          if (id.includes('class-variance-authority') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge') ||
              id.includes('cmdk') ||
              id.includes('sonner') ||
              id.includes('vaul') ||
              id.includes('embla-carousel') ||
              id.includes('input-otp')) {
            return 'vendor-ui-utils';
          }
          // State management
          if (id.includes('zustand') || id.includes('immer')) {
            return 'vendor-state';
          }
          // Data fetching and caching
          if (id.includes('axios') || id.includes('idb/')) {
            return 'vendor-data';
          }
          // Security utilities
          if (id.includes('dompurify')) {
            return 'vendor-security';
          }
          // Popper/positioning
          if (id.includes('@popperjs/')) {
            return 'vendor-popper';
          }
          // Next themes
          if (id.includes('next-themes')) {
            return 'vendor-themes';
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
