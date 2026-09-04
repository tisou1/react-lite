import { useEffect, useState } from 'react'

const storageKey = 'si-theme'

export default function useDark() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(storageKey) === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light')
  }, [isDark])

  return {
    isDark,
    toggleDark: () => setIsDark(!isDark),
  }
}
