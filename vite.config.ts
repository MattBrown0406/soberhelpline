import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@zoom/meetingsdk/embedded')) return 'zoom-embedded';
          if (id.includes('zipcodes') || id.includes('react-simple-maps')) return 'maps-and-geo';
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'react-core';
            if (id.includes('@supabase') || id.includes('@tanstack/react-query')) return 'data-layer';
            if (id.includes('recharts')) return 'charts';
          }
        },
      },
    },
  },
}));
