import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const apiUrl = 'https://biblioteca-virtual-grupo-3.onrender.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/usuarios': { target: apiUrl, changeOrigin: true },
      '/perfiles': { target: apiUrl, changeOrigin: true },
      '/roles': { target: apiUrl, changeOrigin: true },
      '/prestamos': { target: apiUrl, changeOrigin: true },
    },
  },
})
