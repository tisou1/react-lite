import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Hello() {
  const params = useParams()
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
        欢迎你
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black dark:text-white">
        {params.name}
      </h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        这个页面来自
        <code>src/pages/hello/[name].tsx</code>
        ，用来演示基于文件系统的动态路由。
      </p>
      <button className="btn mt-8" onClick={() => navigate(-1)}>
        返回上一页
      </button>
    </div>
  )
}
