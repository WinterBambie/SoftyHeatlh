import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Evita CORS en desarrollo: el front llama a /HealthApi/... y Vite reenvía a Apache/XAMPP
    proxy: {
      "/HealthApi": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
})
