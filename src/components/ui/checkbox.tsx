import type { ComponentProps } from 'react'
import { Check } from 'lucide-react'
import { Checkbox as Primitive } from 'radix-ui'
import { cn } from '~/lib/utils'

export function Checkbox({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root className={cn('flex size-5 shrink-0 items-center justify-center rounded border border-input bg-card outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground', className)} {...props}>
      <Primitive.Indicator><Check className="size-3.5" /></Primitive.Indicator>
    </Primitive.Root>
  )
}
