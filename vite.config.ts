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
          // Shared runtime helpers must not pull the Supabase SDK into React.
          if (id.includes("commonjsHelpers") || id.includes("/tslib/")) return "vendor-helpers";
          if (!id.includes("node_modules")) return;
          if (id.includes("@zoom/meetingsdk")) return "vendor-zoom";
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("react") || id.includes("@tanstack")) return "vendor-react";
        },
      },
    },
  },
}));
