# react-lite 部署到 GitHub Pages 完整记录

> 适用对象：本仓库 `tisou1/react-lite`（Vite + React 19 + react-router-dom v7 + vite-plugin-pages）
> 线上地址：<https://tisou1.github.io/react-lite/>
>
> 本文是「部署 + 排错复盘」完整版，记录了从线上出现 404 到最终修复的全过程。只想快速部署的可直接看 [快速部署](#快速部署)。

---

## 目录

1. [结论速览](#结论速览)
2. [前置准备](#前置准备)
3. [快速部署](#快速部署)
4. [验证清单](#验证清单)
5. [配置要点（最终版）](#配置要点最终版)
6. [完整排错记录](#完整排错记录)
7. [问答要点](#问答要点)
8. [备选方案对照](#备选方案对照)

---

## 结论速览

GitHub Pages **项目页**的访问路径固定为 `https://<用户名>.github.io/<仓库名>/`，因此这类 SPA 要跑起来必须解决两件事：

| 要解决的问题 | 解决方案 | 所在文件 |
| --- | --- | --- |
| 静态资源要按子路径 `/react-lite/` 引用 | `base` 命令感知写法：仅 build 时设为 `/react-lite/` | `vite.config.ts` |
| `BrowserRouter` 要能剥离子路径前缀 | `basename = import.meta.env.BASE_URL` 去掉末尾 `/` | `src/main.tsx` |
| 深链接 / 刷新子路由不被 GitHub 原生 404 拦截 | 构建产物额外生成 `404.html`（内容 = `index.html`） | `vite.config.ts`（`spaGitHubPages404` 插件） |

三者缺一不可：base 管资源、basename 管路由匹配、404.html 管深链接回退。

---

## 前置准备

1. 仓库推送到 GitHub：`https://github.com/tisou1/react-lite`
2. 开启 GitHub Pages（**一次性的**，本仓库用 `gh-pages` 发布到 `gh-pages` 分支）：
   - 仓库 `Settings` → `Pages`
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `gh-pages`，目录 `/ (root)`
   - `Save` 后等待首次发布完成
3. 安装发布依赖（本仓库已在 `devDependencies` 中）：

   ```bash
   pnpm add -D gh-pages
   ```

> 注意：`gh-pages` 包会把 `dist/` 内容推送到远程 `gh-pages` 分支。对应地，GitHub Pages 的 Source 必须是该分支，二者要匹配。

---

## 快速部署

```bash
# 1. 本地构建并发布（等价于依次执行下面两步）
pnpm deploy

#   等价展开：
#   pnpm build          → tsc && vite build，产出 dist/
#   gh-pages -d dist    → 把 dist/ 推送到远程 gh-pages 分支
```

发布完成后，GitHub Pages 需要几十秒到几分钟生效（含 CDN 缓存），稍等后访问：

```
https://tisou1.github.io/react-lite/
```

## 验证清单

打开线上地址后逐项确认：

- [ ] `https://tisou1.github.io/react-lite/` → 显示首页「React 轻量脚手架」，**不是** 404
- [ ] 首页输入名字点「打开示例路由」→ 跳到 `/react-lite/hello/<名字>`，页面正常
- [ ] 浏览器地址栏直接输入 `https://tisou1.github.io/react-lite/ui` 回车 → 显示 UI 组件页（深链接直开）
- [ ] 在 `/react-lite/hello/xxx` 页面按 `F5` 刷新 → 页面仍正常（刷新深链接）
- [ ] 在 `/react-lite/hello/xxx` 点「返回上一页」→ 回到首页
- [ ] 访问一个不存在的路由（如 `/react-lite/abc`）→ 显示应用内的兜底 404 页（内容见 `src/pages/[...all].tsx`），而不是 GitHub 原生 404
- [ ] DevTools → Network：JS/CSS 请求 URL 均以 `/react-lite/assets/...` 开头（状态 200）
- [ ] 本地开发 `pnpm dev` 依然在 `http://localhost:3333/` 正常工作

---

## 配置要点（最终版）

### 1. `vite.config.ts` — base 命令感知写法 + 404.html 插件

```ts
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
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/react-lite/' : '/',
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
```

要点解释：

- `base` 用函数形式根据 `command` 区分环境：`pnpm dev` 时是 `serve`，`base = '/'`；`pnpm build` 时是 `build`，`base = '/react-lite/'`。
- `base` 必须以 `/` 开头和结尾（如 `/react-lite/`），它会同时影响：
  - 产物 `index.html` 里 JS/CSS 的引用前缀 → `/react-lite/assets/...`
  - `import.meta.env.BASE_URL` 的值 → build 后为 `/react-lite/`
- `spaGitHubPages404()` 在 `closeBundle`（构建写盘完成后）把 `index.html` 复制为 `404.html`。GitHub Pages 对仓库内不存在的路径会返回根目录的 `404.html`（HTTP 状态仍是 404，但内容是我们自己的应用入口）。

### 2. `src/main.tsx` — BrowserRouter 增加 basename

```ts
// BASE_URL 在构建时由 `vite build --base=...` 决定（如 `/react-lite/`）。
// 传给 BrowserRouter 作为 basename，GitHub Pages 子路径部署时路由才能正确匹配。
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

root.render(
  <React.StrictMode>
    <Router basename={basename}>
      <App />
      <ClickToComponent />
    </Router>
  </React.StrictMode>,
)
```

要点解释：

- `import.meta.env.BASE_URL` 在 build 后是 `/react-lite/`，去掉末尾斜杠得到 `/react-lite` 作为 `basename`。
- `basename` 让 React Router 匹配前先剥离该前缀：浏览器 pathname 为 `/react-lite/` 时，剥掉 `/react-lite` 后与路由表里的 `/` 匹配 → 首页。
- dev 环境下 `BASE_URL = '/'`，去掉末尾斜杠得到空字符串，行为与不设置 basename 完全一致，因此本地无需任何额外处理。
- 页面内的 `navigate('/hello/...')`、`<Link to="/ui">` 等仍是绝对路径写法，React Router 会自动补上 basename，**不要**手写 `/react-lite` 前缀。

### 3. `package.json` — 脚本

```json
{
  "scripts": {
    "dev": "vite --port 3333 --open",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "pnpm build && gh-pages -d dist"
  }
}
```

要点解释：

- base 已收进 `vite.config.ts`，所以 `build` 脚本里**不需要再传** `--base=/react-lite`。
- `deploy = build + gh-pages -d dist`，一次命令完成「构建 + 发布」。

---

## 完整排错记录

### 第一阶段：现象 —— 线上地址出现 404

访问 `https://tisou1.github.io/react-lite/`，页面显示：

```
404
Page not found

This fallback route is wired through vite-plugin-pages, so you can start adding real pages right away.
```

这段英文文案非常关键——它不是 GitHub 的原生 404（GitHub 原生 404 是 *"There isn't a GitHub Pages site here"*），而是**应用自己渲染的内容**，原文出自：

```text
src/pages/[...all].tsx
```

这是 `vite-plugin-pages` 约定生成的**兜底路由**（`path: '*'`）。也就是说：**应用 JS 已经加载成功了**，只是路由匹配不上当前路径，落到了兜底 404 页。

### 第二阶段：判断 —— 部署其实成功了，问题在路由

用抓取工具访问该 URL，确认能拿到 `index.html`（`<title>React-lite</title>` 等静态内容都在）。结合「404 文案来自项目内文件」这一事实，得出两个结论：

1. GitHub Pages 部署正常，`index.html` 有被正确返回；
2. 页面空白 + 404 文案 = SPA 已运行，但 React Router 没匹配到任何页面。

### 第三阶段：定位根因 —— BrowserRouter 不认识子路径前缀

仓库是 GitHub Pages **项目页**，访问路径恒为：

```
https://tisou1.github.io/react-lite/
```

此时浏览器 `location.pathname = /react-lite/`。而路由代码用的是 `BrowserRouter`，且**没有设置 `basename`**，于是它拿 `/react-lite/` 去和路由表比对：

```
/              ← 不匹配
/ui            ← 不匹配
/hello/:name   ← 不匹配
*              ← 匹配（兜底）
```

最终渲染 `src/pages/[...all].tsx`，即看到的 404 页。

> 对比开发环境：`pnpm dev` 时应用挂在根路径，pathname 就是 `/`，天然命中首页。所以本地一切正常、线上才 404——这正是「开发没问题、部署就炸」的经典子路径(base)问题。

### 第四阶段：修复 1 —— 给 BrowserRouter 加 basename

改动 `src/main.tsx`：

```ts
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
// ...
<Router basename={basename}>
```

效果：

- build 后 `BASE_URL = /react-lite/` → `basename = /react-lite`
- 访问 `/react-lite/` → 剥离前缀 → 命中 `/` 首页
- 首页点按钮 `navigate('/hello/xxx')` → React Router 自动跳 `/react-lite/hello/xxx`

**踩坑提示**：这一步只解决了「根路径/站内跳转」，还没解决「深链接刷新」。直接在地址栏打开 `/react-lite/ui` 时，请求发生在 React 加载**之前**，GitHub Pages 找不到 `ui` 这个物理文件，会先返回原生 404——HTML 都不是 `index.html`，basename 根本来不及生效。

### 第五阶段：修复 2 —— 生成 404.html 兜住深链接

GitHub Pages 有一个特性：对仓库内不存在的路径，会返回仓库根目录下的 `404.html`（若存在），否则返回 GitHub 默认 404 页。

于是利用这一点：构建完成后把 `index.html` 复制为 `404.html`（即上面的 `spaGitHubPages404()` 插件）。这样：

```
访问 /react-lite/ui（无物理文件）
  → GitHub 返回 404.html（内容 = index.html，HTTP 状态为 404）
  → 浏览器加载应用，pathname 仍是 /react-lite/ui
  → basename 剥离前缀 → 命中 /ui 路由 → 页面正常
```

**代价**：这类深链接的 HTTP 状态码仍是 404（内容正常）。对普通用户无感知，属于 GitHub Pages 静态托管的固有取舍。

### 第六阶段：base 决策 —— 三种姿势的对比与踩坑

在讨论中对比过三种加 base 的姿势，最终敲定命令感知写法：

| 姿势 | 后果 | 结论 |
| --- | --- | --- |
| dev / build 都不加 base | 产物资源写成 `/assets/...`，在子路径下解析到根域名 → **CSS/JS 全 404，页面白屏**，比路由 404 更糟 | ❌ 不可行 |
| dev / build 都加 base（写在 config 或命令里） | 可行，但 dev 也必须访问 `http://localhost:3333/react-lite/`；若打开根路径 `/`，basename 剥离失败，**本地也会看到同样的 404** | ⚠️ 可行但不方便 |
| **仅 build 加 base（命令感知写法）** | dev 保持根路径零负担，build 自动带上 `/react-lite/` | ✅ 最终方案 |

> 为什么「都不加 base」里 `index.html` 的引用是 `/assets/...`？Vite 默认 `base = '/'`，资源引用写的是**绝对根路径**。项目页部署在 `/react-lite/` 下，`/assets/...` 会去找 `https://tisou1.github.io/assets/...`（根域名，不存在）而不是 `/react-lite/assets/...`。

### 第七阶段：验证与发布

本地验证（改完代码后）：

```bash
pnpm build
```

确认产物符合预期：

- 构建通过（无 TS 错误）
- `dist/index.html` 内资源前缀为 `/react-lite/assets/...`
- `dist/` 目录下**同时存在** `index.html` 与 `404.html`

再用本地预览模拟线上路径：

```bash
pnpm preview          # 默认 http://localhost:4173/
# 浏览器访问 http://localhost:4173/react-lite/ 应正常显示首页
```

最后发布上线：

```bash
pnpm deploy           # pnpm build && gh-pages -d dist
```

> GitHub Pages 发布后可能有几十秒到几分钟的 CDN 缓存，刚发布完看到旧内容/偶发 404 时先等一等再判断。

---

## 问答要点

### Q1：为什么开发环境不加 base 反而正常？

因为 dev 服务器把应用挂在**根路径**上，浏览器 pathname 就是 `/`，与路由表天然匹配。base 只在「应用被挂到子路径」时才需要，所以问题只会在线上项目页暴露。

### Q2：如果 build 也不加 base 会怎样？

`vite build` 默认 `base: '/'`，产物 `index.html` 会写成 `<script src="/assets/xxx.js">`。部署到 `/react-lite/` 后浏览器请求的是 `https://tisou1.github.io/assets/xxx.js`——不存在 → 白屏。所以「不加 base」不是可选项，base 必须等于部署子路径（仓库名）。

### Q3：如果 dev 和 build 都加 base 呢？

base 两边一致，环境完全对齐，但 dev 也必须访问 `http://localhost:3333/react-lite/`；一旦手滑打开根路径 `/`，`basename = /react-lite` 剥不掉 → 又见 404。为了本地开发零负担，最终采用命令感知写法。

### Q4：basename 和 404.html 的分工是什么？

| 环节 | 谁负责 | 解决什么 |
| --- | --- | --- |
| 站内跳转、根路径直开 | `basename` | 路由匹配阶段：剥离 `/react-lite` 前缀 |
| 深链接直开、子路由刷新 | `404.html` | 服务器回退阶段：让 GitHub 对未知路径也返回应用入口 |

刷新 `/react-lite/ui` 时顺序是：`GitHub 返回 404.html` → `应用加载` → `basename 剥离` → `命中 /ui`。两个机制缺一不可。

### Q5：为什么页面里写路由不要带 `/react-lite`？

`basename` 是 Router 统一处理的。写了 `navigate('/react-lite/hello')` 反而会被拼成 `/react-lite/react-lite/hello`。站内一律用不带子路径的绝对路径（`/ui`、`/hello/xxx`），Router 会自动补前缀。

---

## 备选方案对照

| 方案 | 资源 base | 路由 base | 深链接 | 仓库改名 | 评价 |
| --- | --- | --- | --- | --- | --- |
| **命令感知写法（本仓库）** | 仅 build 用 `/react-lite/` | `basename = BASE_URL` | 需 `404.html` 插件 | 需同步改 config 里的 base | ✅ 当前采用：dev 零负担、配置集中在 vite.config.ts |
| 固定 base + build 脚本传参 | 构建命令里写死 `--base=/react-lite` | 同上 | 同上 | 需改 package.json + config 两处 | 与现状等价，但 base 分散在两处 |
| dev/build 都加 base | 一律 `/react-lite/` | 同上 | 同上 | 同上 | 本地也要访问 `/react-lite/`，入口易踩坑 |
| HashRouter | 仍需要 base | 不需要 basename | 天然支持（路径在 `#` 后） | 仍要改 base | URL 带 `#`；可删掉 basename 与 404.html 插件，最省心但观感差 |
| 相对 base（`base: './'`） | 资源相对引用，任意子路径可用 | 仍需 basename | history 模式下仍要 404.html | 无需改 | 资源自适应，但路由 base 与深链接问题依然存在 |

---

## 结语

GitHub Pages 项目页部署 Vite SPA 的完整链路：

```
确认页面访问路径（/<仓库名>/）
  → vite.config：base 只对 build 生效，等于仓库子路径
  → main.tsx：BrowserRouter basename 从 BASE_URL 派生
  → 构建时生成 404.html（spaGitHubPages404 插件）
  → pnpm deploy 发布
  → 按验证清单逐项确认
```

仓库地址：<https://github.com/tisou1/react-lite>
