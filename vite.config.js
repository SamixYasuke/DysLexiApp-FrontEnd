import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "DysLexiApp",
        short_name: "DysLexiApp",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Customizing the workbox options
        cleanupOutdatedCaches: true,
        // Define the caching strategies for different file types or routes
        runtimeCaching: [
          {
            urlPattern: /\/levels$/, // Regular expression to match URLs ending with "/levels"
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24, // Cache for 1 day
              },
            },
          },
        ],
      },
    }),
  ],
});
