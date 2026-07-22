'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import type { ComponentProps } from 'react'
import { CheckIcon, ChevronRightIcon } from '#core/icons'
import { mcn } from '#lib'

type DropdownMenuProps = MenuPrimitive.Root.Props

function DropdownMenu({ ...restProps }: DropdownMenuProps) {
	return <MenuPrimitive.Root data-slot={'dropdown-menu'} {...restProps} />
}

type DropdownMenuPortalProps = MenuPrimitive.Portal.Props

function DropdownMenuPortal({ ...restProps }: DropdownMenuPortalProps) {
	return (
		<MenuPrimitive.Portal data-slot={'dropdown-menu-portal'} {...restProps} />
	)
}

type DropdownMenuTriggerProps = MenuPrimitive.Trigger.Props

function DropdownMenuTrigger({ ...restProps }: DropdownMenuTriggerProps) {
	return (
		<MenuPrimitive.Trigger data-slot={'dropdown-menu-trigger'} {...restProps} />
	)
}

type DropdownMenuContentSide = NonNullable<
	MenuPrimitive.Positioner.Props['side']
>

const DROPDOWN_MENU_CONTENT_SIDES = Object.freeze([
	'top',
	'bottom',
	'left',
	'right',
	'inline-end',
	'inline-start',
] as const satisfies readonly DropdownMenuContentSide[])

type DropdownMenuContentAlign = NonNullable<
	MenuPrimitive.Positioner.Props['align']
>

const DROPDOWN_MENU_CONTENT_ALIGNS = Object.freeze([
	'start',
	'center',
	'end',
] as const satisfies readonly DropdownMenuContentAlign[])

type DropdownMenuContentProps = MenuPrimitive.Popup.Props &
	Pick<
		MenuPrimitive.Positioner.Props,
		'align' | 'alignOffset' | 'side' | 'sideOffset'
	>

function DropdownMenuContent({
	align = 'start',
	alignOffset = 0,
	side = 'bottom',
	sideOffset = 4,
	className,
	...restProps
}: DropdownMenuContentProps) {
	return (
		<MenuPrimitive.Portal>
			<MenuPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				className={'isolate z-50 outline-none'}
				side={side}
				sideOffset={sideOffset}
			>
				<MenuPrimitive.Popup
					className={mcn(
						'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-nui-lg bg-nui-popover p-1 text-nui-popover-foreground shadow-md outline-none ring-1 ring-nui-foreground/10 duration-100 data-closed:animate-out data-open:animate-in data-closed:overflow-hidden',
						className,
					)}
					data-slot={'dropdown-menu-content'}
					{...restProps}
				/>
			</MenuPrimitive.Positioner>
		</MenuPrimitive.Portal>
	)
}

type DropdownMenuGroupProps = MenuPrimitive.Group.Props

function DropdownMenuGroup({ ...restProps }: DropdownMenuGroupProps) {
	return (
		<MenuPrimitive.Group data-slot={'dropdown-menu-group'} {...restProps} />
	)
}

type DropdownMenuLabelProps = MenuPrimitive.GroupLabel.Props & {
	inset?: boolean
}

function DropdownMenuLabel({
	className,
	inset,
	...restProps
}: DropdownMenuLabelProps) {
	return (
		<MenuPrimitive.GroupLabel
			className={mcn(
				'px-1.5 py-1 font-medium text-nui-muted-foreground text-xs data-inset:ps-7',
				className,
			)}
			data-inset={inset}
			data-slot={'dropdown-menu-label'}
			{...restProps}
		/>
	)
}

const DROPDOWN_MENU_ITEM_VARIANTS = Object.freeze([
	'default',
	'destructive',
] as const)

type DropdownMenuItemVariant = (typeof DROPDOWN_MENU_ITEM_VARIANTS)[number]

type DropdownMenuItemProps = MenuPrimitive.Item.Props & {
	inset?: boolean
	variant?: DropdownMenuItemVariant
}

function DropdownMenuItem({
	className,
	inset,
	variant = 'default',
	...restProps
}: DropdownMenuItemProps) {
	return (
		<MenuPrimitive.Item
			className={mcn(
				"group/dropdown-menu-item relative flex cursor-default select-none items-center gap-1.5 rounded-nui-md px-1.5 py-1 text-sm outline-hidden focus:bg-nui-accent focus:text-nui-accent-foreground not-data-[variant=destructive]:focus:**:text-nui-accent-foreground data-disabled:pointer-events-none data-inset:ps-7 data-[variant=destructive]:text-nui-destructive data-disabled:opacity-50 data-[variant=destructive]:focus:bg-nui-destructive/10 data-[variant=destructive]:focus:text-nui-destructive dark:data-[variant=destructive]:focus:bg-nui-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-nui-destructive",
				className,
			)}
			data-inset={inset}
			data-slot={'dropdown-menu-item'}
			data-variant={variant}
			{...restProps}
		/>
	)
}

type DropdownMenuSubProps = MenuPrimitive.SubmenuRoot.Props

function DropdownMenuSub({ ...restProps }: DropdownMenuSubProps) {
	return (
		<MenuPrimitive.SubmenuRoot data-slot={'dropdown-menu-sub'} {...restProps} />
	)
}

type DropdownMenuSubTriggerProps = MenuPrimitive.SubmenuTrigger.Props & {
	inset?: boolean
}

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...restProps
}: DropdownMenuSubTriggerProps) {
	return (
		<MenuPrimitive.SubmenuTrigger
			className={mcn(
				"flex cursor-default select-none items-center gap-1.5 rounded-nui-md px-1.5 py-1 text-sm outline-hidden focus:bg-nui-accent focus:text-nui-accent-foreground not-data-[variant=destructive]:focus:**:text-nui-accent-foreground data-open:bg-nui-accent data-popup-open:bg-nui-accent data-inset:ps-7 data-open:text-nui-accent-foreground data-popup-open:text-nui-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-inset={inset}
			data-slot={'dropdown-menu-sub-trigger'}
			{...restProps}
		>
			{children}
			<ChevronRightIcon className={'ms-auto rtl:rotate-180'} />
		</MenuPrimitive.SubmenuTrigger>
	)
}

type DropdownMenuSubContentProps = ComponentProps<typeof DropdownMenuContent>

function DropdownMenuSubContent({
	align = 'start',
	alignOffset = -3,
	side = 'inline-end',
	sideOffset = 0,
	className,
	...restProps
}: DropdownMenuSubContentProps) {
	return (
		<DropdownMenuContent
			align={align}
			alignOffset={alignOffset}
			className={mcn(
				'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 w-auto min-w-24 rounded-nui-lg bg-nui-popover p-1 text-nui-popover-foreground shadow-lg ring-1 ring-nui-foreground/10 duration-100 data-closed:animate-out data-open:animate-in',
				className,
			)}
			data-slot={'dropdown-menu-sub-content'}
			side={side}
			sideOffset={sideOffset}
			{...restProps}
		/>
	)
}

type DropdownMenuCheckboxItemProps = MenuPrimitive.CheckboxItem.Props & {
	inset?: boolean
}

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	inset,
	...restProps
}: DropdownMenuCheckboxItemProps) {
	return (
		<MenuPrimitive.CheckboxItem
			checked={checked}
			className={mcn(
				"relative flex cursor-default select-none items-center gap-1.5 rounded-nui-md py-1 ps-1.5 pe-8 text-sm outline-hidden focus:bg-nui-accent focus:text-nui-accent-foreground focus:**:text-nui-accent-foreground data-disabled:pointer-events-none data-inset:ps-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-inset={inset}
			data-slot={'dropdown-menu-checkbox-item'}
			{...restProps}
		>
			<span
				className={
					'pointer-events-none absolute inset-e-2 flex items-center justify-center'
				}
				data-slot={'dropdown-menu-checkbox-item-indicator'}
			>
				<MenuPrimitive.CheckboxItemIndicator>
					<CheckIcon />
				</MenuPrimitive.CheckboxItemIndicator>
			</span>
			{children}
		</MenuPrimitive.CheckboxItem>
	)
}

type DropdownMenuRadioGroupProps = MenuPrimitive.RadioGroup.Props

function DropdownMenuRadioGroup({ ...restProps }: DropdownMenuRadioGroupProps) {
	return (
		<MenuPrimitive.RadioGroup
			data-slot={'dropdown-menu-radio-group'}
			{...restProps}
		/>
	)
}

type DropdownMenuRadioItemProps = MenuPrimitive.RadioItem.Props & {
	inset?: boolean
}

function DropdownMenuRadioItem({
	className,
	children,
	inset,
	...restProps
}: DropdownMenuRadioItemProps) {
	return (
		<MenuPrimitive.RadioItem
			className={mcn(
				"relative flex cursor-default select-none items-center gap-1.5 rounded-nui-md py-1 ps-1.5 pe-8 text-sm outline-hidden focus:bg-nui-accent focus:text-nui-accent-foreground focus:**:text-nui-accent-foreground data-disabled:pointer-events-none data-inset:ps-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-inset={inset}
			data-slot={'dropdown-menu-radio-item'}
			{...restProps}
		>
			<span
				className={
					'pointer-events-none absolute inset-e-2 flex items-center justify-center'
				}
				data-slot={'dropdown-menu-radio-item-indicator'}
			>
				<MenuPrimitive.RadioItemIndicator>
					<CheckIcon />
				</MenuPrimitive.RadioItemIndicator>
			</span>
			{children}
		</MenuPrimitive.RadioItem>
	)
}

type DropdownMenuSeparatorProps = MenuPrimitive.Separator.Props

function DropdownMenuSeparator({
	className,
	...restProps
}: DropdownMenuSeparatorProps) {
	return (
		<MenuPrimitive.Separator
			className={mcn('-mx-1 my-1 h-px bg-nui-border', className)}
			data-slot={'dropdown-menu-separator'}
			{...restProps}
		/>
	)
}

type DropdownMenuShortcutProps = ComponentProps<'span'>

function DropdownMenuShortcut({
	className,
	...restProps
}: DropdownMenuShortcutProps) {
	return (
		<span
			className={mcn(
				'ms-auto text-nui-muted-foreground text-xs tracking-widest group-focus/dropdown-menu-item:text-nui-accent-foreground',
				className,
			)}
			data-slot={'dropdown-menu-shortcut'}
			{...restProps}
		/>
	)
}

export {
	DROPDOWN_MENU_CONTENT_ALIGNS,
	DROPDOWN_MENU_CONTENT_SIDES,
	DROPDOWN_MENU_ITEM_VARIANTS,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	type DropdownMenuCheckboxItemProps,
	DropdownMenuContent,
	type DropdownMenuContentAlign,
	type DropdownMenuContentProps,
	type DropdownMenuContentSide,
	DropdownMenuGroup,
	type DropdownMenuGroupProps,
	DropdownMenuItem,
	type DropdownMenuItemProps,
	type DropdownMenuItemVariant,
	DropdownMenuLabel,
	type DropdownMenuLabelProps,
	DropdownMenuPortal,
	type DropdownMenuPortalProps,
	type DropdownMenuProps,
	DropdownMenuRadioGroup,
	type DropdownMenuRadioGroupProps,
	DropdownMenuRadioItem,
	type DropdownMenuRadioItemProps,
	DropdownMenuSeparator,
	type DropdownMenuSeparatorProps,
	DropdownMenuShortcut,
	type DropdownMenuShortcutProps,
	DropdownMenuSub,
	DropdownMenuSubContent,
	type DropdownMenuSubContentProps,
	type DropdownMenuSubProps,
	DropdownMenuSubTrigger,
	type DropdownMenuSubTriggerProps,
	DropdownMenuTrigger,
	type DropdownMenuTriggerProps,
}
