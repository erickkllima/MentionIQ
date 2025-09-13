import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          // plugin opcional do Replit, carregado apenas em dev nos ambientes suportados
          await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  // o frontend fica em /client
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true, // evita trocar de porta silenciosamente
    proxy: {
      // encaminha chamadas do frontend para a API do backend
      // se suas rotas no backend começam com /api (ex.: app.get('/api/mentions', ...)),
      // NÃO use rewrite.
      "/api": {
        target: "http://localhost:3000", // porta do backend
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
