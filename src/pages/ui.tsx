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
            Component system ready
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            This scaffold now includes shadcn/ui configuration, generated source components, and the shared
            utility helpers needed to keep new UI work consistent.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Example input
            </p>
            <Input placeholder="Search, create, or wire this into a form" className="h-11 rounded-xl bg-white/80 dark:bg-black/20" />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Example actions
            </p>
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="outline">Secondary action</Button>
              <Button variant="ghost" asChild>
                <Link to="/">
                  Back home
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center bg-transparent text-sm text-neutral-500 dark:text-neutral-400">
          Visit
          {' '}
          <code>/ui</code>
          {' '}
          to extend this starter with more shadcn components.
        </CardFooter>
      </Card>
    </div>
  )
}
