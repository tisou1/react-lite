import { useEffect, useState } from 'react'

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
  const [theme, setTheme] = useState(getTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('si-theme', theme as string)
  }, [theme])

  const setDark = (value: Theme) => {
    document.documentElement.classList.toggle('dark', value === 'dark')
    localStorage.setItem('si-theme', value)
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
