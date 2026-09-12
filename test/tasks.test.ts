import type { Root } from 'react-dom/client'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { parseTasks, TASKS_STORAGE_KEY } from '../src/lib/tasks'
import TasksPage from '../src/pages/tasks'

vi.hoisted(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

describe('task example', () => {
  let root: Root
  let container: HTMLDivElement
  function render() {
    act(() => root.render(createElement(TasksPage)))
  }
  function click(label: string) {
    const button = [...document.querySelectorAll('button')].find(item => item.getAttribute('aria-label') === label || item.textContent === label)
    expect(button, `button: ${label}`).toBeTruthy()
    act(() => {
      if (button!.getAttribute('role') === 'tab')
        button!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      else
        button!.click()
    })
  }
  function input(selector: string, value: string) {
    const field = document.querySelector<HTMLInputElement>(selector)!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(field, value)
      field.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  function save() {
    act(() => document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
  }

  beforeEach(() => {
    localStorage.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it('creates, trims, edits, completes, filters, searches, deletes and restores tasks', () => {
    localStorage.setItem(TASKS_STORAGE_KEY, '[]')
    render()
    expect(container.textContent).toContain('把第一件事写下来')
    click('新增任务')
    input('#task-title', '  写一个页面  ')
    save()
    expect(container.textContent).toContain('写一个页面')
    click('编辑任务：写一个页面')
    input('#task-title', '完成新页面')
    save()
    click('完成任务：完成新页面')
    click('未完成')
    expect(container.textContent).toContain('没有找到符合条件的任务')
    click('已完成')
    expect(container.querySelector('ul')?.textContent).toContain('完成新页面')
    input('[aria-label="搜索任务"]', '找不到')
    expect(container.textContent).toContain('没有找到符合条件的任务')
    click('清除筛选')
    expect(container.querySelector('ul')?.textContent).toContain('完成新页面')
    act(() => root.unmount())
    root = createRoot(container)
    render()
    expect(container.querySelector('ul')?.textContent).toContain('完成新页面')
    click('删除任务：完成新页面')
    click('取消')
    expect(parseTasks(localStorage.getItem(TASKS_STORAGE_KEY)!)).toHaveLength(1)
    click('删除任务：完成新页面')
    click('确认删除')
    expect(localStorage.getItem(TASKS_STORAGE_KEY)).toBe('[]')
    act(() => root.unmount())
    root = createRoot(container)
    render()
    expect(container.textContent).toContain('把第一件事写下来')
  })

  it('rejects a whitespace-only title', () => {
    render()
    click('新增任务')
    input('#task-title', '   ')
    save()
    expect(document.querySelector('[role="alert"]')?.textContent).toContain('请输入任务标题')
    expect(parseTasks(localStorage.getItem(TASKS_STORAGE_KEY)!)).toHaveLength(3)
  })

  it('allows editing after a storage write failure and explains the limitation', () => {
    render()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    click('新增任务')
    input('#task-title', '临时任务')
    save()
    expect(container.querySelector('ul')?.textContent).toContain('临时任务')
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('无法保存或读取本地数据')
  })

  it('handles unavailable reads without crashing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    render()
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('仍可继续编辑')
  })

  it.each(['{broken', '[{"id":"a"}]'])('requires explicit reset for corrupt data: %s', (data) => {
    localStorage.setItem(TASKS_STORAGE_KEY, data)
    render()
    expect(localStorage.getItem(TASKS_STORAGE_KEY)).toBe(data)
    expect(container.textContent).toContain('本地任务数据已损坏')
    click('重置任务数据')
    expect(parseTasks(localStorage.getItem(TASKS_STORAGE_KEY)!)).toHaveLength(3)
    expect(container.textContent).not.toContain('本地任务数据已损坏')
  })
})
