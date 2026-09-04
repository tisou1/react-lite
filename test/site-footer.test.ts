import type { Root } from 'react-dom/client'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SiteFooter from '../src/components/site-footer'

vi.hoisted(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

describe('site footer theme control', () => {
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
    vi.unstubAllGlobals()
  })

  it('exposes the current theme state and toggles immediately', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))

    act(() => {
      root = createRoot(container)
      root.render(createElement(SiteFooter))
    })

    const button = container.querySelector('button')
    expect(button?.getAttribute('aria-label')).toBe('切换到暗色模式')
    expect(button?.getAttribute('aria-pressed')).toBe('false')

    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(button?.getAttribute('aria-label')).toBe('切换到亮色模式')
    expect(button?.getAttribute('aria-pressed')).toBe('true')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles immediately when matchMedia throws', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => {
      throw new Error('matchMedia unavailable')
    }))

    act(() => {
      root = createRoot(container)
      root.render(createElement(SiteFooter))
    })

    expect(() => {
      act(() => {
        container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
    }).not.toThrow()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
