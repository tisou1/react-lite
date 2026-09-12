import { ArrowLeft, Check } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

export default function Hello() {
  const { name } = useParams()
  return (
    <div className="page-shell py-16 sm:py-24">
      <Card className="mx-auto max-w-xl text-center">
        <CardContent className="p-6 sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent text-primary"><Check /></span>
          <p className="eyebrow mt-6">HELLO, REACT</p>
          <h1 className="mt-4 text-3xl leading-tight font-semibold break-words">
            你好，
            {name}
            。
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">你已经打开了一个动态页面。地址中的名字，就是这里显示的内容。</p>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/">
              <ArrowLeft />
              返回首页
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
