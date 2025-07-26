import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      viteMockServe({
      mockPath: 'src/mock',        // 1️⃣ 路径要对
      enable: true,          // 2️⃣ 必须为 true
    })
    ],
    proxy: {
      '/api-real': {
        target: env.VITE_API_BASE || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, '')
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})