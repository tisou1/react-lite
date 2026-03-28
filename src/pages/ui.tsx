import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'

export default function UIPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center px-6 py-12">
      <Card className="w-full border border-black/10 bg-white/70 shadow-xl shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-black/20">
        <CardHeader className="items-center text-center">
          <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            shadcn/ui
          </span>
          <CardTitle className="mt-3 text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl">
            组件系统已经接入
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            这个脚手架已经包含 shadcn/ui 配置、生成后的组件源码，以及保持样式一致所需的公共工具函数。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              输入框示例
            </p>
            <Input placeholder="搜索、创建，或者把它接到你的表单里" className="h-11 rounded-xl bg-white/80 dark:bg-black/20" />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              操作按钮示例
            </p>
            <div className="flex flex-wrap gap-3">
              <Button>主按钮</Button>
              <Button variant="outline">次按钮</Button>
              <Button variant="ghost" asChild>
                <Link to="/">
                  返回首页
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center bg-transparent text-sm text-neutral-500 dark:text-neutral-400">
          访问
          {' '}
          <code>/ui</code>
          {' '}
          可以继续在这个脚手架里扩展更多 shadcn 组件。
        </CardFooter>
      </Card>
    </div>
  )
}
