import type { ComponentProps } from 'react'
import { X } from 'lucide-react'
import { Dialog as Primitive } from 'radix-ui'
import { cn } from '~/lib/utils'

export const Dialog = Primitive.Root
export const DialogTrigger = Primitive.Trigger
export const DialogClose = Primitive.Close
export function DialogTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={cn('text-lg font-semibold', className)} {...props} />
}
export function DialogDescription({ className, ...props }: ComponentProps<typeof Primitive.Description>) {
  return <Primitive.Description className={cn('mt-2 text-sm leading-6 text-muted-foreground', className)} {...props} />
}
export function DialogContent({ className, children, ...props }: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 z-40 bg-slate-950/50" />
      <Primitive.Content className={cn('fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-card p-6 shadow-xl outline-none', className)} {...props}>
        <div className="pr-6">{children}</div>
        <Primitive.Close className="absolute top-3 right-3 rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="关闭弹窗"><X className="size-4" /></Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  )
}
