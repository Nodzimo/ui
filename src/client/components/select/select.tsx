import { Select as SelectPrimitive } from '@base-ui/react/select'
import type { ComponentProps } from 'react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '#core/icons'
import { mcn } from '#lib'

const Select = SelectPrimitive.Root

export type SelectProps = ComponentProps<typeof Select>

export type SelectGroupProps = SelectPrimitive.Group.Props

function SelectGroup({ className, ...props }: SelectGroupProps) {
	return (
		<SelectPrimitive.Group
			className={mcn('scroll-my-1 p-1', className)}
			data-slot={'select-group'}
			{...props}
		/>
	)
}

export type SelectValueProps = SelectPrimitive.Value.Props

function SelectValue({ className, ...props }: SelectValueProps) {
	return (
		<SelectPrimitive.Value
			className={mcn('flex flex-1 text-start', className)}
			data-slot={'select-value'}
			{...props}
		/>
	)
}

export const SELECT_TRIGGER_SIZES = Object.freeze(['sm', 'default'] as const)

export type SelectTriggerSize = (typeof SELECT_TRIGGER_SIZES)[number]

export type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
	size?: SelectTriggerSize
}

function SelectTrigger({
	className,
	size = 'default',
	children,
	...props
}: SelectTriggerProps) {
	return (
		<SelectPrimitive.Trigger
			className={mcn(
				"flex w-fit select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-nui-lg border border-nui-input bg-transparent py-2 ps-2.5 pe-2 text-sm outline-none transition-colors focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-nui-destructive aria-invalid:ring-3 aria-invalid:ring-nui-destructive/20 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-nui-md),10px)] data-placeholder:text-nui-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-nui-input/30 dark:aria-invalid:border-nui-destructive/50 dark:aria-invalid:ring-nui-destructive/40 dark:hover:bg-nui-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-size={size}
			data-slot={'select-trigger'}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon
				render={
					<ChevronDownIcon
						className={'pointer-events-none size-4 text-nui-muted-foreground'}
					/>
				}
			/>
		</SelectPrimitive.Trigger>
	)
}

export type SelectContentSide = NonNullable<
	SelectPrimitive.Positioner.Props['side']
>

export const SELECT_CONTENT_SIDES = Object.freeze([
	'top',
	'bottom',
	'left',
	'right',
	'inline-end',
	'inline-start',
] as const satisfies readonly SelectContentSide[])

export type SelectContentAlign = NonNullable<
	SelectPrimitive.Positioner.Props['align']
>

export const SELECT_CONTENT_ALIGNS = Object.freeze([
	'start',
	'center',
	'end',
] as const satisfies readonly SelectContentAlign[])

export type SelectContentProps = SelectPrimitive.Popup.Props &
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
	...props
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
						'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-nui-lg bg-nui-popover text-nui-popover-foreground shadow-md ring-1 ring-nui-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-closed:animate-out data-open:animate-in',
						className,
					)}
					data-align-trigger={alignItemWithTrigger}
					data-slot={'select-content'}
					{...props}
				>
					<SelectScrollUpButton />
					<SelectPrimitive.List>{children}</SelectPrimitive.List>
					<SelectScrollDownButton />
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	)
}

export type SelectLabelProps = SelectPrimitive.GroupLabel.Props

function SelectLabel({ className, ...props }: SelectLabelProps) {
	return (
		<SelectPrimitive.GroupLabel
			className={mcn(
				'px-1.5 py-1 text-nui-muted-foreground text-xs',
				className,
			)}
			data-slot={'select-label'}
			{...props}
		/>
	)
}

export type SelectItemProps = SelectPrimitive.Item.Props

function SelectItem({ className, children, ...props }: SelectItemProps) {
	return (
		<SelectPrimitive.Item
			className={mcn(
				"relative flex w-full cursor-default select-none items-center gap-1.5 rounded-nui-md py-1 ps-1.5 pe-8 text-sm outline-hidden focus:bg-nui-accent focus:text-nui-accent-foreground not-data-[variant=destructive]:focus:**:text-nui-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				className,
			)}
			data-slot={'select-item'}
			{...props}
		>
			<SelectPrimitive.ItemText
				className={'flex flex-1 shrink-0 gap-2 whitespace-nowrap'}
			>
				{children}
			</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator
				render={
					<span
						className={
							'pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center'
						}
					>
						<CheckIcon className={'pointer-events-none'} />
					</span>
				}
			/>
		</SelectPrimitive.Item>
	)
}

export type SelectSeparatorProps = SelectPrimitive.Separator.Props

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
	return (
		<SelectPrimitive.Separator
			className={mcn(
				'pointer-events-none -mx-1 my-1 h-px bg-nui-border',
				className,
			)}
			data-slot={'select-separator'}
			{...props}
		/>
	)
}

export type SelectScrollUpButtonProps = ComponentProps<
	typeof SelectPrimitive.ScrollUpArrow
>

function SelectScrollUpButton({
	className,
	...props
}: SelectScrollUpButtonProps) {
	return (
		<SelectPrimitive.ScrollUpArrow
			className={mcn(
				"top-0 z-10 flex w-full cursor-default items-center justify-center bg-nui-popover py-1 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			data-slot={'select-scroll-up-button'}
			{...props}
		>
			<ChevronUpIcon />
		</SelectPrimitive.ScrollUpArrow>
	)
}

export type SelectScrollDownButtonProps = ComponentProps<
	typeof SelectPrimitive.ScrollDownArrow
>

function SelectScrollDownButton({
	className,
	...props
}: SelectScrollDownButtonProps) {
	return (
		<SelectPrimitive.ScrollDownArrow
			className={mcn(
				"bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-nui-popover py-1 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			data-slot={'select-scroll-down-button'}
			{...props}
		>
			<ChevronDownIcon />
		</SelectPrimitive.ScrollDownArrow>
	)
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
}
