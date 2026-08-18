import type { ComponentProps } from 'react'
import { Button } from '#client/components/button'
import { Input } from '#client/components/input'
import { Textarea } from '#core/components/textarea'
import { mcn } from '#lib'
import {
	type InputGroupAddonAlign,
	type InputGroupButtonSize,
	inputGroupAddonVariants,
	inputGroupButtonVariants,
} from './input-group-variants'

type InputGroupProps = ComponentProps<'div'>

function InputGroup({ className, ...restProps }: InputGroupProps) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: Input groups combine a control with supplementary content
		<div
			className={mcn(
				'group/input-group relative flex h-8 w-full min-w-0 items-center',
				'rounded-nui-lg border border-nui-input outline-none transition-colors',
				'in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0',
				'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-start]]:h-auto has-[>textarea]:h-auto',
				'has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col',
				'has-[[data-slot=input-group-control]:focus-visible]:border-nui-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-nui-ring/50',
				'has-[[data-slot][aria-invalid=true]]:border-nui-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-nui-destructive/20',
				'has-disabled:bg-nui-input/50 has-disabled:opacity-50',
				'dark:bg-nui-input/30 dark:has-disabled:bg-nui-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-nui-destructive/40',
				'has-[>[data-align=inline-start]]:[&>input]:ps-1.5 has-[>[data-align=inline-end]]:[&>input]:pe-1.5 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3',
				className,
			)}
			data-slot={'input-group'}
			role={'group'}
			{...restProps}
		/>
	)
}

type InputGroupAddonProps = ComponentProps<'div'> & {
	align?: InputGroupAddonAlign
}

function InputGroupAddon({
	className,
	align = 'inline-start',
	...restProps
}: InputGroupAddonProps) {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: The click only forwards focus to the grouped input
		// biome-ignore lint/a11y/useSemanticElements: The addon groups arbitrary content and nested buttons
		<div
			className={mcn(inputGroupAddonVariants({ align }), className)}
			data-align={align}
			data-slot={'input-group-addon'}
			onClick={(event) => {
				if ((event.target as HTMLElement).closest('button')) {
					return
				}

				event.currentTarget.parentElement?.querySelector('input')?.focus()
			}}
			role={'group'}
			{...restProps}
		/>
	)
}

type InputGroupButtonProps = Omit<
	ComponentProps<typeof Button>,
	'size' | 'type'
> & {
	size?: InputGroupButtonSize
	type?: 'button' | 'submit' | 'reset'
}

function InputGroupButton({
	className,
	type = 'button',
	variant = 'ghost',
	size = 'xs',
	...restProps
}: InputGroupButtonProps) {
	return (
		<Button
			className={mcn(inputGroupButtonVariants({ size }), className)}
			data-size={size}
			type={type}
			variant={variant}
			{...restProps}
		/>
	)
}

type InputGroupTextProps = ComponentProps<'span'>

function InputGroupText({ className, ...restProps }: InputGroupTextProps) {
	return (
		<span
			className={mcn(
				'flex items-center gap-2 text-nui-muted-foreground text-sm',
				"[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
				className,
			)}
			{...restProps}
		/>
	)
}

type InputGroupInputProps = ComponentProps<'input'>

function InputGroupInput({ className, ...restProps }: InputGroupInputProps) {
	return (
		<Input
			className={mcn(
				'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0',
				'focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0',
				'dark:bg-transparent dark:disabled:bg-transparent',
				className,
			)}
			data-slot={'input-group-control'}
			{...restProps}
		/>
	)
}

type InputGroupTextareaProps = ComponentProps<'textarea'>

function InputGroupTextarea({
	className,
	...restProps
}: InputGroupTextareaProps) {
	return (
		<Textarea
			className={mcn(
				'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0',
				'focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0',
				'dark:bg-transparent dark:disabled:bg-transparent',
				className,
			)}
			data-slot={'input-group-control'}
			{...restProps}
		/>
	)
}

export {
	InputGroup,
	InputGroupAddon,
	type InputGroupAddonProps,
	InputGroupButton,
	type InputGroupButtonProps,
	InputGroupInput,
	type InputGroupInputProps,
	type InputGroupProps,
	InputGroupText,
	InputGroupTextarea,
	type InputGroupTextareaProps,
	type InputGroupTextProps,
}
