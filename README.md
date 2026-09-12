# React Lite

清爽、轻量的 React 起手模板，适合快速实验、产品 MVP 和小型应用。

## 启动与检查

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm preview
```

开发服务默认端口为 3333。构建使用 React Compiler、Vite 8、TypeScript、Tailwind CSS 4；页面通过 React Router 7 与 vite-plugin-pages 加载。

## 页面

- `/`：模板首页、动态路由实验室、启动命令复制。
- `/ui`：可操作的组件展示，包括表单校验、标签页、弹窗与加载状态。
- `/tasks`：任务新增、编辑、完成、删除、搜索与状态筛选。
- `/hello/:name`：动态参数示例。
- 其他路径：中文 404 页面与返回首页入口。

## 新增页面

在 `src/pages` 新建默认导出的 React 页面即可自动生成路由。例如 `about.tsx` 对应 `/about`，`hello/[name].tsx` 对应 `/hello/:name`。导航项在 `src/components/site-header.tsx` 中维护，页面标题在 `src/app/App.tsx` 中维护。路由内容有加载提示和错误边界。

## 复用组件

共享组件位于 `src/components/ui`，按需导入，例如：

```tsx
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
```

颜色、字体和圆角在 `src/index.css` 定义，并通过 `@theme inline` 映射到 Tailwind 工具类。使用 `bg-card`、`text-muted-foreground` 等语义类，避免为每个页面重复定义亮暗颜色。弹窗、标签页、复选框使用已有 Radix 依赖。

## 主题

支持亮色与暗色，主题键为 `si-theme`。HTML 在首次绘制前恢复已保存的暗色主题，没有有效设置时使用亮色。存储不可用时，当前页面仍可切换。主题采用直接切换，没有 View Transition 动画。组件过渡尊重系统的减少动态效果设置。

## 任务示例与存储

任务类型为 `Task { id, title, completed }`，数据只保存在当前浏览器的 `react-lite:tasks:v1` 中，无后端、账号或跨设备同步。首次提供三项示例任务；清空后刷新仍保持为空。标题去除首尾空白后不能为空，编辑框最多输入 200 个字符。

存储失败时，任务仍可在当前页面编辑，但刷新或离开可能丢失修改；损坏数据不会自动覆盖，页面提供明确的重置入口。共享 `useLocalStorage` 保留 `[value, setValue, remove]` 返回值，支持连续函数式更新、原始字符串、自定义序列化和可选 `onError(error, operation)` 回调。

移除任务示例：删除 `src/pages/tasks.tsx` 与 `src/lib/tasks.ts`，移除页头、页脚、首页和组件页中的任务入口，删除 `test/tasks.test.ts`，并更新 App 的页面标题映射。共享组件和存储 hook 可继续用于其他功能。

## 部署

默认构建与预览路径为 `/react-lite/`，适用于同名 GitHub Pages 项目页。部署到站点根路径可执行 `pnpm build --base=/`，对应预览命令为 `pnpm preview --base=/`。路由 basename 跟随 Vite BASE_URL。构建自动生成 `404.html`，让 GitHub Pages 深链接能加载应用（平台仍可能返回 HTTP 404 状态）。

本模板没有接入后端、身份认证、请求状态库或额外动画库。
