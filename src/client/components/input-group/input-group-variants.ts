import { cva } from 'class-variance-authority'

const INPUT_GROUP_ADDON_ALIGN_CLASSES = {
	'block-end':
		'order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2',
	'block-start':
		'order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2',
	'inline-end':
		'order-last pe-2 has-[>button]:me-[-0.3rem] has-[>kbd]:me-[-0.15rem]',
	'inline-start':
		'order-first ps-2 has-[>button]:ms-[-0.3rem] has-[>kbd]:ms-[-0.15rem]',
} as const

type InputGroupAddonAlign = keyof typeof INPUT_GROUP_ADDON_ALIGN_CLASSES

const INPUT_GROUP_ADDON_ALIGNS = Object.freeze(
	Object.keys(INPUT_GROUP_ADDON_ALIGN_CLASSES) as InputGroupAddonAlign[],
)

const inputGroupAddonVariants = cva(
	"flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-nui-muted-foreground text-sm font-medium select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--nui-radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
	{
		defaultVariants: {
			align: 'inline-start',
		},
		variants: {
			align: INPUT_GROUP_ADDON_ALIGN_CLASSES,
		},
	},
)

const INPUT_GROUP_BUTTON_SIZE_CLASSES = {
	'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
	'icon-xs': 'size-6 rounded-[calc(var(--nui-radius)-3px)] p-0 has-[>svg]:p-0',
	sm: '',
	xs: "h-6 gap-1 rounded-[calc(var(--nui-radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
} as const

type InputGroupButtonSize = keyof typeof INPUT_GROUP_BUTTON_SIZE_CLASSES

const INPUT_GROUP_BUTTON_SIZES = Object.freeze(
	Object.keys(INPUT_GROUP_BUTTON_SIZE_CLASSES) as InputGroupButtonSize[],
)

const inputGroupButtonVariants = cva(
	'flex items-center gap-2 text-sm shadow-none',
	{
		defaultVariants: {
			size: 'xs',
		},
		variants: {
			size: INPUT_GROUP_BUTTON_SIZE_CLASSES,
		},
	},
)

export {
	INPUT_GROUP_ADDON_ALIGNS,
	INPUT_GROUP_BUTTON_SIZES,
	type InputGroupAddonAlign,
	type InputGroupButtonSize,
	inputGroupAddonVariants,
	inputGroupButtonVariants,
}
