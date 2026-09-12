import { ArrowUpRight, Blocks } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './theme-toggle'
import { Button } from './ui/button'

const links = [{ to: '/', label: '首页' }, { to: '/ui', label: '组件' }, { to: '/tasks', label: '任务示例' }]

export default function SiteHeader() {
  return (
    <header className="border-b bg-card/90">
      <div className="page-shell flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
        <Link to="/" aria-label="React Lite 首页" className="flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Blocks className="size-4" /></span>
          React Lite
          <span className="ml-1 hidden font-mono text-[10px] font-normal tracking-normal text-muted-foreground sm:inline">STARTER</span>
        </Link>
        <nav aria-label="主导航" className="order-3 flex w-full gap-1 sm:order-none sm:w-auto">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/tisou1/react-lite" target="_blank" rel="noreferrer" aria-label="GitHub 仓库（新窗口）">
              GitHub
              <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
