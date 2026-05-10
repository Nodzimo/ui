import type { ComponentPropsWithoutRef } from 'react'

export function Card({
	children,
	...restProps
}: ComponentPropsWithoutRef<'div'>) {
	return <div {...restProps}>{children} [UI kit test card]</div>
}
