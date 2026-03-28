import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Index() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const go = () => {
    if (value)
      navigate(`/hello/${encodeURIComponent(value)}`)
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
        React 轻量脚手架
      </span>
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl">
        一个适合快速起步的 React 项目模板
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        可以直接拿来验证动态路由、深色模式、shadcn/ui 组件，以及中后台、工具站和 MVP 的基础工程配置。
      </p>
      <label htmlFor="name" className="mt-10 text-sm text-neutral-500 dark:text-neutral-400">
        输入你的名字：
      </label>
      <input
        id="name"
        type="text"
        className="mt-3 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-center text-base text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-100 dark:focus:ring-neutral-800"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="例如：Codex"
      />

      <div className="mt-4">
        <button className="btn" onClick={go}>打开示例路由</button>
      </div>
    </div>
  )
}

export default Index
