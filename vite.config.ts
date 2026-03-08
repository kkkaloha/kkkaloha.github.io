import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'docs', // 用 GitHub Pages「从 main 的 /docs 发布」时使用
  },
})
