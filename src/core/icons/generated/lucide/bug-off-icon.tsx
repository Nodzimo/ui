import type { JSX } from 'react'

const SvgBugOffIcon = (props: JSX.IntrinsicElements['svg']) => (
	<svg
		aria-hidden='true'
		fill='none'
		height='1em'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth={2}
		viewBox='0 0 24 24'
		width='1em'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path d='M12 20v-8M12.656 7H14a4 4 0 0 1 4 4v1.344M14.12 3.88 16 2M17.123 17.123A6 6 0 0 1 6 14v-3a4 4 0 0 1 1.72-3.287M2 2l20 20' />
		<path d='M21 5a4 4 0 0 1-3.55 3.97M22 13h-3.344M3 21a4 4 0 0 1 3.81-4M3 5a4 4 0 0 0 3.55 3.97M6 13H2M8 2l1.88 1.88M9.712 4.06A3 3 0 0 1 15 6v1.13' />
	</svg>
)
export default SvgBugOffIcon
