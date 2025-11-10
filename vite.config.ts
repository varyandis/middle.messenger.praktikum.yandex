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
        login:        resolve(__dirname, 'src/pages/login/login.html'),
        registration: resolve(__dirname, 'src/pages/registration/registration.html'),
        chats:        resolve(__dirname, 'src/pages/chats/chats.html'),
        profile:      resolve(__dirname, 'src/pages/profile/profile.html'),
        error404:     resolve(__dirname, 'src/pages/error404/error404.html'),
        error500:     resolve(__dirname, 'src/pages/error500/error500.html')
      }
    }
  }
})
