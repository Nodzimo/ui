import { IconGallery, IconItem } from '@storybook/addon-docs/blocks'
import type { ComponentType, SVGProps } from 'react'
import * as lucideIcons from '#core/icons/generated/lucide'
import { mcn } from '#lib'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
type IconGroup = Record<string, IconComponent>

const { HeartIcon, LoaderPinwheelIcon, LoaderIcon, LoaderCircleIcon } =
	lucideIcons

const FILLABLE_ICONS = { HeartIcon } satisfies IconGroup

const SPINNABLE_ICONS = {
	LoaderCircleIcon,
	LoaderIcon,
	LoaderPinwheelIcon,
} satisfies IconGroup

const ICON_POSTFIX = 'Icon'

function getIconLabel(name: string) {
	const nameWithoutPostfix = name.endsWith(ICON_POSTFIX)
		? name.slice(0, -ICON_POSTFIX.length)
		: name

	return nameWithoutPostfix.split(/(?=[A-Z])/).join(' ')
}

type IconPreviewOptions = {
	filled?: boolean
	spinning?: boolean
}

function renderIconGallery(
	iconGroup: IconGroup,
	{ filled, spinning }: IconPreviewOptions = {},
) {
	const iconItems = Object.entries(iconGroup).map(
		([name, Icon]: [string, IconComponent]) => {
			return (
				<IconItem key={name} name={getIconLabel(name)}>
					<Icon
						className={mcn(
							filled && 'fill-nui-primary text-nui-primary hover:fill-none',
							spinning && 'animate-spin hover:animate-none',
						)}
					/>
				</IconItem>
			)
		},
	)

	return <IconGallery>{iconItems}</IconGallery>
}

export function LucideIcons() {
	return renderIconGallery(lucideIcons)
}

export function FillableIcons() {
	return renderIconGallery(FILLABLE_ICONS, { filled: true })
}

export function SpinnableIcons() {
	return renderIconGallery(SPINNABLE_ICONS, { spinning: true })
}
