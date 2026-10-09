import type { IconProps } from '../../icon-types'

const SvgJapanFlagIcon = (props: IconProps) => (
	<svg
		aria-hidden='true'
		viewBox='0 0 640 480'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<defs>
			<clipPath id='japan-flag-icon_svg__a'>
				<path d='M-88 32h640v480H-88z' fillOpacity={0.7} />
			</clipPath>
		</defs>
		<g
			clipPath='url(#japan-flag-icon_svg__a)'
			fillRule='evenodd'
			strokeWidth='1pt'
			transform='translate(88 -32)'
		>
			<path d='M-128 32h720v480h-720z' fill='#fff' />
			<circle
				cx={523.1}
				cy={344.1}
				fill='#bc002d'
				r={194.9}
				transform='translate(-168.4 8.6)scale(.76554)'
			/>
		</g>
	</svg>
)
export default SvgJapanFlagIcon
