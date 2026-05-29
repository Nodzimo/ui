// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from '.'

const meta = {
	component: Spinner,
	parameters: {
		layout: 'centered',
	},
	title: 'Core/Components/Spinner',
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
	render: (args) => {
		return (
			<div className={'flex items-center gap-2 text-nui-muted-foreground'}>
				<Spinner {...args} data-icon={'inline-start'} />
				<span className={'text-sm'}>Loading...</span>
			</div>
		)
	},
}
