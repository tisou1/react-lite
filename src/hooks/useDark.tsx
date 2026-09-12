import { useEffect, useState } from 'react'

const storageKey = 'si-theme'

export default function useDark() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === 'dark'
    }
    catch {
      return document.documentElement.classList.contains('dark')
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      localStorage.setItem(storageKey, isDark ? 'dark' : 'light')
    }
    catch {
      // Theme switching still works when storage is unavailable.
    }
  }, [isDark])

  return {
    isDark,
    toggleDark: () => setIsDark(previous => !previous),
  }
}
