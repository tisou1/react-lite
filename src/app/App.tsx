import React, { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import SiteFooter from '~/components/site-footer'

export default function App() {
  return (
    <div className="relative isolate min-h-screen">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-black/[0.04] to-transparent dark:from-white/[0.06]" />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4">
        <div className="flex-1">
          <Suspense fallback={null}>
            {useRoutes(routes)}
          </Suspense>
        </div>
        <SiteFooter />
      </main>
    </div>
  )
}
