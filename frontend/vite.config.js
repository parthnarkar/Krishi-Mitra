import { defineConfig } from 'vite'
import tailwindPostcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  // ... other config
  css: {
    postcss: {
      plugins: [
        tailwindPostcss({
          config: './tailwind.config.cjs'
        }),
        autoprefixer()
      ]
    }
  }
})