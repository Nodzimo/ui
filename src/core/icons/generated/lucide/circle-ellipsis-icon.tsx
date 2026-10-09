import type { IconProps } from '../../icon-types'

const SvgCircleEllipsisIcon = (props: IconProps) => (
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
		<circle cx={12} cy={12} r={10} />
		<path d='M17 12h.01M12 12h.01M7 12h.01' />
	</svg>
)
export default SvgCircleEllipsisIcon
