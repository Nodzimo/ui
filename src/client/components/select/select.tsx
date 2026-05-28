import { Select as SelectPrimitive } from '@base-ui/react/select'
import type { ComponentProps } from 'react'
import { mcn } from '#lib'

const Select = SelectPrimitive.Root

type SelectProps = ComponentProps<typeof Select>

type SelectGroupProps = SelectPrimitive.Group.Props

function SelectGroup({ className, ...props }: SelectGroupProps) {
	return (
		<SelectPrimitive.Group
			className={mcn('scroll-my-1 p-1', className)}
			data-slot={'select-group'}
			{...props}
		/>
	)
}

type SelectValueProps = SelectPrimitive.Value.Props

function SelectValue({ className, ...props }: SelectValueProps) {
	return (
		<SelectPrimitive.Value
			className={mcn('flex flex-1 text-start', className)}
			data-slot={'select-value'}
			{...props}
		/>
	)
}

type SelectLabelProps = SelectPrimitive.GroupLabel.Props

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

type SelectSeparatorProps = SelectPrimitive.Separator.Props

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

export {
	Select,
	SelectGroup,
	type SelectGroupProps,
	SelectLabel,
	type SelectLabelProps,
	type SelectProps,
	SelectSeparator,
	type SelectSeparatorProps,
	SelectValue,
	type SelectValueProps,
}
