import type { SVGProps } from 'react'

type Props = {
	leftColor?: string
	rightColor?: string
} & SVGProps<SVGSVGElement>

export function NodzimoSymbolIcon({
	leftColor = 'currentColor',
	rightColor = leftColor,
	...restProps
}: Props) {
	return (
		<svg
			aria-hidden={true}
			height={'1em'}
			viewBox={'0 0 800 800'}
			width={'1em'}
			xmlns={'http://www.w3.org/2000/svg'}
			{...restProps}
		>
			<path
				d={
					'M510.54 15.5c-135.23-38.74-286.87-4.86-393.39 101.65-146.66 146.67-155.62 378.88-26.88 536l425.7-425.7c-42.27-63.81-44.09-146.52-5.43-211.95M156.76 332.1c-39.05-39.05-39.05-102.37 0-141.42s102.37-39.05 141.42 0 39.05 102.37 0 141.42-102.37 39.05-141.42 0'
				}
				fill={leftColor}
			/>
			<path
				d={
					'M784.49 289.45c-65.43 38.66-148.14 36.84-211.95-5.43l-425.7 425.7c157.12 128.74 389.34 119.78 536-26.88 106.52-106.52 140.4-258.16 101.65-393.39m-316.6 353.78c-39.05-39.05-39.05-102.37 0-141.42s102.37-39.05 141.42 0 39.05 102.37 0 141.42-102.37 39.05-141.42 0'
				}
				fill={rightColor}
			/>
		</svg>
	)
}
