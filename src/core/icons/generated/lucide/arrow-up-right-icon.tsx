import type { SVGProps } from 'react'

const SvgArrowUpRightIcon = (props: SVGProps<SVGSVGElement>) => (
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
		<path d='M7 7h10v10M7 17 17 7' />
	</svg>
)
export default SvgArrowUpRightIcon
