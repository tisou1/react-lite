import type { FormEvent } from 'react'
import type { Task } from '~/lib/tasks'
import { CheckCheck, HardDrive, ListTodo, Pencil, Plus, Search, SearchX, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Alert } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useLocalStorage from '~/hooks/useLocalStorage'
import { filterTasks, InvalidTaskDataError, parseTasks, sampleTasks, TASKS_STORAGE_KEY } from '~/lib/tasks'

const filters = [{ value: 'all', label: '全部' }, { value: 'todo', label: '未完成' }, { value: 'done', label: '已完成' }]

export default function TasksPage() {
  const [storageError, setStorageError] = useState<'corrupt' | 'unavailable' | null>(null)
  const [storedTasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, sampleTasks, {
    deserializer: parseTasks,
    onError: error => setStorageError(error instanceof InvalidTaskDataError ? 'corrupt' : 'unavailable'),
  })
  const tasks = storedTasks ?? []
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit' | 'delete'>('create')
  const [selected, setSelected] = useState<Task | null>(null)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const opener = useRef<HTMLElement | null>(null)
  const addButton = useRef<HTMLButtonElement>(null)
  const visible = filterTasks(tasks, query, filter)
  const done = tasks.filter(task => task.completed).length

  function begin(action: typeof mode, element: HTMLElement, task: Task | null = null) {
    opener.current = element
    setMode(action)
    setSelected(task)
    setTitle(task?.title ?? '')
    setError('')
    setOpen(true)
  }

  function commit(next: (previous: Task[]) => Task[], message: string) {
    setStorageError(null)
    setTasks(previous => next(previous ?? []))
    setNotice(message)
  }

  function save(event: FormEvent) {
    event.preventDefault()
    const clean = title.trim()
    if (!clean) {
      setError('请输入任务标题，不能只包含空格。')
      return
    }
    if (mode === 'edit' && selected) {
      commit(previous => previous.map(task => task.id === selected.id ? { ...task, title: clean } : task), '任务已更新')
    }
    else {
      const task = { id: crypto.randomUUID(), title: clean, completed: false }
      commit(previous => [task, ...previous], '任务已添加')
    }
    setOpen(false)
  }

  return (
    <div className="page-shell py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">A SMALL, WORKING EXAMPLE</p>
          <h1 className="page-heading mt-3">把下一步，写下来。</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">一个小小的任务清单，试试新增、筛选与编辑。</p>
        </div>
        <Button ref={addButton} disabled={storageError === 'corrupt'} onClick={event => begin('create', event.currentTarget)}>
          <Plus />
          新增任务
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {[{ label: '全部任务', count: tasks.length, icon: ListTodo }, { label: '等待完成', count: tasks.length - done, icon: Plus }, { label: '已经完成', count: done, icon: CheckCheck }].map(({ label, count, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-4 sm:p-5">
            <p className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
              {label}
              <Icon className="hidden size-4 sm:block" />
            </p>
            <p className="mt-3 font-heading text-3xl font-semibold tabular-nums">{storageError === 'corrupt' ? '—' : count}</p>
          </div>
        ))}
      </div>

      {storageError && (
        <Alert role="alert" className="mt-5">
          {storageError === 'corrupt'
            ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p>本地任务数据已损坏。重置后将替换为初始示例任务。</p>
                  <Button variant="outline" size="sm" onClick={() => commit(() => sampleTasks, '已重置为示例任务')}>重置任务数据</Button>
                </div>
              )
            : '无法保存或读取本地数据。你仍可继续编辑，但离开或刷新页面可能丢失本次修改。'}
        </Alert>
      )}

      {storageError !== 'corrupt' && (
        <Tabs value={filter} onValueChange={setFilter} className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4 sm:p-5">
            <TabsList aria-label="任务状态筛选">{filters.map(item => <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>)}</TabsList>
            <div className="relative w-full sm:w-60">
              <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
              <Input aria-label="搜索任务" placeholder="搜索任务…" value={query} onChange={event => setQuery(event.target.value)} className="bg-card pl-9" />
            </div>
          </div>
          {filters.map(item => (
            <TabsContent key={item.value} value={item.value} className="mt-0">
              {visible.length > 0
                ? (
                    <ul className="divide-y" aria-label="任务列表">
                      {visible.map(task => (
                        <li key={task.id} className="flex items-start gap-3 px-4 py-5 sm:items-center sm:px-6">
                          <Checkbox className="mt-1 sm:mt-0" checked={task.completed} aria-label={`${task.completed ? '标记未完成' : '完成任务'}：${task.title}`} onCheckedChange={checked => commit(previous => previous.map(item => item.id === task.id ? { ...item, completed: checked === true } : item), checked ? '任务已完成' : '任务已标记为未完成')} />
                          <div className="min-w-0 flex-1"><p className={`text-sm leading-6 break-words ${task.completed ? 'text-muted-foreground line-through' : ''}`}>{task.title}</p></div>
                          <Badge className="hidden shrink-0 sm:inline-flex">{task.completed ? '已完成' : '未完成'}</Badge>
                          <div className="flex shrink-0 gap-1">
                            <Button variant="ghost" size="icon" aria-label={`编辑任务：${task.title}`} onClick={event => begin('edit', event.currentTarget, task)}><Pencil /></Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" aria-label={`删除任务：${task.title}`} onClick={event => begin('delete', event.currentTarget, task)}><Trash2 /></Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                : (
                    <div className="px-5 py-16 text-center">
                      <SearchX className="mx-auto size-8 text-muted-foreground" />
                      <h2 className="mt-4 font-semibold">{tasks.length === 0 ? '把第一件事写下来' : '没有找到符合条件的任务'}</h2>
                      <p className="mt-2 text-sm text-muted-foreground">{tasks.length === 0 ? '从一件小事开始，慢慢完成你的想法。' : '试试其他关键词，或查看全部任务。'}</p>
                      <Button variant="outline" className="mt-5" onClick={event => tasks.length === 0 ? begin('create', event.currentTarget) : (setQuery(''), setFilter('all'))}>{tasks.length === 0 ? '新增第一个任务' : '清除筛选'}</Button>
                    </div>
                  )}
            </TabsContent>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3 text-xs text-muted-foreground">
            <span>
              显示
              {visible.length}
              {' '}
              /
              {tasks.length}
              {' '}
              项任务
            </span>
            <span className="flex items-center gap-1.5">
              <HardDrive className="size-3.5" />
              仅保存在当前浏览器
            </span>
          </div>
        </Tabs>
      )}
      <p role="status" className="mt-4 min-h-5 text-sm text-muted-foreground">{notice}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onCloseAutoFocus={(event) => {
          event.preventDefault();
          (opener.current?.isConnected ? opener.current : addButton.current)?.focus()
        }}
        >
          <DialogTitle>{mode === 'delete' ? '删除这项任务？' : mode === 'edit' ? '编辑任务' : '添加一件要做的事'}</DialogTitle>
          <DialogDescription>{mode === 'delete' ? '删除后无法恢复，请确认是否继续。' : '写一个清晰的标题，给下一步一个方向。'}</DialogDescription>
          {mode === 'delete'
            ? (
                <>
                  <p className="mt-5 rounded-lg bg-muted p-3 text-sm break-words">{selected?.title}</p>
                  <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        commit(previous => previous.filter(task => task.id !== selected?.id), '任务已删除')
                        setOpen(false)
                      }}
                    >
                      确认删除
                    </Button>
                  </div>
                </>
              )
            : (
                <form onSubmit={save} className="mt-5">
                  <label htmlFor="task-title" className="mb-2 block text-sm font-medium">任务标题</label>
                  <Input
                    id="task-title"
                    placeholder="下一步，你想做什么？"
                    maxLength={200}
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value)
                      setError('')
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'task-error' : undefined}
                  />
                  {error && <p id="task-error" role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
                  <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>取消</Button>
                    <Button type="submit">{mode === 'edit' ? '保存修改' : '添加任务'}</Button>
                  </div>
                </form>
              )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
