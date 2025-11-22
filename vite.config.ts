import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        index:        resolve(__dirname, 'index.html'),
      }
    }
  }
})
