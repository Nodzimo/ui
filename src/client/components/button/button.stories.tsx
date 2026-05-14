// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { PropsWithChildren } from 'react'
import { fn } from 'storybook/test'
import { Button } from '.'

const meta = {
	title: 'Client/Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		variant: {
			table: {
				type: { summary: 'union' },
			},
			control: 'inline-radio',
			options: [
				'default',
				'outline',
				'secondary',
				'ghost',
				'destructive',
				'link',
			],
		},
		size: {
			table: {
				type: { summary: 'union' },
			},
			control: 'inline-radio',
			options: [
				'default',
				'xs',
				'sm',
				'lg',
				'icon',
				'icon-xs',
				'icon-sm',
				'icon-lg',
			],
		},
	},
	args: {
		children: 'Button',
		onClick: fn(),
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
	name: 'Primary (default)',
}

export const Outline: Story = {
	args: {
		variant: 'outline',
	},
}

export const Secondary: Story = {
	args: {
		variant: 'secondary',
	},
}

export const Ghost: Story = {
	args: {
		variant: 'ghost',
	},
}

export const Destructive: Story = {
	args: {
		children: 'Delete',
		variant: 'destructive',
	},
}

export const Link: Story = {
	args: {
		children: 'Visit',
		variant: 'link',
	},
}

function ButtonScalePreview({ children }: PropsWithChildren) {
	return (
		<div className={'flex flex-col items-center gap-5'}>
			<p className={'text-nui-muted-foreground'}>
				Extra small, Small, Default, Large
			</p>
			<div className={'flex items-center gap-5'}>{children}</div>
		</div>
	)
}

export const Sizes: Story = {
	render: args => {
		return (
			<ButtonScalePreview>
				<Button {...args} size={'xs'} />
				<Button {...args} size={'sm'} />
				<Button {...args} size={'default'} />
				<Button {...args} size={'lg'} />
			</ButtonScalePreview>
		)
	},
}

export const IconSizes: Story = {
	name: 'Icon sizes',
	args: {
		children: '☭',
	},
	render: args => {
		return (
			<ButtonScalePreview>
				<Button {...args} size={'icon-xs'} />
				<Button {...args} size={'icon-sm'} />
				<Button {...args} size={'icon'} />
				<Button {...args} size={'icon-lg'} />
			</ButtonScalePreview>
		)
	},
}
