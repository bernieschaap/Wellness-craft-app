import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This prevents a silent error where a dependency accesses process.env
    'process.env': {},
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})