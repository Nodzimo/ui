'use client'

import type { ComponentPropsWithoutRef } from 'react'

export function Button({
	children,
	...restProps
}: ComponentPropsWithoutRef<'button'>) {
	return <button {...restProps}>{children} [UI kit test button]</button>
}
