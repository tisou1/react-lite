import { ArrowRight, Check, CheckCheck, Code2, Copy, Layers3, Route, Terminal } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'

const features = [
  { icon: Route, title: '页面，即路由', detail: '从一个页面开始，逐步扩展你的应用。', label: '文件路由 · 动态参数' },
  { icon: Layers3, title: '组件，随手组合', detail: '统一样式与交互，把时间留给你的想法。', label: 'shadcn/ui · Radix' },
  { icon: CheckCheck, title: '示例，可以直接用', detail: '从新增到保存，体验一个完整的小功能。', label: '任务列表 · 本地存储' },
]
const commands = 'pnpm install\npnpm dev'

export default function Index() {
  const [value, setValue] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const navigate = useNavigate()
  const name = value.trim()

  async function copyCommands() {
    try {
      await navigator.clipboard.writeText(commands)
      setCopyStatus('已复制启动命令')
    }
    catch {
      setCopyStatus('复制失败，请选中下方命令手动复制')
    }
  }

  return (
    <div className="page-shell pb-14">
      <section className="grid items-center gap-12 pt-14 pb-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-20">
        <div>
          <Badge>
            <span className="size-1.5 rounded-full bg-primary" />
            轻量起步，自由生长
          </Badge>
          <h1 className="mt-6 text-4xl leading-[1.25] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
            让想法，
            <br />
            更快成为
            <span className="text-primary">界面。</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">一个刚刚好的 React 起手模板。路由、组件与深色模式已就绪，从这里开始，构建属于你的下一件作品。</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/tasks">
                体验任务示例
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"><Link to="/ui">探索组件</Link></Button>
          </div>
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            React 19
            <span className="mx-3 text-border">/</span>
            TypeScript
            <span className="mx-3 text-border">/</span>
            Vite
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border bg-card shadow-lg shadow-slate-950/[0.03]">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <span className="flex items-center gap-2 text-xs font-medium">
              <Code2 className="size-4 text-muted-foreground" />
              路由实验室
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">LIVE DEMO</span>
          </div>
          <div className="demo-grid p-5 sm:p-8">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (name)
                  navigate(`/hello/${encodeURIComponent(name)}`)
              }}
              className="rounded-xl border bg-card p-6 shadow-sm sm:p-7"
            >
              <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-accent text-primary"><Route className="size-5" /></div>
              <h2 className="text-xl font-semibold">先打个招呼？</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">输入名字，看看你的第一个动态页面。</p>
              <label htmlFor="name" className="mt-6 mb-2 block text-sm font-medium">你的名字</label>
              <Input id="name" value={value} onChange={event => setValue(event.target.value)} placeholder="例如：小林" autoComplete="given-name" maxLength={80} />
              <Button type="submit" className="mt-4 w-full" disabled={!name}>
                打开我的页面
                <ArrowRight />
              </Button>
            </form>
          </div>
          <div className="flex items-start gap-3 border-t bg-muted/40 px-5 py-3.5 font-mono text-xs">
            <span className="shrink-0 text-muted-foreground">路径预览</span>
            <span className="min-w-0 break-all text-primary">
              /hello/
              {name ? encodeURIComponent(name) : ':name'}
            </span>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-title" className="border-t pt-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h2 id="features-title" className="text-lg font-semibold">起步需要的，都在这里</h2>
          <span className="text-xs text-muted-foreground">保持简单，也留有余地。</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, detail, label }) => (
            <Card key={title} className="shadow-none ring-border">
              <CardContent className="p-5 pt-2">
                <Icon className="mb-5 size-5 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
                <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 rounded-xl border bg-card p-6 sm:grid-cols-2 sm:items-center sm:p-8" aria-labelledby="start-title">
        <div>
          <p className="eyebrow">READY WHEN YOU ARE</p>
          <h2 id="start-title" className="mt-3 text-xl font-semibold">两行命令，开始构建。</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">在项目目录安装依赖，然后启动开发服务。</p>
        </div>
        <div className="min-w-0">
          <div className="rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <Terminal className="size-3.5" />
                Terminal
              </span>
              <Button variant="ghost" size="sm" onClick={copyCommands} aria-label="复制启动命令">
                {copyStatus.startsWith('已') ? <Check /> : <Copy />}
                复制
              </Button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-7"><code>{commands}</code></pre>
          </div>
          <p role="status" className="mt-2 min-h-4 text-xs text-muted-foreground">{copyStatus}</p>
        </div>
      </section>
    </div>
  )
}
