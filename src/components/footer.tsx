import React from 'react'
import { useDark } from '../hooks'

export default function Footer() {
  const { isDark, toggleDark } = useDark()

  const updateView = (event: React.MouseEvent<HTMLDivElement>) => {
    // 在不支持的浏览器里不做动画
    if (!document.startViewTransition) {
      toggleDark()
      return
    }
    // 开始一次视图过渡：
    const transition = document.startViewTransition(() => toggleDark())
    transition.ready.then(() => {
      const x = event.clientX
      const y = event.clientY
      // 计算按钮到最远点的距离用作裁剪圆形的半径
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )

      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      // 开始动画
      document.documentElement.animate(
        {
          // 这里使用!isDark, 是因为当那个我们这个组件拿到isDark时, isDark的值已经更新了,
          // 所以需要使用!isDark来表示主题改变之前的值,按照之前的值来进行动画
          clipPath: !isDark ? clipPath.reverse() : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: !isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <div className="text-center py-6 flex justify-center">
      <div onClick={updateView}>
        {
          isDark
            ? <span className="i-carbon-moon text-gray-200"></span>
            : <span className="i-carbon-sun"></span>
        }
      </div>
      <a href="https://github.com/tisou1/react-lite" target="_blank">
        <span className="i-carbon-logo-github ml-3"></span>
      </a>
    </div>
  )
}
