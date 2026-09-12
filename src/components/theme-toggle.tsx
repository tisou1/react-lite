import { MoonStar, SunMedium } from 'lucide-react'
import useDark from '~/hooks/useDark'
import { Button } from './ui/button'

export default function ThemeToggle() {
  const { isDark, toggleDark } = useDark()
  return (
    <Button type="button" variant="ghost" size="icon" aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'} aria-pressed={isDark} onClick={toggleDark}>
      {isDark ? <MoonStar className="size-4" /> : <SunMedium className="size-4" />}
    </Button>
  )
}
