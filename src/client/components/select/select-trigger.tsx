import { Select as SelectPrimitive } from '@base-ui/react/select'
import { ChevronDownIcon } from '#core/icons'
import { mcn } from '#lib'

const SELECT_TRIGGER_SIZES = Object.freeze(['default', 'sm'] as const)

type SelectTriggerSize = (typeof SELECT_TRIGGER_SIZES)[number]

type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
	size?: SelectTriggerSize
}

function SelectTrigger({
	className,
	size = 'default',
	children,
	...props
}: SelectTriggerProps) {
	return (
		<SelectPrimitive.Trigger
			className={mcn(
				"flex w-fit select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-nui-lg border border-nui-input bg-transparent py-2 ps-2.5 pe-2 text-sm outline-none transition-colors focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-nui-destructive aria-invalid:ring-3 aria-invalid:ring-nui-destructive/20 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-nui-md),10px)] data-placeholder:text-nui-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-nui-input/30 dark:aria-invalid:border-nui-destructive/50 dark:aria-invalid:ring-nui-destructive/40 dark:hover:bg-nui-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-size={size}
			data-slot={'select-trigger'}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon
				render={
					<ChevronDownIcon
						className={'pointer-events-none size-4 text-nui-muted-foreground'}
					/>
				}
			/>
		</SelectPrimitive.Trigger>
	)
}

export {
	SELECT_TRIGGER_SIZES,
	SelectTrigger,
	type SelectTriggerProps,
	type SelectTriggerSize,
}
