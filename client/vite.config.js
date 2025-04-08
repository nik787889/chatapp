import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: '192.168.1.26',  // Your local IP address
  //   port: 5173,            // Default port
  // },
})
