import { IconGallery, IconItem } from '@storybook/addon-docs/blocks'
import type { ComponentType, SVGProps } from 'react'
import * as lucideIcons from '#core/icons/generated/lucide'
import { mcn } from '#lib'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
type IconGroup = Record<string, IconComponent>

const {
	HeartIcon,
	LoaderPinwheelIcon,
	LoaderIcon,
	LoaderCircleIcon,
	KeyRoundIcon,
	StarIcon,
	Trash2Icon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
} = lucideIcons

const FILLABLE_ICONS = {
	HeartIcon,
	KeyRoundIcon,
	MonitorIcon,
	MoonIcon,
	StarIcon,
	SunIcon,
	Trash2Icon,
} satisfies IconGroup

const SPINNABLE_ICONS = {
	LoaderCircleIcon,
	LoaderIcon,
	LoaderPinwheelIcon,
	SunIcon,
} satisfies IconGroup

const ICON_POSTFIX = 'Icon'
const ICON_LABEL_PART_PATTERN = /(?=[A-Z])|(?<=[A-Za-z])(?=\d)/

function getIconLabel(name: string) {
	const nameWithoutPostfix = name.endsWith(ICON_POSTFIX)
		? name.slice(0, -ICON_POSTFIX.length)
		: name

	return nameWithoutPostfix.split(ICON_LABEL_PART_PATTERN).join(' ')
}

type IconPreviewOptions = {
	filled?: boolean
	spinning?: boolean
}

type IconItemEntry = {
	Icon: IconComponent
	label: string
	name: string
}

function renderIconGallery(
	iconGroup: IconGroup,
	{ filled, spinning }: IconPreviewOptions = {},
) {
	const iconEntries: IconItemEntry[] = Object.entries(iconGroup).map(
		([name, Icon]): IconItemEntry => {
			return { Icon, label: getIconLabel(name), name }
		},
	)

	const sortedIconEntries: IconItemEntry[] = iconEntries.toSorted(
		({ label: leftIconLabel }, { label: rightIconLabel }) => {
			if (leftIconLabel === rightIconLabel) {
				return 0
			}

			return leftIconLabel > rightIconLabel ? 1 : -1
		},
	)

	const iconItems = sortedIconEntries.map(({ Icon, label, name }) => {
		return (
			<IconItem key={name} name={label}>
				<Icon
					className={mcn(
						filled &&
							'fill-nui-primary text-nui-primary hover:fill-none active:fill-none',
						spinning &&
							'hover:nui-animate-paused active:nui-animate-paused animate-spin',
					)}
				/>
			</IconItem>
		)
	})

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
