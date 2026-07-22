import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import type { ComponentProps } from 'react'
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
	DropdownMenu,
	DropdownMenuGroup,
	type DropdownMenuGroupProps,
	DropdownMenuLabel,
	type DropdownMenuLabelProps,
	DropdownMenuPortal,
	type DropdownMenuPortalProps,
	type DropdownMenuProps,
	DropdownMenuSeparator,
	type DropdownMenuSeparatorProps,
	DropdownMenuShortcut,
	type DropdownMenuShortcutProps,
	DropdownMenuTrigger,
	type DropdownMenuTriggerProps,
}
