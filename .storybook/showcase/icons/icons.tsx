import { IconGallery, IconItem } from '@storybook/addon-docs/blocks'
import type { ComponentType, SVGProps } from 'react'
import * as lucideIcons from '#core/icons/generated/lucide'

const ICON_POSTFIX = 'Icon'

function getIconLabel(name: string) {
	const nameWithoutPostfix = name.endsWith(ICON_POSTFIX)
		? name.slice(0, -ICON_POSTFIX.length)
		: name

	return nameWithoutPostfix.split(/(?=[A-Z])/).join(' ')
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
type IconGroup = Record<string, IconComponent>

function renderIconGallery(iconGroup: IconGroup) {
	const iconItems = Object.entries(iconGroup).map(
		([name, Icon]: [string, IconComponent]) => {
			return (
				<IconItem key={name} name={getIconLabel(name)}>
					<Icon />
				</IconItem>
			)
		},
	)

	return <IconGallery>{iconItems}</IconGallery>
}

export function LucideIcons() {
	return renderIconGallery(lucideIcons)
}
