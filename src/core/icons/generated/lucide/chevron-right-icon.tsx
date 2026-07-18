import type { JSX } from 'react'

const SvgChevronRightIcon = (props: JSX.IntrinsicElements['svg']) => (
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
		<path d='m9 18 6-6-6-6' />
	</svg>
)
export default SvgChevronRightIcon
