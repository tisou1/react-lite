import React from 'react'

export default function Index() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        This fallback route is wired through vite-plugin-pages, so you can start adding real pages right away.
      </p>
    </div>
  )
}
