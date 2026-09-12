import { ArrowLeft, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '~/components/ui/button'

export default function NotFound() {
  return (
    <div className="page-shell py-24 text-center">
      <SearchX className="mx-auto size-10 text-muted-foreground" />
      <p className="eyebrow mt-6">404</p>
      <h1 className="page-heading mt-3">这个页面还不存在</h1>
      <p className="mt-4 text-muted-foreground">请检查链接，或回到首页继续探索。</p>
      <Button asChild className="mt-8">
        <Link to="/">
          <ArrowLeft />
          返回首页
        </Link>
      </Button>
    </div>
  )
}
