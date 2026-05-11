import type { ComponentPropsWithoutRef } from 'react'

export function Button({
	children,
	...restProps
}: ComponentPropsWithoutRef<'button'>) {
	return (
		<button
			className={'rounded-full bg-indigo-500 p-20 text-orange-500'}
			{...restProps}
		>
			{children} [UI kit test button]
		</button>
	)
}
