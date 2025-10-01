import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Configuración del Proxy Inverso
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Tu backend de Spring
        changeOrigin: true, // Esto es necesario para que el backend acepte la petición
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina '/api' de la URL antes de enviarla al 8080
      },
    },
  },
});