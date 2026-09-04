import { MoonStar, SunMedium } from 'lucide-react'
import React from 'react'
import { siGithub } from 'simple-icons'
import { useDark } from '../hooks'

export default function SiteFooter() {
  const { isDark, toggleDark } = useDark()

  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-4 py-2 shadow-sm shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <button
          type="button"
          aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          aria-pressed={isDark}
          className="icon-btn rounded-full border border-transparent hover:border-black/10 dark:hover:border-white/10"
          onClick={toggleDark}
        >
          {isDark ? <MoonStar size={18} /> : <SunMedium size={18} />}
        </button>
        <a
          href="https://github.com/tisou1/react-lite"
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub repository"
          className="icon-btn rounded-full border border-transparent hover:border-black/10 dark:hover:border-white/10"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-[18px]"
            fill="currentColor"
          >
            <path d={siGithub.path} />
          </svg>
        </a>
      </div>
    </div>
  )
}
