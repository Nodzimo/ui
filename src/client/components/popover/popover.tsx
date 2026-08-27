import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import type { ComponentProps } from 'react'
import { mcn } from '#lib'

type PopoverProps = PopoverPrimitive.Root.Props

type PopoverModal = NonNullable<PopoverProps['modal']>

const POPOVER_MODAL_MODES = Object.freeze([
	true,
	false,
	'trap-focus',
] as const satisfies readonly PopoverModal[])

function Popover({ ...props }: PopoverProps) {
	return <PopoverPrimitive.Root data-slot={'popover'} {...props} />
}

type PopoverTriggerProps = PopoverPrimitive.Trigger.Props

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
	return <PopoverPrimitive.Trigger data-slot={'popover-trigger'} {...props} />
}

type PopoverHeaderProps = ComponentProps<'div'>

function PopoverHeader({ className, ...restProps }: PopoverHeaderProps) {
	return (
		<div
			className={mcn('flex flex-col gap-0.5 text-sm', className)}
			data-slot={'popover-header'}
			{...restProps}
		/>
	)
}

type PopoverTitleProps = PopoverPrimitive.Title.Props

function PopoverTitle({ className, ...restProps }: PopoverTitleProps) {
	return (
		<PopoverPrimitive.Title
			className={mcn('font-medium', className)}
			data-slot={'popover-title'}
			{...restProps}
		/>
	)
}

type PopoverDescriptionProps = PopoverPrimitive.Description.Props

function PopoverDescription({
	className,
	...restProps
}: PopoverDescriptionProps) {
	return (
		<PopoverPrimitive.Description
			className={mcn('text-nui-muted-foreground', className)}
			data-slot={'popover-description'}
			{...restProps}
		/>
	)
}

export {
	POPOVER_MODAL_MODES,
	Popover,
	PopoverDescription,
	type PopoverDescriptionProps,
	PopoverHeader,
	type PopoverHeaderProps,
	type PopoverModal,
	type PopoverProps,
	PopoverTitle,
	type PopoverTitleProps,
	PopoverTrigger,
	type PopoverTriggerProps,
}
