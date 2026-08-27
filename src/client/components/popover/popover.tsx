import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import type { ComponentProps } from 'react'
import { mcn } from '#lib'

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
	return <PopoverPrimitive.Root data-slot={'popover'} {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
	return <PopoverPrimitive.Trigger data-slot={'popover-trigger'} {...props} />
}

function PopoverContent({
	className,
	align = 'center',
	alignOffset = 0,
	side = 'bottom',
	sideOffset = 4,
	...restProps
}: PopoverPrimitive.Popup.Props &
	Pick<
		PopoverPrimitive.Positioner.Props,
		'align' | 'alignOffset' | 'side' | 'sideOffset'
	>) {
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
						'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-nui-lg bg-nui-popover p-2.5 text-nui-popover-foreground text-sm shadow-md outline-hidden ring-1 ring-nui-foreground/10 duration-100 data-closed:animate-out data-open:animate-in',
						className,
					)}
					data-slot={'popover-content'}
					{...restProps}
				/>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	)
}

function PopoverHeader({ className, ...restProps }: ComponentProps<'div'>) {
	return (
		<div
			className={mcn('flex flex-col gap-0.5 text-sm', className)}
			data-slot={'popover-header'}
			{...restProps}
		/>
	)
}

function PopoverTitle({
	className,
	...restProps
}: PopoverPrimitive.Title.Props) {
	return (
		<PopoverPrimitive.Title
			className={mcn('font-medium', className)}
			data-slot={'popover-title'}
			{...restProps}
		/>
	)
}

function PopoverDescription({
	className,
	...restProps
}: PopoverPrimitive.Description.Props) {
	return (
		<PopoverPrimitive.Description
			className={mcn('text-nui-muted-foreground', className)}
			data-slot={'popover-description'}
			{...restProps}
		/>
	)
}

export {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
}
