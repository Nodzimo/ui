import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { Separator } from '#client/components/separator'
import { mcn } from '#lib'

const buttonGroupVariants = cva(
	"flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-nui-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
	{
		defaultVariants: {
			orientation: 'horizontal',
		},
		variants: {
			orientation: {
				horizontal:
					'*:data-slot:rounded-e-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-e-nui-lg! [&>[data-slot]~[data-slot]]:rounded-s-none [&>[data-slot]~[data-slot]]:border-s-0',
				vertical:
					'flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-nui-lg! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0',
			},
		},
	},
)

function ButtonGroup({
	className,
	orientation,
	...restProps
}: ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
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

function ButtonGroupText({
	className,
	render,
	...restProps
}: useRender.ComponentProps<'div'>) {
	return useRender({
		defaultTagName: 'div',
		props: mergeProps<'div'>(
			{
				className: mcn(
					"flex items-center gap-2 rounded-nui-lg border bg-nui-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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

function ButtonGroupSeparator({
	className,
	orientation = 'vertical',
	...restProps
}: ComponentProps<typeof Separator>) {
	return (
		<Separator
			className={mcn(
				'relative self-stretch bg-nui-input data-horizontal:mx-px data-vertical:my-px data-vertical:h-auto data-horizontal:w-auto',
				className,
			)}
			data-slot={'button-group-separator'}
			orientation={orientation}
			{...restProps}
		/>
	)
}

export {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	buttonGroupVariants,
}
