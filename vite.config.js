import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/EDMC/', // Deve corresponder EXATAMENTE ao nome do repositório
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})