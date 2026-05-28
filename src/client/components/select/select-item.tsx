import { Select as SelectPrimitive } from '@base-ui/react/select'
import { CheckIcon } from '#core/icons'
import { mcn } from '#lib'

export type SelectItemProps = SelectPrimitive.Item.Props

export function SelectItem({ className, children, ...props }: SelectItemProps) {
	return (
		<SelectPrimitive.Item
			className={mcn(
				"relative flex w-full cursor-default select-none items-center gap-1.5 rounded-nui-md py-1 ps-1.5 pe-8 text-sm outline-hidden focus:bg-nui-accent focus:text-nui-accent-foreground not-data-[variant=destructive]:focus:**:text-nui-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				className,
			)}
			data-slot={'select-item'}
			{...props}
		>
			<SelectPrimitive.ItemText
				className={'flex flex-1 shrink-0 gap-2 whitespace-nowrap'}
			>
				{children}
			</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator
				render={
					<span
						className={
							'pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center'
						}
					>
						<CheckIcon className={'pointer-events-none'} />
					</span>
				}
			/>
		</SelectPrimitive.Item>
	)
}
