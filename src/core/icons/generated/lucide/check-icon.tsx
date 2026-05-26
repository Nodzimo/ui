import type { SVGProps } from 'react'

const SvgCheckIcon = (props: SVGProps<SVGSVGElement>) => (
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
		<path d='M20 6 9 17l-5-5' />
	</svg>
)
export default SvgCheckIcon
