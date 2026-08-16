import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { mcn } from '#lib'

type RadioGroupProps = RadioGroupPrimitive.Props

function RadioGroup({ className, ...restProps }: RadioGroupProps) {
	return (
		<RadioGroupPrimitive
			className={mcn('grid w-full gap-2', className)}
			data-slot={'radio-group'}
			{...restProps}
		/>
	)
}

type RadioGroupItemProps = RadioPrimitive.Root.Props

function RadioGroupItem({ className, ...restProps }: RadioGroupItemProps) {
	return (
		<RadioPrimitive.Root
			className={mcn(
				'group/radio-group-item peer relative flex aspect-square size-4 shrink-0',
				'rounded-full border border-nui-input outline-none',
				'after:absolute after:-inset-x-3 after:-inset-y-2',
				'focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50',
				'disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50',
				'aria-invalid:border-nui-destructive aria-invalid:ring-3 aria-invalid:ring-nui-destructive/20 aria-invalid:aria-checked:border-nui-primary',
				'data-checked:border-nui-primary data-checked:bg-nui-primary data-checked:text-nui-primary-foreground',
				'dark:bg-nui-input/30 dark:data-checked:bg-nui-primary dark:aria-invalid:border-nui-destructive/50 dark:aria-invalid:ring-nui-destructive/40',
				className,
			)}
			data-slot={'radio-group-item'}
			{...restProps}
		>
			<RadioPrimitive.Indicator
				className={'flex size-4 items-center justify-center'}
				data-slot={'radio-group-indicator'}
			>
				<span
					className={
						'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nui-primary-foreground'
					}
				/>
			</RadioPrimitive.Indicator>
		</RadioPrimitive.Root>
	)
}

export {
	RadioGroup,
	RadioGroupItem,
	type RadioGroupItemProps,
	type RadioGroupProps,
}
