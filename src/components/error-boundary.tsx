import type { ReactNode } from 'react'
import { Component } from 'react'
import { Button } from './ui/button'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) {
      return (
        <div role="alert" className="page-shell py-24 text-center">
          <h1 className="page-heading">页面暂时无法显示</h1>
          <p className="mt-4 text-muted-foreground">请重新加载页面后再试。</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>重新加载</Button>
        </div>
      )
    }
    return this.props.children
  }
}
