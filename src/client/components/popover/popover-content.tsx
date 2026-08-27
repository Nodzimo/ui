import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { mcn } from '#lib'

type PopoverContentSide = NonNullable<PopoverPrimitive.Positioner.Props['side']>

const POPOVER_CONTENT_SIDES = Object.freeze([
	'top',
	'bottom',
	'left',
	'right',
	'inline-end',
	'inline-start',
] as const satisfies readonly PopoverContentSide[])

type PopoverContentAlign = NonNullable<
	PopoverPrimitive.Positioner.Props['align']
>

const POPOVER_CONTENT_ALIGNS = Object.freeze([
	'start',
	'center',
	'end',
] as const satisfies readonly PopoverContentAlign[])

type PopoverContentProps = PopoverPrimitive.Popup.Props &
	Pick<
		PopoverPrimitive.Positioner.Props,
		'align' | 'alignOffset' | 'side' | 'sideOffset'
	>

function PopoverContent({
	className,
	align = 'center',
	alignOffset = 0,
	side = 'bottom',
	sideOffset = 4,
	...restProps
}: PopoverContentProps) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				className={'isolate z-50'}
				side={side}
				sideOffset={sideOffset}
			>
				<PopoverPrimitive.Popup
					className={mcn(
						'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5',
						'rounded-nui-lg bg-nui-popover p-2.5 text-nui-popover-foreground text-sm shadow-md outline-hidden ring-1 ring-nui-foreground/10',
						'duration-100',
						'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
						'data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:animate-out data-open:animate-in',
						className,
					)}
					data-slot={'popover-content'}
					{...restProps}
				/>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	)
}

export {
	POPOVER_CONTENT_ALIGNS,
	POPOVER_CONTENT_SIDES,
	PopoverContent,
	type PopoverContentAlign,
	type PopoverContentProps,
	type PopoverContentSide,
}
