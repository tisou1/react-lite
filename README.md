# react轻量开发

## 特点
- [react18](https://reactjs.org/),[vite](https://vitejs.dev/),[pnpm](https://pnpm.js.org/)

## 主题切换-不使用state版本

```tsx
import { useEffect, useState } from 'react'

export function useTheme() {
  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const systemTheme = getSystemTheme()
    if (theme) {
      setTheme(theme)
    }
    else if (systemTheme) {
      setTheme(systemTheme ? 'dark' : 'light')
    }
  }, [])

  const setTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    const theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    setTheme(theme)
  }

  return {
    toggleTheme,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }
}

function getSystemTheme() {
  if (typeof window === 'undefined')
    return
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)').matches
  return themeMedia
}
```
