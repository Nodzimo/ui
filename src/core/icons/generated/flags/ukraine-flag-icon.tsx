import type { IconProps } from '../../icon-types'

const SvgUkraineFlagIcon = (props: IconProps) => (
	<svg
		aria-hidden='true'
		viewBox='0 0 640 480'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<g fillRule='evenodd' strokeWidth='1pt'>
			<path d='M0 0h640v240H0z' fill='#0057b8' />
			<path d='M0 240h640v240H0z' fill='gold' />
		</g>
	</svg>
)
export default SvgUkraineFlagIcon
