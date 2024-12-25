import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables
const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8800";

export default defineConfig({
  plugins: [react()],

  // Local development server configuration
  server: {
    port: 3000, // Only affects local development
    proxy: {
      "/api": {
        target: API_BASE_URL, // Proxy API requests to the backend
        changeOrigin: true, // Ensures the host header matches the target
      },
    },
  },
});
