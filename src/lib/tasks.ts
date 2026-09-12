export interface Task {
  id: string
  title: string
  completed: boolean
}

export const TASKS_STORAGE_KEY = 'react-lite:tasks:v1'
export const sampleTasks: Task[] = [
  { id: 'explore', title: '探索组件，找到喜欢的组合', completed: true },
  { id: 'first-page', title: '为新想法创建第一个页面', completed: false },
  { id: 'make-it-yours', title: '调整配色，让模板成为自己的作品', completed: false },
]

export class InvalidTaskDataError extends Error {}

export function parseTasks(value: string): Task[] {
  try {
    const data: unknown = JSON.parse(value)
    if (!Array.isArray(data) || !data.every(task => task && typeof task.id === 'string' && task.id.length > 0 && typeof task.title === 'string' && task.title.trim().length > 0 && typeof task.completed === 'boolean') || new Set(data.map(task => task.id)).size !== data.length)
      throw new Error('Invalid task data')
    return data
  }
  catch {
    throw new InvalidTaskDataError('本地任务数据已损坏')
  }
}

export function filterTasks(tasks: Task[], query: string, filter: string) {
  const term = query.trim().toLocaleLowerCase()
  return tasks.filter(task => task.title.toLocaleLowerCase().includes(term)
    && (filter === 'all' || (filter === 'done' ? task.completed : !task.completed)))
}
