// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Label } from '#core'
import {
	RadioGroup,
	RadioGroupItem,
	type RadioGroupItemProps,
	type RadioGroupProps,
} from '.'

const RADIO_GROUP_DEFAULTS = {
	disabled: false,
	itemAriaInvalid: false,
	readOnly: false,
	required: false,
} as const

type RadioGroupStoryArgs = RadioGroupProps & {
	itemAriaInvalid: RadioGroupItemProps['aria-invalid']
}

const meta = {
	args: {
		disabled: RADIO_GROUP_DEFAULTS.disabled,
		itemAriaInvalid: RADIO_GROUP_DEFAULTS.itemAriaInvalid,
		onValueChange: fn(),
		readOnly: RADIO_GROUP_DEFAULTS.readOnly,
		required: RADIO_GROUP_DEFAULTS.required,
	},
	argTypes: {
		disabled: {
			table: {
				defaultValue: { summary: String(RADIO_GROUP_DEFAULTS.disabled) },
			},
		},
		itemAriaInvalid: {
			description: 'Applies to all radio items in this story',
			table: {
				defaultValue: {
					summary: String(RADIO_GROUP_DEFAULTS.itemAriaInvalid),
				},
			},
		},
		readOnly: {
			table: {
				defaultValue: { summary: String(RADIO_GROUP_DEFAULTS.readOnly) },
			},
		},
		required: {
			table: {
				defaultValue: { summary: String(RADIO_GROUP_DEFAULTS.required) },
			},
		},
	},
	component: RadioGroup,
	render: ({ itemAriaInvalid, ...restArgs }) => {
		return (
			<RadioGroup defaultValue={'comfortable'} {...restArgs}>
				<Label>
					<RadioGroupItem aria-invalid={itemAriaInvalid} value={'default'} />
					Default
				</Label>
				<Label>
					<RadioGroupItem
						aria-invalid={itemAriaInvalid}
						value={'comfortable'}
					/>
					Comfortable
				</Label>
				<Label>
					<RadioGroupItem aria-invalid={itemAriaInvalid} value={'compact'} />
					Compact
				</Label>
			</RadioGroup>
		)
	},
	title: 'Client/Components/Radio Group',
} satisfies Meta<RadioGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
