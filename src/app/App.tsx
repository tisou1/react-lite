import { Suspense, useEffect } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import ErrorBoundary from '~/components/error-boundary'
import SiteFooter from '~/components/site-footer'
import SiteHeader from '~/components/site-header'
import { Skeleton } from '~/components/ui/skeleton'

function RouteContent() {
  return useRoutes(routes)
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    const name = pathname === '/' ? '首页' : pathname === '/ui' ? '组件' : pathname === '/tasks' ? '任务示例' : pathname.startsWith('/hello/') ? '路由示例' : '页面未找到'
    document.title = `${name} · React Lite`
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-card p-3 focus:not-sr-only focus:absolute focus:top-2 focus:left-2">跳转到内容</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={(
            <div role="status" className="page-shell space-y-5 py-16">
              <p className="text-sm text-muted-foreground">正在加载页面…</p>
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}
          >
            <RouteContent />
          </Suspense>
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  )
}
