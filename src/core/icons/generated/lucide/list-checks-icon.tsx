import type { JSX } from 'react'

const SvgListChecksIcon = (props: JSX.IntrinsicElements['svg']) => (
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
		<path d='M13 5h8M13 12h8M13 19h8M3 17l2 2 4-4M3 7l2 2 4-4' />
	</svg>
)
export default SvgListChecksIcon
