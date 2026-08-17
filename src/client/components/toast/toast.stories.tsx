// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '#client'
import {
	STRING_UNION_SUMMARY,
	UNION_SEPARATOR,
} from '../../../storybook/constants'
import {
	TOAST_PRIORITIES,
	TOAST_TYPES,
	Toaster,
	type ToasterProps,
	type ToastPriority,
	type ToastProps,
	type ToastType,
	toast,
} from '.'

const TOAST_DEFAULTS = {
	limit: 3,
	priority: TOAST_PRIORITIES[0],
	timeout: 5_000,
} as const

type ToastStoryArgs = ToasterProps & {
	onShowToast: () => void
	priority: ToastPriority
	type?: ToastType
	title: ToastProps['toast']['title']
	description: ToastProps['toast']['description']
}

const meta = {
	args: {
		description: 'This is a toast notification',
		limit: TOAST_DEFAULTS.limit,
		onShowToast: fn(),
		priority: TOAST_DEFAULTS.priority,
		timeout: TOAST_DEFAULTS.timeout,
		title: 'Toast created',
	},
	argTypes: {
		limit: {
			control: { min: 1 },
			description: 'Maximum number of visible toasts',
			table: { defaultValue: { summary: String(TOAST_DEFAULTS.limit) } },
		},
		priority: {
			control: 'inline-radio',
			description: 'Controls how urgently screen readers announce the toast',
			options: TOAST_PRIORITIES,
			table: {
				defaultValue: { summary: `'${TOAST_DEFAULTS.priority}'` },
				type: {
					detail: TOAST_PRIORITIES.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		timeout: {
			control: { min: 0 },
			description: 'Default time before a toast is dismissed',
			table: { defaultValue: { summary: String(TOAST_DEFAULTS.timeout) } },
		},
		type: {
			control: 'select',
			description: 'Built-in icon and status for the new toast',
			options: TOAST_TYPES,
			table: {
				defaultValue: { summary: 'undefined' },
				type: {
					detail: TOAST_TYPES.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
	},
	render: ({
		description,
		limit,
		onShowToast,
		priority,
		title,
		timeout,
		type,
	}: ToastStoryArgs) => {
		return (
			<Toaster limit={limit} timeout={timeout}>
				<Button
					onClick={() => {
						onShowToast()
						toast.add({ description, priority, title, type })
					}}
				>
					Show toast
				</Button>
			</Toaster>
		)
	},
	title: 'Client/Components/Toast',
} satisfies Meta<ToastStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
