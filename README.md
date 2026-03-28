# react-lite

A lightweight React scaffold for fast experiments, product MVPs, and small-to-medium apps.

## Stack

- React 19
- React Compiler
- Vite 8
- TypeScript
- React Router 7 with file-based routes via `vite-plugin-pages`
- Tailwind CSS 4
- shadcn/ui
- Vitest
- ESLint

## Features

- Fast Vite dev server with a minimal setup
- Tailwind CSS 4 with a small set of reusable component classes
- File-based routing under `src/pages`
- Built-in dark mode toggle with View Transition animation
- TypeScript-first configuration

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm lint
```

## Project structure

```text
src/
  components/   Shared UI pieces
  hooks/        Reusable hooks
  pages/        Route files discovered by vite-plugin-pages
  index.css     Tailwind entry and theme tokens
  main.tsx      App bootstrap
```

## Notes

- Dark mode is controlled through the `dark` class on `document.documentElement`.
- Routes are generated automatically from files in `src/pages`.
- The home page and dynamic route are intentionally small so the scaffold stays easy to extend.
