import * as path from 'path'
import { defineConfig } from 'vite'
//热更新模块插件
import react from '@vitejs/plugin-react'
//文件路由
import Pages from 'vite-plugin-pages'
import Unocss from 'unocss/vite'


export default defineConfig({
  resolve:{
    alias: {
      '~/': `${path.resolve(__dirname,'src')}/`,
    }
  },
  plugins: [
    react(),
    Unocss(),
    Pages(),
  ]
})