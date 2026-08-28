import type { ComponentProps } from 'react'
import { mcn } from '#lib'

type KbdProps = ComponentProps<'kbd'>

function Kbd({ className, ...restProps }: KbdProps) {
	return (
		<kbd
			className={mcn(
				'pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center',
				'gap-1 px-1',
				'select-none font-medium font-sans text-nui-muted-foreground text-xs',
				'rounded-nui-sm bg-nui-muted',
				'in-data-[slot=tooltip-content]:bg-nui-background/20 in-data-[slot=tooltip-content]:text-nui-background',
				'dark:in-data-[slot=tooltip-content]:bg-nui-background/10',
				"[&_svg:not([class*='size-'])]:size-3",
				className,
			)}
			data-slot={'kbd'}
			{...restProps}
		/>
	)
}

type KbdGroupProps = ComponentProps<'kbd'>

function KbdGroup({ className, ...restProps }: KbdGroupProps) {
	return (
		<kbd
			className={mcn('inline-flex items-center gap-1', className)}
			data-slot={'kbd-group'}
			{...restProps}
		/>
	)
}

export { Kbd, KbdGroup, type KbdGroupProps, type KbdProps }
