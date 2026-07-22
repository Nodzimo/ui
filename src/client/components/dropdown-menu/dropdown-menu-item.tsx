import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { CheckIcon } from '#core/icons'
import { mcn } from '#lib'

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

export {
	DROPDOWN_MENU_ITEM_VARIANTS,
	DropdownMenuCheckboxItem,
	type DropdownMenuCheckboxItemProps,
	DropdownMenuItem,
	type DropdownMenuItemProps,
	type DropdownMenuItemVariant,
	DropdownMenuRadioGroup,
	type DropdownMenuRadioGroupProps,
	DropdownMenuRadioItem,
	type DropdownMenuRadioItemProps,
}
