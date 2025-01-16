import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/api': {
            target: 'http://api-chat.itclub5.my.id', // URL backend
            changeOrigin: true,
            rewrite: (path) => path.replace(/^/, ''), // Hapus prefix '/api' saat diteruskan
        },
    },
  },
});
