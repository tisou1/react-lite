import type { ComponentProps } from 'react'
import { Tabs as Primitive } from 'radix-ui'
import { cn } from '~/lib/utils'

export const Tabs = Primitive.Root
export function TabsList({ className, ...props }: ComponentProps<typeof Primitive.List>) {
  return <Primitive.List className={cn('inline-flex max-w-full gap-1 rounded-lg bg-muted p-1', className)} {...props} />
}
export function TabsTrigger({ className, ...props }: ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Trigger className={cn('rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)} {...props} />
}
export function TabsContent({ className, ...props }: ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Content className={cn('mt-5 outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} />
}
