import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configuração para fallback para o index.html
    fs: {
      // Permitir servir arquivos do diretório raiz
      allow: ['..'],
    },
  },
})