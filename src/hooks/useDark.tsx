import React, { useEffect, useState } from 'react'
import useLocalStorage from './useLocalStorage'

function getSystemTheme () {
  if(typeof window === 'undefined') return
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)').matches
  return themeMedia 
}

type Theme = 'dark' | 'light' | 'auto'

export default function useDark(): {
  isDark: boolean | undefined,
  setDark: (value: Theme) => void,
  toggleDark: () => void
} {
  const [theme, setTheme] = useLocalStorage('si-theme','auto')
  const isDark = theme === 'auto' ? getSystemTheme() : theme === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  },[isDark])

  const setDark = (value: Theme) => {
    setTheme(value)
  }

  const toggleDark = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    isDark,
    setDark,
    toggleDark
  }
}
