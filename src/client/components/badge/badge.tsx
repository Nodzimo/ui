import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import { mcn } from '#lib'

const BADGE_VARIANT_CLASSES = {
	default: [
		'bg-nui-primary text-nui-primary-foreground',
		'[a]:hover:bg-nui-primary/80',
	],
	destructive: [
		'bg-nui-destructive/10 text-nui-destructive focus-visible:ring-nui-destructive/20',
		'dark:bg-nui-destructive/20 dark:focus-visible:ring-nui-destructive/40',
		'[a]:hover:bg-nui-destructive/20',
	],
	ghost: [
		'hover:bg-nui-muted hover:text-nui-muted-foreground',
		'dark:hover:bg-nui-muted/50',
	],
	link: ['text-nui-primary underline-offset-4 hover:underline'],
	outline: [
		'border-nui-border text-nui-foreground',
		'[a]:hover:bg-nui-muted [a]:hover:text-nui-muted-foreground',
	],
	secondary: [
		'bg-nui-secondary text-nui-secondary-foreground',
		'[a]:hover:bg-nui-secondary/80',
	],
} as const

type BadgeVariant = keyof typeof BADGE_VARIANT_CLASSES

const BADGE_VARIANTS = Object.freeze(
	Object.keys(BADGE_VARIANT_CLASSES) as BadgeVariant[],
)

const badgeVariants = cva(
	[
		'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden',
		'rounded-nui-4xl border border-transparent px-2 py-0.5',
		'text-xs font-medium whitespace-nowrap transition-all',
		'focus-visible:border-nui-ring focus-visible:ring-[3px] focus-visible:ring-nui-ring/50',
		'has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5',
		'aria-invalid:border-nui-destructive aria-invalid:ring-nui-destructive/20',
		'dark:aria-invalid:ring-nui-destructive/40',
		'[&>svg]:pointer-events-none [&>svg]:size-3!',
	],
	{
		defaultVariants: {
			variant: 'default',
		},
		variants: {
			variant: {
				...BADGE_VARIANT_CLASSES,
			},
		},
	},
)

type BadgeProps = useRender.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants>

function Badge({
	className,
	variant = 'default',
	render,
	...restProps
}: BadgeProps) {
	return useRender({
		defaultTagName: 'span',
		props: mergeProps<'span'>(
			{
				className: mcn(badgeVariants({ variant }), className),
			},
			restProps,
		),
		render,
		state: {
			slot: 'badge',
			variant,
		},
	})
}

export {
	BADGE_VARIANTS,
	Badge,
	type BadgeProps,
	type BadgeVariant,
	badgeVariants,
}
