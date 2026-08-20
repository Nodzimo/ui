import type { JSX } from 'react'

const SvgPauseIcon = (props: JSX.IntrinsicElements['svg']) => (
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
		<rect height={18} rx={1} width={5} x={14} y={3} />
		<rect height={18} rx={1} width={5} x={5} y={3} />
	</svg>
)
export default SvgPauseIcon
