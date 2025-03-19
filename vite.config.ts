/// <reference types="vitest" />

import * as path from 'node:path'
// 热更新模块插件
// import react from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react-swc'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
// 文件路由
import Pages from 'vite-plugin-pages'
// click to component
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [react(), Unocss(), Pages()],
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,js}'],
  },
})
