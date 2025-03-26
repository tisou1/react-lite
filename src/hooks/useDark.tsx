import { useEffect, useState } from 'react'
import useLocalStorage from './useLocalStorage'

function getSystemTheme() {
  if (typeof window === 'undefined')
    return
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)').matches
  return themeMedia
}

function getTheme() {
  const theme = localStorage.getItem('si-theme')
  if (!theme)
    return getSystemTheme() ? 'dark' : 'light'
  return theme
}

type Theme = 'dark' | 'light' | 'auto'

export default function useDark(): {
  isDark: boolean | undefined
  setDark: (value: Theme) => void
  toggleDark: () => void
} {
  // const [theme, setTheme] = useLocalStorage('si-theme', 'auto')
  const [theme, setTheme] = useState(getTheme())

  useEffect(() => {
    // isDark将会添加'dark'类名, 为false将会清除'dark'类名'
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('si-theme', theme as string)
  }, [])

  const setDark = (value: Theme) => {
    // 更新类名
    document.documentElement.classList.toggle('dark', value === 'dark')
    // 更新本地存储
    localStorage.setItem('si-theme', value)
    // 更新stater
    setTheme(value)
  }

  const toggleDark = () => {
    setDark(theme === 'dark' ? 'light' : 'dark')
  }

  return {
    isDark: theme === 'dark',
    setDark,
    toggleDark,
  }
}
