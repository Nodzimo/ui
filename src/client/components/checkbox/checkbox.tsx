import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckIcon, MinusIcon } from '#core/icons'
import { mcn } from '#lib'

type CheckboxProps = CheckboxPrimitive.Root.Props

function Checkbox({ className, ...restProps }: CheckboxProps) {
	return (
		<CheckboxPrimitive.Root
			className={mcn(
				'peer relative flex size-4 shrink-0 items-center justify-center',
				'rounded-nui-sm border border-nui-input outline-none transition-colors',
				'after:absolute after:-inset-x-3 after:-inset-y-2',
				'focus-visible:border-nui-ring focus-visible:ring-3 focus-visible:ring-nui-ring/50',
				'disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50',
				'aria-invalid:border-nui-destructive aria-invalid:ring-3 aria-invalid:ring-nui-destructive/20 aria-invalid:aria-checked:border-nui-primary aria-invalid:data-indeterminate:border-nui-primary',
				'data-checked:border-nui-primary data-checked:bg-nui-primary data-checked:text-nui-primary-foreground',
				'data-indeterminate:border-nui-primary data-indeterminate:bg-nui-primary data-indeterminate:text-nui-primary-foreground',
				'dark:bg-nui-input/30 dark:data-checked:bg-nui-primary dark:data-indeterminate:bg-nui-primary dark:aria-invalid:border-nui-destructive/50 dark:aria-invalid:ring-nui-destructive/40',
				'group-has-disabled/field:opacity-50',
				className,
			)}
			data-slot={'checkbox'}
			{...restProps}
		>
			<CheckboxPrimitive.Indicator
				className={
					'group/checkbox-indicator grid place-content-center text-current transition-none [&>svg]:size-3.5'
				}
				data-slot={'checkbox-indicator'}
			>
				<CheckIcon
					className={'group-data-indeterminate/checkbox-indicator:hidden'}
				/>
				<MinusIcon
					className={'hidden group-data-indeterminate/checkbox-indicator:block'}
				/>
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

export { Checkbox, type CheckboxProps }
