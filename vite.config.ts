import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  plugins: [
    handlebars({
      context: {
        title: "Шаблон",
        message: 'Привет'
      }
    })
  ],

})