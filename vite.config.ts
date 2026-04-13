import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl'
import path from 'node:path'

export default defineConfig({
  base: '/player01-exe/',
  plugins: [react(), tailwindcss(), glsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
