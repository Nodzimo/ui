import type { ComponentProps } from 'react'
import { LoaderCircleIcon } from '#core/icons'
import { mcn } from '#lib'

export function Spinner({ className, ...props }: ComponentProps<'svg'>) {
	return (
		<LoaderCircleIcon
			aria-label={'Loading'}
			className={mcn('size-4 animate-spin', className)}
			role={'status'}
			{...props}
		/>
	)
}
