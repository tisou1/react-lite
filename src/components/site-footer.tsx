import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-muted-foreground">
        <p>
          <span className="font-heading font-medium text-foreground">React Lite</span>
          <span className="mx-2">/</span>
          从一个小想法开始。
        </p>
        <div className="flex gap-5">
          <Link to="/ui" className="hover:text-foreground">探索组件</Link>
          <Link to="/tasks" className="hover:text-foreground">体验示例</Link>
        </div>
      </div>
    </footer>
  )
}
