import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/gazprom-tools', 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        assistant: resolve(__dirname, 'assistant/index.html'),
        // Добавьте другие входные точки по мере необходимости
      }
    }
  },
  define: {
    'process.env': process.env
  }
})