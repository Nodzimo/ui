import { Select as SelectPrimitive } from '@base-ui/react/select'
import type { ComponentProps } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '#core/icons'
import { mcn } from '#lib'

type SelectScrollUpButtonProps = ComponentProps<
	typeof SelectPrimitive.ScrollUpArrow
>

function SelectScrollUpButton({
	className,
	...restProps
}: SelectScrollUpButtonProps) {
	return (
		<SelectPrimitive.ScrollUpArrow
			className={mcn(
				'top-0 z-10 flex w-full items-center justify-center',
				'cursor-default bg-nui-popover py-1',
				"[&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			data-slot={'select-scroll-up-button'}
			{...restProps}
		>
			<ChevronUpIcon />
		</SelectPrimitive.ScrollUpArrow>
	)
}

type SelectScrollDownButtonProps = ComponentProps<
	typeof SelectPrimitive.ScrollDownArrow
>

function SelectScrollDownButton({
	className,
	...restProps
}: SelectScrollDownButtonProps) {
	return (
		<SelectPrimitive.ScrollDownArrow
			className={mcn(
				'bottom-0 z-10 flex w-full items-center justify-center',
				'cursor-default bg-nui-popover py-1',
				"[&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			data-slot={'select-scroll-down-button'}
			{...restProps}
		>
			<ChevronDownIcon />
		</SelectPrimitive.ScrollDownArrow>
	)
}

type SelectContentSide = NonNullable<SelectPrimitive.Positioner.Props['side']>

const SELECT_CONTENT_SIDES = Object.freeze([
	'top',
	'bottom',
	'left',
	'right',
	'inline-end',
	'inline-start',
] as const satisfies readonly SelectContentSide[])

type SelectContentAlign = NonNullable<SelectPrimitive.Positioner.Props['align']>

const SELECT_CONTENT_ALIGNS = Object.freeze([
	'start',
	'center',
	'end',
] as const satisfies readonly SelectContentAlign[])

type SelectContentProps = SelectPrimitive.Popup.Props &
	Pick<
		SelectPrimitive.Positioner.Props,
		'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
	>

function SelectContent({
	className,
	children,
	side = 'bottom',
	sideOffset = 4,
	align = 'center',
	alignOffset = 0,
	alignItemWithTrigger = true,
	...restProps
}: SelectContentProps) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				align={align}
				alignItemWithTrigger={alignItemWithTrigger}
				alignOffset={alignOffset}
				className={'isolate z-50'}
				side={side}
				sideOffset={sideOffset}
			>
				<SelectPrimitive.Popup
					className={mcn(
						'relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36',
						'origin-(--transform-origin) overflow-y-auto overflow-x-hidden',
						'rounded-nui-lg bg-nui-popover text-nui-popover-foreground shadow-md ring-1 ring-nui-foreground/10 duration-100',
						'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
						'data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2',
						'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
						'data-open:fade-in-0 data-open:zoom-in-95 data-open:animate-in',
						'data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:animate-out',
						'data-[align-trigger=true]:animate-none',
						className,
					)}
					data-align-trigger={alignItemWithTrigger}
					data-slot={'select-content'}
					{...restProps}
				>
					<SelectScrollUpButton />
					<SelectPrimitive.List>{children}</SelectPrimitive.List>
					<SelectScrollDownButton />
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	)
}

export {
	SELECT_CONTENT_ALIGNS,
	SELECT_CONTENT_SIDES,
	SelectContent,
	type SelectContentAlign,
	type SelectContentProps,
	type SelectContentSide,
}
