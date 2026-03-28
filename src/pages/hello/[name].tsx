import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Hello() {
  const params = useParams()
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
        欢迎:
        {params.name}
      </p>
      <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        This page is generated from
        <code>src/pages/hello/[name].tsx</code>
        .
      </p>
      <button className="btn mt-8" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  )
}
