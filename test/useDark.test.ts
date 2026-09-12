import type { Root } from 'react-dom/client'
import { act, createElement, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDark } from '../src/hooks'

vi.hoisted(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

function ThemeHarness({ onReady }: { onReady: (value: ReturnType<typeof useDark>) => void }) {
  const theme = useDark()

  useEffect(() => {
    onReady(theme)
  }, [onReady, theme])

  return null
}

describe('useDark', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => root?.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it('reads the saved theme and toggles it', () => {
    localStorage.setItem('si-theme', 'dark')
    const onReady = vi.fn()

    act(() => {
      root = createRoot(container)
      root.render(createElement(ThemeHarness, { onReady }))
    })

    expect(onReady.mock.lastCall?.[0].isDark).toBe(true)

    act(() => {
      onReady.mock.lastCall?.[0].toggleDark()
    })

    expect(onReady.mock.lastCall?.[0].isDark).toBe(false)
    expect(localStorage.getItem('si-theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('treats every value except dark as light', () => {
    localStorage.setItem('si-theme', 'auto')
    const onReady = vi.fn()

    act(() => {
      root = createRoot(container)
      root.render(createElement(ThemeHarness, { onReady }))
    })

    expect(onReady.mock.lastCall?.[0].isDark).toBe(false)
  })

  it('keeps switching when local storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const onReady = vi.fn()
    act(() => {
      root = createRoot(container)
      root.render(createElement(ThemeHarness, { onReady }))
    })
    act(() => onReady.mock.lastCall?.[0].toggleDark())
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
