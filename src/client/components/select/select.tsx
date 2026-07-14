import { Select as SelectPrimitive } from '@base-ui/react/select'
import type { ComponentProps, ReactNode } from 'react'
import { mcn } from '#lib'

type SelectOption<Value> = Readonly<{
	value: Value
	label: ReactNode
}>

type SelectOptions<Value> = readonly SelectOption<Value>[]

const Select = SelectPrimitive.Root

type SelectProps = ComponentProps<typeof Select>

type SelectGroupProps = SelectPrimitive.Group.Props

function SelectGroup({ className, ...restProps }: SelectGroupProps) {
	return (
		<SelectPrimitive.Group
			className={mcn('scroll-my-1 p-1', className)}
			data-slot={'select-group'}
			{...restProps}
		/>
	)
}

type SelectValueProps = SelectPrimitive.Value.Props

function SelectValue({ className, ...restProps }: SelectValueProps) {
	return (
		<SelectPrimitive.Value
			className={mcn('flex flex-1 text-start', className)}
			data-slot={'select-value'}
			{...restProps}
		/>
	)
}

type SelectLabelProps = SelectPrimitive.GroupLabel.Props

function SelectLabel({ className, ...restProps }: SelectLabelProps) {
	return (
		<SelectPrimitive.GroupLabel
			className={mcn(
				'px-1.5 py-1 text-nui-muted-foreground text-xs',
				className,
			)}
			data-slot={'select-label'}
			{...restProps}
		/>
	)
}

type SelectSeparatorProps = SelectPrimitive.Separator.Props

function SelectSeparator({ className, ...restProps }: SelectSeparatorProps) {
	return (
		<SelectPrimitive.Separator
			className={mcn(
				'pointer-events-none -mx-1 my-1 h-px bg-nui-border',
				className,
			)}
			data-slot={'select-separator'}
			{...restProps}
		/>
	)
}

export {
	Select,
	SelectGroup,
	type SelectGroupProps,
	SelectLabel,
	type SelectLabelProps,
	type SelectOption,
	type SelectOptions,
	type SelectProps,
	SelectSeparator,
	type SelectSeparatorProps,
	SelectValue,
	type SelectValueProps,
}
