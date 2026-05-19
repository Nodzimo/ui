// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import {
	ArrowUpRightIcon,
	FolderOpen,
	Heart,
	KeyRound,
	Star,
	Trash2,
	X,
} from 'lucide-react'
import type { ComponentProps } from 'react'
import { fn } from 'storybook/test'
import { Spinner } from '#core'
import { mcn } from '#lib'
import { Button } from '.'

const BUTTON_VARIANT_OPTIONS: readonly string[] = [
	'default',
	'outline',
	'secondary',
	'ghost',
	'destructive',
	'link',
]

const BUTTON_SIZE_OPTIONS: readonly string[] = [
	'default',
	'xs',
	'sm',
	'lg',
	'icon',
	'icon-xs',
	'icon-sm',
	'icon-lg',
]

const BUTTON_STORY_ICONS = {
	ArrowUpRightIcon,
	FolderOpen,
	Heart,
	KeyRound,
	Star,
	Trash2,
	X,
} as const

const BUTTON_STORY_ICON_OPTIONS: readonly string[] =
	Object.keys(BUTTON_STORY_ICONS)

const STRING_UNION_SUMMARY = 'string union'
const UNION_SEPARATOR = ' | '

function ButtonPreviewRow({ className, ...restProps }: ComponentProps<'div'>) {
	return <div className={mcn('flex gap-5', className)} {...restProps} />
}

type ButtonStoryIcon =
	(typeof BUTTON_STORY_ICONS)[keyof typeof BUTTON_STORY_ICONS]

type ButtonStoryArgs = ComponentProps<typeof Button> & {
	Icon?: ButtonStoryIcon
}

const meta = {
	title: 'Client/Components/Button',
	component: Button,
	parameters: {
		layout: 'fullscreen',
		pseudo: {
			hover: '[data-preview="hover"]',
			active: '[data-preview="active"]',
		},
	},
	argTypes: {
		variant: {
			table: {
				type: {
					summary: STRING_UNION_SUMMARY,
					detail: BUTTON_VARIANT_OPTIONS.join(UNION_SEPARATOR),
				},
			},
			control: 'select',
			options: BUTTON_VARIANT_OPTIONS,
		},
		size: {
			table: {
				type: {
					summary: STRING_UNION_SUMMARY,
					detail: BUTTON_SIZE_OPTIONS.join(UNION_SEPARATOR),
				},
			},
			control: 'select',
			options: BUTTON_SIZE_OPTIONS,
		},
		Icon: {
			description: 'Story-only icon picker (this is not a Button prop!)',
			table: {
				type: {
					summary: 'component union',
					detail: BUTTON_STORY_ICON_OPTIONS.join(UNION_SEPARATOR),
				},
			},
			control: 'select',
			options: BUTTON_STORY_ICON_OPTIONS,
			mapping: BUTTON_STORY_ICONS,
		},
	},
	args: {
		children: 'Button',
		onClick: fn(),
		disabled: false,
	},
	render: ({ children, Icon = Heart, ...restArgs }) => {
		return (
			<ButtonPreviewRow>
				<Button {...restArgs}>
					<Icon data-icon={'inline-start'} /> {children}
				</Button>
				<Button {...restArgs}>{children}</Button>
				<Button {...restArgs} size={'icon'}>
					<Icon />
				</Button>
				<Button {...restArgs}>
					{children} <Icon data-icon={'inline-end'} />
				</Button>
				<Button {...restArgs} disabled>
					Disabled
				</Button>
				<Button {...restArgs} data-preview={'hover'}>
					Hover
				</Button>
				<Button {...restArgs} data-preview={'active'}>
					Active
				</Button>
			</ButtonPreviewRow>
		)
	},
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
	name: 'Primary (default)',
	args: { children: 'Like' },
}

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Open',
		Icon: FolderOpen,
	},
}

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Close',
		Icon: X,
	},
}

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		children: 'Login',
		Icon: KeyRound,
	},
}

export const Destructive: Story = {
	args: {
		children: 'Delete',
		variant: 'destructive',
		Icon: Trash2,
	},
}

export const Link: Story = {
	args: {
		children: 'Visit',
		variant: 'link',
		Icon: ArrowUpRightIcon,
	},
}

export const Sizes: Story = {
	render: ({ Icon: _Icon, ...restArgs }) => {
		return (
			<ButtonPreviewRow className={'items-center'}>
				<Button {...restArgs} size={'xs'} />
				<Button {...restArgs} size={'sm'} />
				<Button {...restArgs} size={'default'} />
				<Button {...restArgs} size={'lg'} />
			</ButtonPreviewRow>
		)
	},
}

export const IconSizes: Story = {
	name: 'Icon sizes',
	render: ({ children: _children, Icon = Star, ...restArgs }) => {
		return (
			<ButtonPreviewRow className={'items-center'}>
				<Button {...restArgs} size={'icon-xs'}>
					<Icon />
				</Button>
				<Button {...restArgs} size={'icon-sm'}>
					<Icon />
				</Button>
				<Button {...restArgs} size={'icon'}>
					<Icon />
				</Button>
				<Button {...restArgs} size={'icon-lg'}>
					<Icon />
				</Button>
			</ButtonPreviewRow>
		)
	},
}

export const Loading: Story = {
	render: ({ children: _children, Icon: _Icon, ...restArgs }) => {
		return (
			<ButtonPreviewRow>
				<Button {...restArgs}>
					<Spinner data-icon={'inline-start'} />
					Processing...
				</Button>
				<Button {...restArgs}>
					Please wait
					<Spinner data-icon={'inline-end'} />
				</Button>
			</ButtonPreviewRow>
		)
	},
}
