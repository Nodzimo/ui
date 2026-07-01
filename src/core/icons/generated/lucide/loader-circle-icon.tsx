import type { JSX } from 'react'

const SvgLoaderCircleIcon = (props: JSX.IntrinsicElements['svg']) => (
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
		<path d='M21 12a9 9 0 1 1-6.219-8.56' />
	</svg>
)
export default SvgLoaderCircleIcon
