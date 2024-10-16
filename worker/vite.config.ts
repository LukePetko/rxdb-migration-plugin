import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

export default defineConfig(() => ({
  build: {
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL('./src/main.ts', import.meta.url)),
      },
      output: {
        entryFileNames: 'worker.js',
      },
    },
  },
  define: {
    global: 'self',
  },
}))

