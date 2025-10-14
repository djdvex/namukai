import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Nurodoma, kad Vite pagrindinis failas yra aplanke public, o ne saknyje.
export default defineConfig({
  plugins: [react()],
  root: './public', 
  build: {
    // Kur statiniai failai bus sukurti.
    outDir: '../dist', 
    emptyOutDir: true,
  }
})
