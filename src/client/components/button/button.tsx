import type { ComponentPropsWithoutRef } from 'react'

export function Button({
	children,
	...restProps
}: ComponentPropsWithoutRef<'button'>) {
	return (
		<button className={'bg-lime-500'} {...restProps}>
			{children} [UI kit test button]
		</button>
	)
}
