import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 5010
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './tests/setupTest.js',
    coverage:{
      include: ['src/components','src/pages'],
    }
  }
})
