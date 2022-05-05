import { defineConfig } from 'vite'
//热更新模块插件
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})