import type { IconProps } from '../../icon-types'

const SvgCalendarIcon = (props: IconProps) => (
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
		<path d='M8 2v3M16 2v3' />
		<rect height={18} rx={2} width={18} x={3} y={3} />
		<path d='M3 9h18' />
	</svg>
)
export default SvgCalendarIcon
