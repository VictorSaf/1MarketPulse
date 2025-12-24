import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
        // Manual chunks for better caching
        manualChunks(id) {
          // Vendor chunks - separate heavy dependencies
          if (id.includes('node_modules')) {
            // React core - changes rarely
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }

            // Radix UI - UI primitives
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }

            // Charts - heavy library
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }

            // Icons - can be large
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            // Animation libraries
            if (id.includes('motion') || id.includes('framer-motion')) {
              return 'vendor-motion';
            }

            // MUI (if used)
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }

            // Other vendor code
            return 'vendor-other';
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
