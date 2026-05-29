// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { PropsWithChildren } from 'react'
import { fn } from 'storybook/test'
import {
	ArrowUpRightIcon,
	FolderOpenIcon,
	HeartIcon,
	KeyRoundIcon,
	Spinner,
	StarIcon,
	Trash2Icon,
	XIcon,
} from '#core'
import {
	STRING_UNION_SUMMARY,
	UNION_SEPARATOR,
} from '../../../storybook/constants'
import { BUTTON_SIZES, BUTTON_VARIANTS, Button, type ButtonProps } from '.'

const BUTTON_STORY_ICONS = {
	ArrowUpRightIcon,
	FolderOpenIcon,
	HeartIcon,
	KeyRoundIcon,
	StarIcon,
	Trash2Icon,
	XIcon,
} as const

type ButtonStoryIconName = keyof typeof BUTTON_STORY_ICONS

const BUTTON_STORY_ICON_OPTIONS = Object.keys(
	BUTTON_STORY_ICONS,
) as ButtonStoryIconName[]

const DEFAULT_BUTTON_DISABLED = false

function ButtonPreviewRow(props: PropsWithChildren) {
	return <div {...props} className={'flex items-end gap-5'} />
}

type ButtonStoryIcon = (typeof BUTTON_STORY_ICONS)[ButtonStoryIconName]

type ButtonStoryArgs = ButtonProps & {
	Icon?: ButtonStoryIcon
}

const meta = {
	args: {
		children: 'Button',
		disabled: DEFAULT_BUTTON_DISABLED,
		onClick: fn(),
		size: 'default',
		variant: 'default',
	},
	argTypes: {
		children: {
			table: {
				type: {
					summary: 'ReactNode',
				},
			},
		},
		disabled: {
			table: { defaultValue: { summary: String(DEFAULT_BUTTON_DISABLED) } },
		},
		Icon: {
			control: 'select',
			description: 'Story-only icon picker (this is not a Button prop!)',
			mapping: BUTTON_STORY_ICONS,
			options: BUTTON_STORY_ICON_OPTIONS,
			table: {
				category: 'Story canvas',
				defaultValue: { summary: BUTTON_STORY_ICON_OPTIONS[2] },
				type: {
					detail: BUTTON_STORY_ICON_OPTIONS.join(UNION_SEPARATOR),
					summary: 'component union',
				},
			},
		},
		size: {
			control: 'select',
			options: BUTTON_SIZES,
			table: {
				type: {
					detail: BUTTON_SIZES.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		variant: {
			control: 'select',
			options: BUTTON_VARIANTS,
			table: {
				type: {
					detail: BUTTON_VARIANTS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
	},
	component: Button,
	decorators: [
		(Story) => {
			return (
				<div className={'p-10'}>
					<Story />
				</div>
			)
		},
	],
	parameters: {
		pseudo: {
			active: '[data-preview="active"]',
			hover: '[data-preview="hover"]',
		},
	},
	render: ({ children, Icon = HeartIcon, ...restArgs }) => {
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
	title: 'Client/Components/Button',
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
	args: { children: 'Like' },
	name: 'Primary (default)',
}

export const Outline: Story = {
	args: {
		children: 'Open',
		Icon: FolderOpenIcon,
		variant: 'outline',
	},
}

export const Secondary: Story = {
	args: {
		children: 'Close',
		Icon: XIcon,
		variant: 'secondary',
	},
}

export const Ghost: Story = {
	args: {
		children: 'Login',
		Icon: KeyRoundIcon,
		variant: 'ghost',
	},
}

export const Destructive: Story = {
	args: {
		children: 'Delete',
		Icon: Trash2Icon,
		variant: 'destructive',
	},
}

export const Link: Story = {
	args: {
		children: 'Visit',
		Icon: ArrowUpRightIcon,
		variant: 'link',
	},
}

export const Sizes: Story = {
	render: ({ children, Icon = ArrowUpRightIcon, ...restArgs }) => {
		return (
			<div className={'flex flex-col gap-10'}>
				<ButtonPreviewRow>
					<Button {...restArgs} size={'xs'}>
						<Icon data-icon={'inline-start'} /> {children}
					</Button>
					<Button {...restArgs} size={'sm'}>
						<Icon data-icon={'inline-start'} /> {children}
					</Button>
					<Button {...restArgs} size={'default'}>
						<Icon data-icon={'inline-start'} /> {children}
					</Button>
					<Button {...restArgs} size={'lg'}>
						<Icon data-icon={'inline-start'} /> {children}
					</Button>
				</ButtonPreviewRow>
				<ButtonPreviewRow>
					<Button {...restArgs} size={'xs'}>
						{children} <Icon data-icon={'inline-end'} />
					</Button>
					<Button {...restArgs} size={'sm'}>
						{children} <Icon data-icon={'inline-end'} />
					</Button>
					<Button {...restArgs} size={'default'}>
						{children} <Icon data-icon={'inline-end'} />
					</Button>
					<Button {...restArgs} size={'lg'}>
						{children} <Icon data-icon={'inline-end'} />
					</Button>
				</ButtonPreviewRow>
				<ButtonPreviewRow>
					<Button {...restArgs} size={'xs'}>
						{children}
					</Button>
					<Button {...restArgs} size={'sm'}>
						{children}
					</Button>
					<Button {...restArgs} size={'default'}>
						{children}
					</Button>
					<Button {...restArgs} size={'lg'}>
						{children}
					</Button>
				</ButtonPreviewRow>
				<ButtonPreviewRow>
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
			</div>
		)
	},
}

export const Loading: Story = {
	render: ({ children: _children, Icon: _Icon, ...restArgs }) => {
		return (
			<ButtonPreviewRow>
				<Button {...restArgs}>
					<Spinner data-icon={'inline-start'} />
					<span dir={'ltr'}>Processing...</span>
				</Button>
				<Button {...restArgs}>
					Please wait
					<Spinner data-icon={'inline-end'} />
				</Button>
			</ButtonPreviewRow>
		)
	},
}
