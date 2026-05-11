import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') }
      ]
    },
    server: {
      proxy: {
        '/api/maplestory/v1': {
          target: 'https://open.api.nexon.com',
          changeOrigin: true,
          configure: proxy => {
            proxy.on('proxyReq', proxyReq => {
              if (env.NEXON_API_KEY) {
                proxyReq.setHeader('x-nxopen-api-key', env.NEXON_API_KEY)
              }
            })
          },
          rewrite: requestPath =>
            requestPath.replace(/^\/api\/maplestory\/v1/, '/maplestory/v1')
        }
      }
    }
  }
})
