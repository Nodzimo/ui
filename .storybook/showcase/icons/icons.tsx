import { IconGallery, IconItem } from '@storybook/addon-docs/blocks'
import type { ComponentType, SVGProps } from 'react'
import * as flagIcons from '#core/icons/generated/flags'
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
	CctvIcon,
	PauseIcon,
	SquareIcon,
	PlayIcon,
	StepForwardIcon,
	StepBackIcon,
	SettingsIcon,
	Settings2Icon,
	SmartphoneIcon,
	CameraIcon,
	ChefHatIcon,
	ScanEyeIcon,
	CircleEllipsisIcon,
	SunMediumIcon,
	SunDimIcon,
	BrushCleaningIcon,
	BugIcon,
	CircleDashedIcon,
} = lucideIcons

const FILLABLE_ICONS = {
	BrushCleaningIcon,
	BugIcon,
	CameraIcon,
	CctvIcon,
	ChefHatIcon,
	HeartIcon,
	KeyRoundIcon,
	MonitorIcon,
	MoonIcon,
	PauseIcon,
	PlayIcon,
	ScanEyeIcon,
	Settings2Icon,
	SmartphoneIcon,
	SquareIcon,
	StarIcon,
	StepBackIcon,
	StepForwardIcon,
	SunDimIcon,
	SunIcon,
	SunMediumIcon,
	Trash2Icon,
} satisfies IconGroup

const SPINNABLE_ICONS = {
	CircleDashedIcon,
	CircleEllipsisIcon,
	LoaderCircleIcon,
	LoaderIcon,
	LoaderPinwheelIcon,
	SettingsIcon,
	SunDimIcon,
	SunIcon,
	SunMediumIcon,
} satisfies IconGroup

const ICON_POSTFIXES = ['FlagIcon', 'Icon'] as const
const ICON_LABEL_PART_PATTERN = /(?=[A-Z])|(?<=[A-Za-z])(?=\d)/

function getIconLabel(name: string) {
	const postfix = ICON_POSTFIXES.find((postfix) => {
		return name.length > postfix.length && name.endsWith(postfix)
	})

	const nameWithoutPostfix = postfix ? name.slice(0, -postfix.length) : name

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

	// noinspection com.intellij.reactbuddy.ArrayToJSXMapInspection
	return <IconGallery>{iconItems}</IconGallery>
}

export function LucideIcons() {
	return renderIconGallery(lucideIcons)
}

export function FlagIcons() {
	return renderIconGallery(flagIcons)
}

export function FillableIcons() {
	return renderIconGallery(FILLABLE_ICONS, { filled: true })
}

export function SpinnableIcons() {
	return renderIconGallery(SPINNABLE_ICONS, { spinning: true })
}
