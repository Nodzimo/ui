import type { ComponentProps } from 'react'
import { mcn } from '#lib'

function Kbd({ className, ...restProps }: ComponentProps<'kbd'>) {
	return (
		<kbd
			className={mcn(
				"pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted in-data-[slot=tooltip-content]:bg-background/20 px-1 font-medium font-sans in-data-[slot=tooltip-content]:text-background text-muted-foreground text-xs dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
				className,
			)}
			data-slot={'kbd'}
			{...restProps}
		/>
	)
}

function KbdGroup({ className, ...restProps }: ComponentProps<'kbd'>) {
	return (
		<kbd
			className={mcn('inline-flex items-center gap-1', className)}
			data-slot={'kbd-group'}
			{...restProps}
		/>
	)
}

export { Kbd, KbdGroup }
