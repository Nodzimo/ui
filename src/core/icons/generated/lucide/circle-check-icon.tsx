import type { IconProps } from '../../icon-types'

const SvgCircleCheckIcon = (props: IconProps) => (
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
		<path d='m9 12 2 2 4-4' />
	</svg>
)
export default SvgCircleCheckIcon
