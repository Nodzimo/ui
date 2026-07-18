import type { JSX } from 'react'

const SvgMonitorIcon = (props: JSX.IntrinsicElements['svg']) => (
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
		<rect height={14} rx={2} width={20} x={2} y={3} />
		<path d='M8 21h8M12 17v4' />
	</svg>
)
export default SvgMonitorIcon
