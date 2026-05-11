import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'

const createNexonApiKeyGuard = (apiKey: string | undefined): Plugin => ({
  name: 'nexon-api-key-guard',
  configureServer(server) {
    server.middlewares.use('/api/maplestory/v1', (request, response, next) => {
      const host = request.headers.host?.split(':')[0]
      const isLocalhostRequest =
        host === 'localhost' || host === '127.0.0.1' || host === '::1'

      if (!isLocalhostRequest) {
        response.statusCode = 403
        response.setHeader('Content-Type', 'application/json')
        response.end(
          JSON.stringify({
            error: {
              name: 'LOCAL_PROXY_FORBIDDEN',
              message: 'Nexon API proxy is only available from localhost'
            }
          })
        )
        return
      }

      if (apiKey) {
        next()
        return
      }

      response.statusCode = 500
      response.setHeader('Content-Type', 'application/json')
      response.end(
        JSON.stringify({
          error: {
            name: 'LOCAL_CONFIG_MISSING_NEXON_API_KEY',
            message: 'NEXON_API_KEY is required in .env'
          }
        })
      )
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const nexonApiKey = env.NEXON_API_KEY

  return {
    plugins: [react(), svgr(), createNexonApiKeyGuard(nexonApiKey)],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') }
      ]
    },
    server: {
      host: '127.0.0.1',
      proxy: {
        '/api/maplestory/v1': {
          target: 'https://open.api.nexon.com',
          changeOrigin: true,
          configure: proxy => {
            proxy.on('proxyReq', proxyReq => {
              if (nexonApiKey) {
                proxyReq.setHeader('x-nxopen-api-key', nexonApiKey)
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
