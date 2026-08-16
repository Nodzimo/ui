import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { mcn } from '#lib'

type SliderProps = SliderPrimitive.Root.Props

type SliderOrientation = NonNullable<SliderProps['orientation']>

const SLIDER_ORIENTATIONS = Object.freeze([
	'horizontal',
	'vertical',
] as const satisfies readonly SliderOrientation[])

type SliderThumbAlignment = NonNullable<SliderProps['thumbAlignment']>

const SLIDER_THUMB_ALIGNMENTS = Object.freeze([
	'center',
	'edge',
	'edge-client-only',
] as const satisfies readonly SliderThumbAlignment[])

type SliderThumbCollisionBehavior = NonNullable<
	SliderProps['thumbCollisionBehavior']
>

const SLIDER_THUMB_COLLISION_BEHAVIORS = Object.freeze([
	'push',
	'swap',
	'none',
] as const satisfies readonly SliderThumbCollisionBehavior[])

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderProps) {
	const _values = Array.isArray(value)
		? value
		: Array.isArray(defaultValue)
			? defaultValue
			: [min, max]

	return (
		<SliderPrimitive.Root
			className={mcn('data-vertical:h-full data-horizontal:w-full', className)}
			data-slot={'slider'}
			defaultValue={defaultValue}
			max={max}
			min={min}
			thumbAlignment={'edge'}
			value={value}
			{...props}
		>
			<SliderPrimitive.Control
				className={
					'relative flex w-full touch-none select-none items-center data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50'
				}
			>
				<SliderPrimitive.Track
					className={
						'relative grow select-none overflow-hidden rounded-full bg-nui-muted data-horizontal:h-1 data-vertical:h-full data-horizontal:w-full data-vertical:w-1'
					}
					data-slot={'slider-track'}
				>
					<SliderPrimitive.Indicator
						className={
							'select-none bg-nui-primary data-horizontal:h-full data-vertical:w-full'
						}
						data-slot={'slider-range'}
					/>
				</SliderPrimitive.Track>
				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						className={
							'relative block size-3 shrink-0 select-none rounded-full border border-nui-ring bg-white ring-nui-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-3 focus-visible:outline-hidden focus-visible:ring-3 active:ring-3 disabled:pointer-events-none disabled:opacity-50'
						}
						data-slot={'slider-thumb'}
						// biome-ignore lint/suspicious/noArrayIndexKey: Slider thumbs use their array position as identity
						key={index}
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	)
}

export {
	SLIDER_ORIENTATIONS,
	SLIDER_THUMB_ALIGNMENTS,
	SLIDER_THUMB_COLLISION_BEHAVIORS,
	Slider,
	type SliderOrientation,
	type SliderProps,
	type SliderThumbAlignment,
	type SliderThumbCollisionBehavior,
}
