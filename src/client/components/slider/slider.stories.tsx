// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
	STRING_UNION_SUMMARY,
	UNION_SEPARATOR,
} from '../../../storybook/constants'
import {
	SLIDER_ORIENTATIONS,
	SLIDER_THUMB_ALIGNMENTS,
	SLIDER_THUMB_COLLISION_BEHAVIORS,
	Slider,
} from '.'

const SLIDER_DEFAULTS = {
	disabled: false,
	orientation: SLIDER_ORIENTATIONS[0],
	step: 1,
	thumbAlignment: SLIDER_THUMB_ALIGNMENTS[1],
	thumbCollisionBehavior: SLIDER_THUMB_COLLISION_BEHAVIORS[0],
} as const

const meta = {
	args: {
		defaultValue: [25, 50, 75],
		disabled: SLIDER_DEFAULTS.disabled,
		max: 100,
		min: 0,
		onValueChange: fn(),
		orientation: SLIDER_DEFAULTS.orientation,
		step: SLIDER_DEFAULTS.step,
		thumbAlignment: SLIDER_DEFAULTS.thumbAlignment,
		thumbCollisionBehavior: SLIDER_DEFAULTS.thumbCollisionBehavior,
	},
	argTypes: {
		defaultValue: {
			description: 'Initial value or values',
			table: {
				defaultValue: { summary: 'undefined' },
			},
		},
		disabled: {
			table: {
				defaultValue: { summary: String(SLIDER_DEFAULTS.disabled) },
			},
		},
		max: {
			control: 'number',
			table: {
				type: { summary: 'number' },
			},
		},
		min: {
			control: 'number',
			table: {
				type: { summary: 'number' },
			},
		},
		orientation: {
			control: 'inline-radio',
			options: SLIDER_ORIENTATIONS,
			table: {
				defaultValue: { summary: `'${SLIDER_DEFAULTS.orientation}'` },
				type: {
					detail: SLIDER_ORIENTATIONS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		step: {
			table: {
				defaultValue: { summary: String(SLIDER_DEFAULTS.step) },
			},
		},
		thumbAlignment: {
			control: 'select',
			options: SLIDER_THUMB_ALIGNMENTS,
			table: {
				defaultValue: { summary: `'${SLIDER_DEFAULTS.thumbAlignment}'` },
				type: {
					detail: SLIDER_THUMB_ALIGNMENTS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		thumbCollisionBehavior: {
			control: 'select',
			options: SLIDER_THUMB_COLLISION_BEHAVIORS,
			table: {
				defaultValue: {
					summary: `'${SLIDER_DEFAULTS.thumbCollisionBehavior}'`,
				},
				type: {
					detail: SLIDER_THUMB_COLLISION_BEHAVIORS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
	},
	component: Slider,
	decorators: [
		(Story) => {
			return (
				<div className={'w-sm'}>
					<Story />
				</div>
			)
		},
	],
	render: (args) => {
		return <Slider {...args} key={String(args.defaultValue)} />
	},
	title: 'Client/Components/Slider',
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
