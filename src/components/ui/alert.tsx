import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Alert({ className, ...props }: ComponentProps<'div'>) {
  return <div role="status" className={cn('rounded-lg border border-primary/20 bg-accent p-4 text-sm leading-6 text-accent-foreground', className)} {...props} />
}
