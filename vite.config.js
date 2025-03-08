import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/edmc", // Deve corresponder EXATAMENTE ao nome do repositório
  chunkSizeWarningLimit: 1500,
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
