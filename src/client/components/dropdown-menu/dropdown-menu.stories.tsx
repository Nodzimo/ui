// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '#client'
import {
	STRING_UNION_SUMMARY,
	UNION_SEPARATOR,
} from '../../../storybook/constants'
import {
	DROPDOWN_MENU_CONTENT_ALIGNS,
	DROPDOWN_MENU_CONTENT_SIDES,
	DROPDOWN_MENU_ITEM_VARIANTS,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	type DropdownMenuContentProps,
	DropdownMenuGroup,
	DropdownMenuItem,
	type DropdownMenuItemProps,
	DropdownMenuLabel,
	type DropdownMenuProps,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	type DropdownMenuTriggerProps,
} from '.'

const DROPDOWN_MENU_DEFAULTS = {
	contentAlign: DROPDOWN_MENU_CONTENT_ALIGNS[0],
	contentAlignOffset: 0,
	contentSide: DROPDOWN_MENU_CONTENT_SIDES[1],
	contentSideOffset: 4,
	disabled: false,
	itemDisabled: false,
	itemInset: false,
	itemVariant: DROPDOWN_MENU_ITEM_VARIANTS[0],
	triggerDisabled: false,
	triggerOpenOnHover: false,
} as const

type DropdownMenuStoryArgs = DropdownMenuProps & {
	contentAlign?: DropdownMenuContentProps['align']
	contentAlignOffset?: DropdownMenuContentProps['alignOffset']
	contentSide?: DropdownMenuContentProps['side']
	contentSideOffset?: DropdownMenuContentProps['sideOffset']
	itemDisabled: DropdownMenuItemProps['disabled']
	itemInset: DropdownMenuItemProps['inset']
	itemVariant?: DropdownMenuItemProps['variant']
	triggerDisabled: DropdownMenuTriggerProps['disabled']
	triggerOpenOnHover: DropdownMenuTriggerProps['openOnHover']
}

const meta = {
	args: {
		contentAlign: DROPDOWN_MENU_DEFAULTS.contentAlign,
		contentAlignOffset: DROPDOWN_MENU_DEFAULTS.contentAlignOffset,
		contentSide: DROPDOWN_MENU_DEFAULTS.contentSide,
		contentSideOffset: DROPDOWN_MENU_DEFAULTS.contentSideOffset,
		disabled: DROPDOWN_MENU_DEFAULTS.disabled,
		itemDisabled: DROPDOWN_MENU_DEFAULTS.itemDisabled,
		itemInset: DROPDOWN_MENU_DEFAULTS.itemInset,
		itemVariant: DROPDOWN_MENU_DEFAULTS.itemVariant,
		triggerDisabled: DROPDOWN_MENU_DEFAULTS.triggerDisabled,
		triggerOpenOnHover: DROPDOWN_MENU_DEFAULTS.triggerOpenOnHover,
	},
	argTypes: {
		contentAlign: {
			control: 'select',
			options: DROPDOWN_MENU_CONTENT_ALIGNS,
			table: {
				defaultValue: {
					summary: `'${DROPDOWN_MENU_DEFAULTS.contentAlign}'`,
				},
				type: {
					detail: DROPDOWN_MENU_CONTENT_ALIGNS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		contentAlignOffset: {
			control: 'number',
			table: {
				defaultValue: {
					summary: String(DROPDOWN_MENU_DEFAULTS.contentAlignOffset),
				},
			},
		},
		contentSide: {
			control: 'select',
			options: DROPDOWN_MENU_CONTENT_SIDES,
			table: {
				defaultValue: {
					summary: `'${DROPDOWN_MENU_DEFAULTS.contentSide}'`,
				},
				type: {
					detail: DROPDOWN_MENU_CONTENT_SIDES.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		contentSideOffset: {
			control: 'number',
			table: {
				defaultValue: {
					summary: String(DROPDOWN_MENU_DEFAULTS.contentSideOffset),
				},
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the whole menu',
			table: {
				defaultValue: {
					summary: String(DROPDOWN_MENU_DEFAULTS.disabled),
				},
			},
		},
		itemDisabled: {
			control: 'boolean',
			description: 'Applies to all items in this story',
			table: {
				defaultValue: {
					summary: String(DROPDOWN_MENU_DEFAULTS.itemDisabled),
				},
			},
		},
		itemInset: {
			control: 'boolean',
			description: 'Applies to all supported items in this story',
			table: {
				defaultValue: {
					summary: String(DROPDOWN_MENU_DEFAULTS.itemInset),
				},
			},
		},
		itemVariant: {
			control: 'select',
			description:
				'Applies to all items in this story (Log out is always destructive)',
			options: DROPDOWN_MENU_ITEM_VARIANTS,
			table: {
				defaultValue: {
					summary: `'${DROPDOWN_MENU_DEFAULTS.itemVariant}'`,
				},
				type: {
					detail: DROPDOWN_MENU_ITEM_VARIANTS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		triggerDisabled: {
			control: 'boolean',
			description: 'Disables only the trigger',
			table: {
				defaultValue: {
					summary: String(DROPDOWN_MENU_DEFAULTS.triggerDisabled),
				},
			},
		},
		triggerOpenOnHover: {
			control: 'boolean',
			table: {
				defaultValue: {
					summary: String(DROPDOWN_MENU_DEFAULTS.triggerOpenOnHover),
				},
			},
		},
	},
	component: DropdownMenu,
	render: ({
		contentAlign,
		contentAlignOffset,
		contentSide,
		contentSideOffset,
		itemDisabled,
		itemInset,
		itemVariant,
		triggerDisabled,
		triggerOpenOnHover,
		...restArgs
	}) => {
		return (
			<DropdownMenu {...restArgs}>
				<DropdownMenuTrigger
					disabled={triggerDisabled}
					openOnHover={triggerOpenOnHover}
					render={<Button variant={'outline'} />}
				>
					Open Complex Menu
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align={contentAlign}
					alignOffset={contentAlignOffset}
					className={'w-44'}
					side={contentSide}
					sideOffset={contentSideOffset}
				>
					<DropdownMenuGroup>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuItem
							disabled={itemDisabled}
							inset={itemInset}
							variant={itemVariant}
						>
							Profile
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={itemDisabled}
							inset={itemInset}
							variant={itemVariant}
						>
							Billing
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={itemDisabled}
							inset={itemInset}
							variant={itemVariant}
						>
							Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuLabel>Appearance</DropdownMenuLabel>
						<DropdownMenuCheckboxItem
							defaultChecked
							disabled={itemDisabled}
							inset={itemInset}
						>
							Show status bar
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem disabled={itemDisabled} inset={itemInset}>
							Show activity bar
						</DropdownMenuCheckboxItem>
						<DropdownMenuRadioGroup defaultValue={'comfortable'}>
							<DropdownMenuRadioItem
								disabled={itemDisabled}
								inset={itemInset}
								value={'compact'}
							>
								Compact density
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem
								disabled={itemDisabled}
								inset={itemInset}
								value={'comfortable'}
							>
								Comfortable density
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger disabled={itemDisabled} inset={itemInset}>
							More tools
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem
								disabled={itemDisabled}
								inset={itemInset}
								variant={itemVariant}
							>
								Save page now
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={itemDisabled}
								inset={itemInset}
								variant={itemVariant}
							>
								Create shortcut
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={itemDisabled}
								inset={itemInset}
								variant={itemVariant}
							>
								Name window
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={itemDisabled}
						inset={itemInset}
						variant={'destructive'}
					>
						Log out
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	},
	title: 'Client/Components/Dropdown Menu',
} satisfies Meta<DropdownMenuStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
