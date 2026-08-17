// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '#client'
import {
	DIALOG_MODAL_MODES,
	Dialog,
	DialogContent,
	type DialogContentProps,
	DialogDescription,
	DialogFooter,
	type DialogFooterProps,
	DialogHeader,
	type DialogProps,
	DialogTitle,
	DialogTrigger,
} from '.'

const DIALOG_DEFAULTS = {
	contentShowCloseButton: true,
	disablePointerDismissal: false,
	footerShowCloseButton: false,
} as const

type DialogStoryArgs = DialogProps & {
	contentShowCloseButton?: DialogContentProps['showCloseButton']
	footerShowCloseButton?: DialogFooterProps['showCloseButton']
}

const meta = {
	args: {
		contentShowCloseButton: DIALOG_DEFAULTS.contentShowCloseButton,
		disablePointerDismissal: DIALOG_DEFAULTS.disablePointerDismissal,
		footerShowCloseButton: DIALOG_DEFAULTS.footerShowCloseButton,
		modal: DIALOG_MODAL_MODES[0],
		onOpenChange: fn(),
	},
	argTypes: {
		contentShowCloseButton: {
			table: {
				defaultValue: {
					summary: String(DIALOG_DEFAULTS.contentShowCloseButton),
				},
			},
		},
		disablePointerDismissal: {
			description: 'Prevents closing from outside presses',
			table: {
				defaultValue: {
					summary: String(DIALOG_DEFAULTS.disablePointerDismissal),
				},
			},
		},
		footerShowCloseButton: {
			table: {
				defaultValue: {
					summary: String(DIALOG_DEFAULTS.footerShowCloseButton),
				},
			},
		},
		modal: {
			control: 'inline-radio',
			description: 'Controls focus trapping and outside interaction',
			options: DIALOG_MODAL_MODES,
			table: {
				defaultValue: { summary: 'true' },
				type: {
					summary: "boolean | 'trap-focus'",
				},
			},
		},
	},
	component: Dialog,
	render: ({
		contentShowCloseButton,
		footerShowCloseButton,
		...restArgs
	}: DialogStoryArgs) => {
		return (
			<Dialog {...restArgs}>
				<DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
				<DialogContent showCloseButton={contentShowCloseButton}>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
						<DialogDescription>
							This dialog has a sticky footer that stays visible while the
							content scrolls
						</DialogDescription>
					</DialogHeader>
					<div
						className={'no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4'}
					>
						{Array.from({ length: 10 }).map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Static story content never reorders
							<p className={'mb-4 leading-normal'} key={index}>
								The quiet window carries a paper garden across the patient room.
								Small silver objects rest beneath a yellow table, while the
								careful river folds its shadow into a narrow wooden box. Every
								distant letter follows the warm ceiling, turns beside the empty
								chair, and waits for another quiet morning to begin.
								<br />
								<br />A narrow house remembers the color of rain and keeps
								several round clocks under the floor. The soft hallway moves
								around a sleeping book, while pale branches gather near the open
								door. Nothing explains the order, but every small detail remains
								calm, familiar, and completely out of place.
							</p>
						))}
					</div>
					<DialogFooter
						className={'items-center'}
						showCloseButton={footerShowCloseButton}
					>
						Sticky Footer
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	},
	title: 'Client/Components/Dialog',
} satisfies Meta<DialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
