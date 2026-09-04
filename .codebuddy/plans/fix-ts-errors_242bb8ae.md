---
name: fix-ts-errors
overview: 修复 react-lite 项目升级到 Vite 8 / plugin-react v6 / TypeScript 6 后残留的 TS 报错（tsconfig.node.json、vite.config.ts 及一处 lint 报错），并保持 React Compiler 正常工作。
todos:
  - id: fix-lint-quote
    content: 修正 src/pages/index.tsx 第 34 行 autoComplete 引号为双引号以消除 eslint 报错
    status: completed
  - id: add-babel-plugin-dep
    content: 在 package.json devDependencies 添加 @rolldown/plugin-babel ^0.2.0 并执行 pnpm install
    status: completed
  - id: migrate-vite-tsconfig
    content: 迁移 vite.config.ts 至 reactCompilerPreset 新 API、改 vitest/config 引用，并修复 tsconfig.node.json 的 moduleResolution 与 skipLibCheck
    status: completed
  - id: verify-ts-clean
    content: 依次运行 tsc src 与 node 工程检查、eslint 及 pnpm build，修复残留报错直至全部通过
    status: completed
    dependencies:
      - fix-lint-quote
      - add-babel-plugin-dep
      - migrate-vite-tsconfig
---

## 用户需求

清理项目中的 TypeScript 报错，使编辑器与命令行类型检查均无错误。

## 产品说明

react-lite 是 React 19 + Vite 8（Rolldown 版）+ TypeScript 6 + React Compiler 的轻量脚手架。当前报错集中在工程配置文件侧（而非 src 源码）：

- tsconfig.node.json 使用已废弃的 `moduleResolution: "node"`（TS6 下报 TS5107），且未开启 `skipLibCheck`，导致 node_modules 中 babel-plugin-react-compiler/zod 等声明文件错误外泄；
- vite.config.ts 使用 @vitejs/plugin-react v5 的旧 `babel` 选项（v6 已移除，报 TS2353），且运行时该配置不再生效；
- vite.config.ts 顶部 `/// <reference types="vitest" />` 引用错误，导致 `test` 属性类型缺失（TS2769）；
- src/pages/index.tsx 存在一处 jsx 引号风格 lint 错误。

## 核心功能

- 修复工程 tsconfig 配置错误，让 src 与 node（vite.config.ts）两个工程类型检查全部通过；
- 将 React Compiler 配置迁移到 @vitejs/plugin-react v6 官方新 API（reactCompilerPreset + @rolldown/plugin-babel），保留 README 承诺的 React Compiler 能力；
- 修复 vite.config.ts 的 vitest 类型引用与 index.tsx 的 lint 报错；
- 验证 tsc、eslint、build 全部通过。

## 技术栈

- 沿用项目现有技术栈：TypeScript 6.0.2、Vite 8（Rolldown）、@vitejs/plugin-react 6.0.1、Vitest 4.1.2、pnpm 10。

## 实施方案

以最小改动修复配置文件与类型引用，不触碰 src 业务逻辑：

1. **tsconfig.node.json**：`moduleResolution: "node"`（node10，TS6 已废弃）改为 `"bundler"`，与 module ESNext 匹配；同时补充 `"skipLibCheck": true`（与根 tsconfig.json 一致），屏蔽 babel-plugin-react-compiler 1.0.0 声明文件依赖 @babel/core、zod 引起的第三方 .d.ts 报错。保留 composite: true，维持根 tsconfig references 结构不变。

2. **vite.config.ts**：顶部引用改为 `/// <reference types="vitest/config" />`，使 defineConfig 的 `test` 属性获得类型；React Compiler 迁移为官方新写法：`import react, { reactCompilerPreset } from '@vitejs/plugin-react'` + `import babel from '@rolldown/plugin-babel'`，plugins 改为 `[react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), Pages()]`。alias、base、test 配置保持不变。

3. **package.json**：devDependencies 增加 `"@rolldown/plugin-babel": "^0.2.0"`（plugin-react v6 声明 peer 范围 ^0.1.7 || ^0.2.0），随后执行 `pnpm install` 更新 lockfile；babel-plugin-react-compiler 已存在，无需移动。

4. **src/pages/index.tsx**：第 34 行 `autoComplete='off'` 改为 `autoComplete="off"`，消除 eslint jsx-quotes 报错。

## 执行注意事项

- 不切换 build 脚本为 `tsc -b`：composite 工程会向源码目录输出声明文件，污染仓库；保持 `tsc && vite build` 不变。
- 不在 tsconfig.node.json 加 `ignoreDeprecations` 掩盖问题，直接改用 bundler 解析器才是 TS6 正确方向。
- 迁移 React Compiler 会真正启用编译（旧 babel 选项在 v6 下被忽略），改动后用完整命令验证。

## 目录结构

```
d:/t/react-lite/
├── tsconfig.node.json   # [MODIFY] moduleResolution "node"→"bundler"；新增 "skipLibCheck": true
├── vite.config.ts       # [MODIFY] 引用改为 vitest/config；React Compiler 迁移至 reactCompilerPreset + @rolldown/plugin-babel
├── package.json         # [MODIFY] devDependencies 新增 @rolldown/plugin-babel ^0.2.0
├── pnpm-lock.yaml       # [MODIFY] pnpm install 自动更新
└── src/pages/index.tsx  # [MODIFY] autoComplete='off' → autoComplete="off"
```

## 验证命令（Windows PowerShell，全部需 exit 0）

- `npx tsc -p tsconfig.json`：src 工程类型检查
- `npx tsc --noEmit --composite false -p tsconfig.node.json`：vite.config.ts 工程类型检查
- `npx eslint .`：无 lint 报错
- `pnpm build`：完整构建通过