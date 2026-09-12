import { ArrowRight, Check, Layers3, RotateCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function UIPage() {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [subscribe, setSubscribe] = useState(false)
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading)
      return
    const timer = window.setTimeout(setLoading, 1200, false)
    return () => window.clearTimeout(timer)
  }, [loading])

  return (
    <div className="page-shell py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">THE BUILDING BLOCKS</p>
          <h1 className="page-heading mt-3">小组件，大可能。</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">从一个按钮到一次完整交互。这里的组件可以直接操作，也可以带到你的下一个页面。</p>
        </div>
        <Badge>
          <Layers3 className="size-3.5" />
          shadcn/ui + Radix
        </Badge>
      </div>

      <section className="mt-10" aria-labelledby="basic-title">
        <div className="mb-5 flex items-center gap-3">
          <h2 id="basic-title" className="text-lg font-semibold">基础控件</h2>
          <span className="text-xs text-muted-foreground">按钮 / 标签 / 卡片</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>每个动作，都有合适的表达</CardTitle>
              <CardDescription>主操作突出，次要操作保持克制。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setMessage('主操作已触发')}>
                  主按钮
                  <ArrowRight />
                </Button>
                <Button variant="outline" onClick={() => setMessage('次要操作已触发')}>次按钮</Button>
                <Button variant="ghost" onClick={() => setMessage('轻量操作已触发')}>轻量按钮</Button>
                <Button disabled>不可用</Button>
              </div>
              <p role="status" className="mt-3 min-h-6 text-xs text-muted-foreground">{message || '点击按钮，查看交互反馈。'}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t pt-5">
                <Badge>
                  <Check className="size-3" />
                  已就绪
                </Badge>
                <Badge className="bg-muted text-muted-foreground">草稿</Badge>
                <Badge className="bg-primary text-primary-foreground">新功能</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader>
              <CardTitle>把组件组合成一个入口</CardTitle>
              <CardDescription>标题、描述与操作，保持清晰的阅读顺序。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-background p-5">
                <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-accent text-primary"><Layers3 className="size-4" /></div>
                <h3 className="font-semibold">你的下一个小项目</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">从一份清单开始，让每一步都有着落。</p>
                <Button asChild variant="link" className="mt-3 h-auto px-0">
                  <Link to="/tasks">
                    打开任务示例
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-9" aria-labelledby="form-title">
        <div className="mb-5 flex items-center gap-3">
          <h2 id="form-title" className="text-lg font-semibold">表单输入</h2>
          <span className="text-xs text-muted-foreground">输入 / 勾选 / 校验</span>
        </div>
        <Card className="p-2">
          <CardContent className="grid gap-8 py-4 md:grid-cols-[1fr_1.1fr]">
            <div>
              <h3 className="text-base font-semibold">每一次输入，都有回应</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">试试留空保存，或填写昵称并切换订阅选项。这里只演示表单交互，不会发送任何信息。</p>
              <div className="mt-5"><Badge>本页演示 · 不保存数据</Badge></div>
            </div>
            <form onSubmit={(event) => {
              event.preventDefault()
              if (!name.trim()) {
                setFormError('请填写昵称。')
                setSaved('')
                return
              };
              setFormError('')
              setSaved(`已保存演示设置：${name.trim()}，${subscribe ? '订阅更新' : '不订阅更新'}。`)
            }}
            >
              <label htmlFor="demo-name" className="mb-2 block text-sm font-medium">昵称</label>
              <Input
                id="demo-name"
                placeholder="我们该怎么称呼你？"
                value={name}
                maxLength={80}
                onChange={(event) => {
                  setName(event.target.value)
                  setFormError('')
                  setSaved('')
                }}
                aria-invalid={!!formError}
                aria-describedby={formError ? 'demo-name-error' : undefined}
              />
              {formError && <p id="demo-name-error" role="alert" className="mt-2 text-sm text-destructive">{formError}</p>}
              <div className="mt-4 flex items-center gap-2.5">
                <Checkbox
                  id="subscribe"
                  checked={subscribe}
                  onCheckedChange={(value) => {
                    setSubscribe(value === true)
                    setSaved('')
                  }}
                />
                <label htmlFor="subscribe" className="text-sm">订阅产品更新</label>
              </div>
              <Button type="submit" className="mt-5">保存演示设置</Button>
              <p role="status" className="mt-3 min-h-5 text-xs leading-6 text-muted-foreground">{saved}</p>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="mt-9" aria-labelledby="feedback-title">
        <div className="mb-5 flex items-center gap-3">
          <h2 id="feedback-title" className="text-lg font-semibold">交互反馈</h2>
          <span className="text-xs text-muted-foreground">标签页 / 弹窗 / 状态</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>按需展开更多内容</CardTitle>
              <CardDescription>用方向键切换标签，用 Esc 关闭弹窗。</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList aria-label="组件演示">
                  <TabsTrigger value="preview">预览</TabsTrigger>
                  <TabsTrigger value="details">使用说明</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <p className="mb-4 text-sm leading-7 text-muted-foreground">需要用户专注完成一个操作时，可以打开弹窗。</p>
                  <Dialog>
                    <DialogTrigger asChild><Button variant="outline">打开演示弹窗</Button></DialogTrigger>
                    <DialogContent>
                      <DialogTitle>为下一步留一点空间</DialogTitle>
                      <DialogDescription>弹窗打开后，焦点留在这里。按 Tab 在操作间切换，关闭后回到原来的按钮。</DialogDescription>
                      <div className="mt-6 flex justify-end"><DialogClose asChild><Button>我知道了</Button></DialogClose></div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
                <TabsContent value="details"><p className="text-sm leading-7 text-muted-foreground">标签页与弹窗基于 Radix，封装在共享组件目录中。可通过 props 和 className 调整内容与样式。</p></TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader>
              <CardTitle>等待时，也知道发生了什么</CardTitle>
              <CardDescription>明确的提示与加载占位，减少猜测。</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <span className="flex items-center gap-2">
                  <Check className="size-4 shrink-0" />
                  组件已就绪，可以开始组合你的页面。
                </span>
              </Alert>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">内容加载演示</span>
                <Button size="sm" variant="ghost" disabled={loading} onClick={() => setLoading(true)}>
                  <RotateCw className="size-3.5" />
                  重新加载
                </Button>
              </div>
              <div role="status" aria-live="polite" aria-busy={loading} className="mt-3 min-h-20 rounded-lg border p-4">
                {loading
                  ? (
                      <>
                        <span className="sr-only">正在加载演示内容</span>
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="mt-3 h-3 w-full" />
                      </>
                    )
                  : (
                      <>
                        <p className="text-sm font-medium">内容已加载</p>
                        <p className="mt-2 text-xs text-muted-foreground">点击重新加载，体验短暂的骨架屏。</p>
                      </>
                    )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
