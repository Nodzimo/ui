import { cva } from 'class-variance-authority'

const BUTTON_VARIANT_CLASSES = {
	default: 'bg-nui-primary text-nui-primary-foreground hover:bg-nui-primary/80',
	destructive: [
		'bg-nui-destructive/10 text-nui-destructive',
		'hover:bg-nui-destructive/20',
		'focus-visible:border-nui-destructive/40 focus-visible:ring-nui-destructive/20',
		'dark:bg-nui-destructive/20 dark:hover:bg-nui-destructive/30 dark:focus-visible:ring-nui-destructive/40',
	],
	ghost: [
		'hover:bg-nui-muted hover:text-nui-foreground',
		'aria-expanded:bg-nui-muted aria-expanded:text-nui-foreground',
		'dark:hover:bg-nui-muted/50',
	],
	link: 'nui-link',
	outline: [
		'border-nui-border bg-nui-background',
		'hover:bg-nui-muted hover:text-nui-foreground',
		'aria-expanded:bg-nui-muted aria-expanded:text-nui-foreground',
		'dark:border-nui-input dark:bg-nui-input/30 dark:hover:bg-nui-input/50',
	],
	secondary: [
		'bg-nui-secondary text-nui-secondary-foreground',
		'hover:bg-nui-secondary/80',
		'aria-expanded:bg-nui-secondary aria-expanded:text-nui-secondary-foreground',
	],
} as const

const BUTTON_SIZE_CLASSES = {
	default:
		'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
	icon: 'size-8',
	'icon-lg': 'size-9',
	'icon-sm':
		'size-7 rounded-[min(var(--radius-nui-md),12px)] in-data-[slot=button-group]:rounded-nui-lg',
	'icon-xs': [
		'size-6 rounded-[min(var(--radius-nui-md),10px)]',
		'in-data-[slot=button-group]:rounded-nui-lg',
		"[&_svg:not([class*='size-'])]:size-3",
	],
	lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
	sm: [
		'h-7 gap-1 px-2.5',
		'text-[0.8rem]',
		'rounded-[min(var(--radius-nui-md),12px)]',
		'has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 in-data-[slot=button-group]:rounded-nui-lg',
		"[&_svg:not([class*='size-'])]:size-3.5",
	],
	xs: [
		'h-6 gap-1 px-2',
		'text-xs',
		'rounded-[min(var(--radius-nui-md),10px)]',
		'has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 in-data-[slot=button-group]:rounded-nui-lg',
		"[&_svg:not([class*='size-'])]:size-3",
	],
} as const

type ButtonVariant = keyof typeof BUTTON_VARIANT_CLASSES
type ButtonSize = keyof typeof BUTTON_SIZE_CLASSES

const BUTTON_VARIANTS = Object.freeze(
	Object.keys(BUTTON_VARIANT_CLASSES) as ButtonVariant[],
)

const BUTTON_SIZES = Object.freeze(
	Object.keys(BUTTON_SIZE_CLASSES) as ButtonSize[],
)

const buttonVariants = cva(
	[
		'group/button inline-flex shrink-0 items-center justify-center',
		'select-none whitespace-nowrap text-sm font-medium',
		'rounded-nui-lg border border-transparent outline-none',
		'bg-clip-padding transition-all',
		'focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50',
		'active:not-aria-[haspopup]:translate-y-px',
		'disabled:pointer-events-none disabled:opacity-50',
		'aria-invalid:border-nui-destructive aria-invalid:ring-3 aria-invalid:ring-nui-destructive/20',
		'dark:aria-invalid:border-nui-destructive/50 dark:aria-invalid:ring-nui-destructive/40',
		"[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	],
	{
		defaultVariants: {
			size: 'default',
			variant: 'default',
		},
		variants: {
			size: BUTTON_SIZE_CLASSES,
			variant: BUTTON_VARIANT_CLASSES,
		},
	},
)

export {
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	type ButtonSize,
	type ButtonVariant,
	buttonVariants,
}
