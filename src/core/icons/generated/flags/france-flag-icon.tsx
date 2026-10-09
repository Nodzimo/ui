import type { IconProps } from '../../icon-types'

const SvgFranceFlagIcon = (props: IconProps) => (
	<svg
		aria-hidden='true'
		viewBox='0 0 640 480'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path d='M0 0h213.3v480H0z' fill='#000091' />
		<path d='M213.3 0h213.4v480H213.3z' fill='#fff' />
		<path d='M426.7 0H640v480H426.7z' fill='#e1000f' />
	</svg>
)
export default SvgFranceFlagIcon
