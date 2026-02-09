import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'use-sync-external-store/shim/with-selector.js': path.resolve(__dirname, "./src/shims/use-sync-external-store-with-selector.ts"),
      'use-sync-external-store/shim/index.js': path.resolve(__dirname, "./src/shims/use-sync-external-store-shim.ts"),
      'use-sync-external-store/shim/with-selector': path.resolve(__dirname, "./src/shims/use-sync-external-store-with-selector.ts"),
      'use-sync-external-store/shim': path.resolve(__dirname, "./src/shims/use-sync-external-store-shim.ts"),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Optimize source maps for production
    sourcemap: false,
    // Enable minification
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-router',
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
    exclude: ['@tiptap/react', '@tiptap/starter-kit'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  // Server configuration for development
  server: {
    headers: {
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  // Preview server configuration
  preview: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  },
})