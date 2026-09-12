---
name: react-lite-github-pages-deploy-doc
overview: 在仓库根目录创建 DEPLOY.md，详细记录 react-lite 部署到 GitHub Pages 的完整过程，涵盖问题现象、逐层排查、三次配置演进（basename → 404.html → base 命令感知写法）以及最终部署步骤与验证方式，方便复盘与复用。
todos:
  - id: verify-config-state
    content: 核对 package.json、vite.config.ts、src/main.tsx、src/pages 的当前真实配置与排错链路要点
    status: completed
  - id: write-deploy-doc
    content: 在仓库根目录编写 DEPLOY.md，完整记录部署过程与 404 排错复盘，内容与代码现状一致
    status: completed
    dependencies:
      - verify-config-state
---

## 需求概述

在 react-lite 仓库根目录新建 `DEPLOY.md`，用简体中文详细记录「本项目部署到 GitHub Pages + 本次线上 404 排查修复」的完整过程，便于复盘与复用。

## 文档定位与内容

文档须包含以下部分（排错 + 最终方案完整版）：

- 适用场景与结论：本仓库（tisou1/react-lite）部署到 `https://tisou1.github.io/react-lite/` 的最终正确做法
- 前置准备：仓库与 GitHub Pages 开启方式、一次性安装依赖（gh-pages 已在 devDependencies）
- 配置要点：逐项贴出最终代码并解释原因（BrowserRouter basename、`spaGitHubPages404` 插件、vite.config 命令感知 base、build/deploy 脚本）
- 部署命令：`pnpm deploy`（= `pnpm build && gh-pages -d dist`）及缓存延迟提醒
- 验证清单：首页、`/ui`、`/hello/:name`、子路由刷新/深链接直开
- 完整排错记录：从「线上 404 Page not found / This fallback route is wired through vite-plugin-pages」现象开始，到判断依据（SPA 已加载但路由未匹配）、三次配置演进（basename → 404.html → base 命令感知）及每一步的踩坑说明
- 问答要点：为什么 dev 不加 base 反而正常；为什么 dev/build 都不加 base 会白屏更糟；为什么 dev/build 都加 base 必须访问 `/react-lite/`；404.html 与 basename 的分工
- 备选方案对照表：固定 base + build 脚本传参 vs HashRouter vs 命令感知写法 vs 相对 base 的取舍

## 约束

- 仅创建/修改根目录 `DEPLOY.md` 一个文件，不改动任何代码
- 文档内容必须与仓库当前实际状态一致（仓库名 react-lite、用户名 tisou1、pnpm 命令、gh-pages 发布 dist）
- 不得虚构未发生、未验证的步骤，排错记录严格依据本次真实修复链路

## 方案概述

本任务为纯文档产出：在 `d:/t/react-lite/DEPLOY.md` 新建一份静态 Markdown 文档，不做任何代码、配置或构建改动。

## 写作准确性基线（编写前需快速核对以下真实文件）

- `package.json`：build = `tsc && vite build`；deploy = `pnpm build && gh-pages -d dist`；dev = `vite --port 3333 --open`；gh-pages 版本
- `vite.config.ts`：`defineConfig(({ command }) => ...)` 中 base 的 build/dev 分支、`spaGitHubPages404()` 插件实现（apply: 'build'、closeBundle 复制 404.html）
- `src/main.tsx`：`basename = import.meta.env.BASE_URL.replace(/\/$/, '')` 及 `<Router basename={basename}>`
- `src/pages/`：index.tsx、ui.tsx、hello/[name].tsx、[...all].tsx（兜底 404 页文案即为线上报错原文）
- 验证产物事实：`pnpm build` 通过，dist/index.html 资源前缀为 `/react-lite/assets/...`，dist 下同时存在 index.html 与 404.html

## 目录结构

```
d:/t/react-lite/
└── DEPLOY.md   # [NEW] 部署全流程文档：部署指南 + 排错复盘。含前置准备、最终配置（贴真实代码片段）、部署命令、验证清单、完整排错记录、备选方案对照表。
```

## 写作执行要点

- 代码片段一律贴当前仓库最终版真实内容，使用带语言标注的代码块
- 排错链路按时间顺序组织：现象 → 抓包判断（index.html 已返回）→ 根因定位（BrowserRouter 无 basename）→ 逐次修复与验证 → 最终方案定稿
- 使用表格对比 dev/build 环境差异与备选方案取舍
- 保留「踩坑说明」，明确每一步解决什么问题、不解决什么问题