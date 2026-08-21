import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { Separator, type SeparatorProps } from '#client/components/separator'
import { mcn } from '#lib'

const BUTTON_GROUP_ORIENTATION_CLASSES = {
	horizontal: [
		'*:data-slot:rounded-e-none',
		'[&>[data-slot]:not(:has(~[data-slot]))]:rounded-e-nui-lg!',
		'[&>[data-slot]~[data-slot]]:rounded-s-none',
		'[&>[data-slot]~[data-slot]]:border-s-0',
	],
	vertical: [
		'flex-col',
		'*:data-slot:rounded-b-none',
		'[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-nui-lg!',
		'[&>[data-slot]~[data-slot]]:rounded-t-none',
		'[&>[data-slot]~[data-slot]]:border-t-0',
	],
} as const

type ButtonGroupOrientation = keyof typeof BUTTON_GROUP_ORIENTATION_CLASSES

const BUTTON_GROUP_ORIENTATIONS = Object.freeze(
	Object.keys(BUTTON_GROUP_ORIENTATION_CLASSES) as ButtonGroupOrientation[],
)

const buttonGroupVariants = cva(
	[
		'flex w-fit items-stretch',
		'*:focus-visible:relative *:focus-visible:z-10',
		'has-[>[data-slot=button-group]]:gap-2',
		'has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-nui-lg',
		"[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
	],
	{
		defaultVariants: {
			orientation: 'horizontal',
		},
		variants: {
			orientation: BUTTON_GROUP_ORIENTATION_CLASSES,
		},
	},
)

type ButtonGroupProps = ComponentProps<'div'> & {
	orientation?: ButtonGroupOrientation
}

function ButtonGroup({
	className,
	orientation,
	...restProps
}: ButtonGroupProps) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: Button groups group related action controls, not form fields
		<div
			className={mcn(buttonGroupVariants({ orientation }), className)}
			data-orientation={orientation}
			data-slot={'button-group'}
			role={'group'}
			{...restProps}
		/>
	)
}

type ButtonGroupTextProps = useRender.ComponentProps<'div'>

function ButtonGroupText({
	className,
	render,
	...restProps
}: ButtonGroupTextProps) {
	return useRender({
		defaultTagName: 'div',
		props: mergeProps<'div'>(
			{
				className: mcn(
					'flex items-center',
					'gap-2 px-2.5',
					'rounded-nui-lg border bg-nui-muted',
					'text-sm font-medium',
					"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
					className,
				),
			},
			restProps,
		),
		render,
		state: {
			slot: 'button-group-text',
		},
	})
}

type ButtonGroupSeparatorProps = SeparatorProps

function ButtonGroupSeparator({
	className,
	orientation = 'vertical',
	...restProps
}: ButtonGroupSeparatorProps) {
	return (
		<Separator
			className={mcn(
				'relative self-stretch',
				'bg-nui-input',
				'data-horizontal:mx-px data-vertical:my-px',
				'data-vertical:h-auto data-horizontal:w-auto',
				className,
			)}
			data-slot={'button-group-separator'}
			orientation={orientation}
			{...restProps}
		/>
	)
}

export {
	BUTTON_GROUP_ORIENTATIONS,
	ButtonGroup,
	type ButtonGroupOrientation,
	type ButtonGroupProps,
	ButtonGroupSeparator,
	type ButtonGroupSeparatorProps,
	ButtonGroupText,
	type ButtonGroupTextProps,
	buttonGroupVariants,
}
