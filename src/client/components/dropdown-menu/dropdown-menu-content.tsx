import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import type { ComponentProps } from 'react'
import { ChevronRightIcon } from '#core/icons'
import { mcn } from '#lib'

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
			data-inset={inset || undefined}
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

export {
	DROPDOWN_MENU_CONTENT_ALIGNS,
	DROPDOWN_MENU_CONTENT_SIDES,
	DropdownMenuContent,
	type DropdownMenuContentAlign,
	type DropdownMenuContentProps,
	type DropdownMenuContentSide,
	DropdownMenuSub,
	DropdownMenuSubContent,
	type DropdownMenuSubContentProps,
	type DropdownMenuSubProps,
	DropdownMenuSubTrigger,
	type DropdownMenuSubTriggerProps,
}
