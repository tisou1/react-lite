import React, { useState } from 'react'

function judgeDark () {
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)').matches
  return themeMedia
}

export default function useDark(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(() => judgeDark())

  //html类名,本地存储都要修改
  const trigger = () => {
    document.documentElement.classList.toggle(isDark ? 'light' : 'dark')

    setIsDark(!isDark)
  }

  return [isDark, trigger]
}
