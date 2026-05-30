import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function mergeClassNames(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export { mergeClassNames as mcn }
