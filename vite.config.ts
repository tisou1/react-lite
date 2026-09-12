/// <reference types="vitest/config" />

import type { Plugin } from 'vite'
import * as fs from 'node:fs'
import * as path from 'node:path'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'

/**
 * GitHub Pages 项目页只会在根路径返回 index.html，
 * 对 /react-lite/xxx 这类深链接会直接返回 404。
 * 构建结束后复制一份 index.html 为 404.html，让深链接也能加载 SPA 并命中正确路由。
 */
function spaGitHubPages404(): Plugin {
  let outDir = 'dist'
  return {
    name: 'spa-gh-pages-404',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const indexHtml = path.resolve(outDir, 'index.html')
      if (fs.existsSync(indexHtml))
        fs.copyFileSync(indexHtml, path.resolve(outDir, '404.html'))
    },
  }
}

// dev 挂载在根路径，base 用默认 '/'；
// build 输出部署到 GitHub Pages 项目页（/react-lite/），base 必须与仓库子路径一致。
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/react-lite/' : '/',
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    Pages(),
    spaGitHubPages404(),
  ],
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,js}'],
  },
}))
