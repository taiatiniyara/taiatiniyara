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
    tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // SEO & Performance optimizations
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['@tanstack/react-router'],
          'query': ['@tanstack/react-query'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['lucide-react', 'react-spinners'],
          'editor': ['@tiptap/react', '@tiptap/starter-kit'],
        },
      },
    },
    // Optimize assets
    assetsInlineLimit: 4096,
    // Enable minification for smaller bundle sizes (esbuild is faster than terser)
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Disable source maps for production
    sourcemap: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router'],
  },
})