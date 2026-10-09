import type { IconProps } from '../../icon-types'

const SvgSmartphoneIcon = (props: IconProps) => (
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
		<rect height={20} rx={2} ry={2} width={14} x={5} y={2} />
		<path d='M12 18h.01' />
	</svg>
)
export default SvgSmartphoneIcon
