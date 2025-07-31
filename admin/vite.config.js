// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
//    server: {
//     proxy: {
//       "/api": "http://localhost:5006", // Backend port
//     },
//   },
// })


import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars based on mode (e.g., development, production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': env.VITE_BACKEND_URL,
      },
    },
  }
})
