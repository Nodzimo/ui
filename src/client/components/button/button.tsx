import { Button as ButtonPrimitive } from '@base-ui/react/button'
import type { VariantProps } from 'class-variance-authority'
import { mcn } from '#lib'
import { buttonVariants } from './button-variants'

type Props = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

export function Button({
	className,
	variant = 'default',
	size = 'default',
	...restProps
}: Props) {
	return (
		<ButtonPrimitive
			className={mcn(buttonVariants({ variant, size, className }))}
			data-slot={'button'}
			{...restProps}
		/>
	)
}
