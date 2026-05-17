import type { SVGProps } from 'react'

const SvgLoaderPinwheelIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		aria-hidden={true}
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
		<path d='M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0' />
		<path d='M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6' />
		<path d='M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6' />
		<circle cx={12} cy={12} r={10} />
	</svg>
)
export default SvgLoaderPinwheelIcon
