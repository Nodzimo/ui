import type { IconProps } from '../../icon-types'

const SvgDownloadIcon = (props: IconProps) => (
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
		<path d='M12 15V3M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
		<path d='m7 10 5 5 5-5' />
	</svg>
)
export default SvgDownloadIcon
