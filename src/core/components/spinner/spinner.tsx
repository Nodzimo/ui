import { Loader2Icon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { mcn } from '#lib'

export function Spinner({ className, ...props }: ComponentProps<'svg'>) {
	return (
		<Loader2Icon
			aria-label='Loading'
			className={mcn('size-4 animate-spin', className)}
			role='status'
			{...props}
		/>
	)
}
