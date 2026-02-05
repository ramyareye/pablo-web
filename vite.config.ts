import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  // For local dev (`vite`), proxy API calls directly to the API worker.
  // In production on Pages, `/api/*` is handled by Pages Functions.
  server: {
    proxy: {
      "/api": {
        target: process.env.PABLO_API_URL || "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
});
