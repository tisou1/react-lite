import type { Root } from 'react-dom/client'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useLocalStorage from '../src/hooks/useLocalStorage'

vi.hoisted(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

describe('useLocalStorage', () => {
  let container: HTMLDivElement
  let root: Root
  let storage: ReturnType<typeof useLocalStorage<number>>
  const onError = vi.fn()

  function Harness({ storageKey = 'counter' }: { storageKey?: string }) {
    storage = useLocalStorage(storageKey, 0, { onError })
    return null
  }

  beforeEach(() => {
    localStorage.clear()
    onError.mockClear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it('persists falsy defaults and applies consecutive functional updates to the latest value', () => {
    act(() => root.render(createElement(Harness)))
    expect(localStorage.getItem('counter')).toBe('0')
    act(() => {
      storage[1](previous => (previous ?? 0) + 1)
      storage[1](previous => (previous ?? 0) + 1)
    })
    expect(storage[0]).toBe(2)
    expect(localStorage.getItem('counter')).toBe('2')
    act(() => storage[1](previous => (previous ?? 0) + 1))
    expect(storage[0]).toBe(3)
  })

  it('keeps in-memory changes when saving fails', () => {
    act(() => root.render(createElement(Harness)))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    act(() => storage[1](10))
    expect(storage[0]).toBe(10)
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'write')
  })

  it('reports corrupt data without overwriting it and allows explicit reset', () => {
    localStorage.setItem('counter', '{broken')
    act(() => root.render(createElement(Harness)))
    expect(storage[0]).toBe(0)
    expect(localStorage.getItem('counter')).toBe('{broken')
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'read')
    act(() => storage[1](0))
    expect(localStorage.getItem('counter')).toBe('0')
  })

  it('switches keys and removes the selected value', () => {
    localStorage.setItem('other', '8')
    act(() => root.render(createElement(Harness)))
    act(() => root.render(createElement(Harness, { storageKey: 'other' })))
    expect(storage[0]).toBe(8)
    act(() => storage[2]())
    expect(storage[0]).toBeUndefined()
    expect(localStorage.getItem('other')).toBeNull()
    expect(localStorage.getItem('counter')).toBe('0')
  })
})
