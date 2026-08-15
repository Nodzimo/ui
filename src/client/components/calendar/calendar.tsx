import { type ComponentProps, useEffect, useRef } from 'react'
import {
	type DayButton,
	DayPicker,
	getDefaultClassNames,
	type Locale,
} from 'react-day-picker'
import { Button, buttonVariants } from '#client/components/button'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '#core/icons'
import { mcn } from '#lib'

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'ghost',
	locale,
	formatters,
	components,
	...restProps
}: ComponentProps<typeof DayPicker> & {
	buttonVariant?: ComponentProps<typeof Button>['variant']
}) {
	const defaultClassNames = getDefaultClassNames()

	return (
		<DayPicker
			captionLayout={captionLayout}
			className={mcn(
				'group/calendar bg-nui-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent p-2 [--cell-radius:var(--radius-nui-md)] [--cell-size:--spacing(7)]',
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			classNames={{
				button_next: mcn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
					defaultClassNames.button_next,
				),
				button_previous: mcn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
					defaultClassNames.button_previous,
				),
				caption_label: mcn(
					'font-medium select-none',
					captionLayout === 'label'
						? 'cn-calendar-caption text-sm'
						: 'cn-calendar-caption-label flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-nui-muted-foreground',
					defaultClassNames.caption_label,
				),
				day: mcn(
					'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)',
					restProps.showWeekNumber
						? '[&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)'
						: '[&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)',
					defaultClassNames.day,
				),
				disabled: mcn(
					'text-nui-muted-foreground opacity-50',
					defaultClassNames.disabled,
				),
				dropdown: mcn(
					'absolute inset-0 bg-nui-popover opacity-0',
					defaultClassNames.dropdown,
				),
				dropdown_root: mcn(
					'cn-calendar-dropdown-root relative rounded-(--cell-radius)',
					defaultClassNames.dropdown_root,
				),
				dropdowns: mcn(
					'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
					defaultClassNames.dropdowns,
				),
				hidden: mcn('invisible', defaultClassNames.hidden),
				month: mcn('flex w-full flex-col gap-4', defaultClassNames.month),
				month_caption: mcn(
					'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
					defaultClassNames.month_caption,
				),
				month_grid: mcn('w-full border-collapse', defaultClassNames.month_grid),
				months: mcn(
					'relative flex flex-col gap-4 md:flex-row',
					defaultClassNames.months,
				),
				nav: mcn(
					'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
					defaultClassNames.nav,
				),
				outside: mcn(
					'text-nui-muted-foreground aria-selected:text-nui-muted-foreground',
					defaultClassNames.outside,
				),
				range_end: mcn(
					'relative isolate z-0 rounded-e-(--cell-radius) bg-nui-muted after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-nui-muted',
					defaultClassNames.range_end,
				),
				range_middle: mcn('rounded-none', defaultClassNames.range_middle),
				range_start: mcn(
					'relative isolate z-0 rounded-s-(--cell-radius) bg-nui-muted after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-nui-muted',
					defaultClassNames.range_start,
				),
				root: mcn('w-fit', defaultClassNames.root),
				today: mcn(
					'rounded-(--cell-radius) bg-nui-muted text-nui-foreground data-[selected=true]:rounded-none',
					defaultClassNames.today,
				),
				week: mcn('mt-2 flex w-full', defaultClassNames.week),
				week_number: mcn(
					'text-[0.8rem] text-nui-muted-foreground select-none',
					defaultClassNames.week_number,
				),
				week_number_header: mcn(
					'w-(--cell-size) select-none',
					defaultClassNames.week_number_header,
				),
				weekday: mcn(
					'flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-nui-muted-foreground select-none',
					defaultClassNames.weekday,
				),
				weekdays: mcn('flex', defaultClassNames.weekdays),
				...classNames,
			}}
			components={{
				Chevron: ({ className, orientation, ...restProps }) => {
					if (orientation === 'left') {
						return (
							<ChevronLeftIcon
								className={mcn('size-4 rtl:rotate-180', className)}
								{...restProps}
							/>
						)
					}

					if (orientation === 'right') {
						return (
							<ChevronRightIcon
								className={mcn('size-4 rtl:rotate-180', className)}
								{...restProps}
							/>
						)
					}

					return (
						<ChevronDownIcon
							className={mcn('size-4', className)}
							{...restProps}
						/>
					)
				},
				DayButton: ({ ...props }) => (
					<CalendarDayButton locale={locale} {...props} />
				),
				Root: ({ className, rootRef, ...restProps }) => {
					return (
						<div
							className={mcn(className)}
							data-slot={'calendar'}
							ref={rootRef}
							{...restProps}
						/>
					)
				},
				WeekNumber: ({ children, ...restProps }) => {
					return (
						<td {...restProps}>
							<div
								className={
									'flex size-(--cell-size) items-center justify-center text-center'
								}
							>
								{children}
							</div>
						</td>
					)
				},
				...components,
			}}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString(locale?.code, { month: 'short' }),
				...formatters,
			}}
			locale={locale}
			showOutsideDays={showOutsideDays}
			{...restProps}
		/>
	)
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	locale,
	...restProps
}: ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
	const defaultClassNames = getDefaultClassNames()
	const ref = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (modifiers.focused) {
			ref.current?.focus()
		}
	}, [modifiers.focused])

	return (
		<Button
			className={mcn(
				'relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none data-[range-end=true]:rounded-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-s-(--cell-radius) data-[range-end=true]:rounded-e-(--cell-radius) data-[range-end=true]:bg-nui-primary data-[range-middle=true]:bg-nui-muted data-[range-start=true]:bg-nui-primary data-[selected-single=true]:bg-nui-primary data-[range-end=true]:text-nui-primary-foreground data-[range-middle=true]:text-nui-foreground data-[range-start=true]:text-nui-primary-foreground data-[selected-single=true]:text-nui-primary-foreground group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-nui-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-nui-ring/50 dark:hover:text-nui-foreground [&>span]:text-xs [&>span]:opacity-70',
				defaultClassNames.day,
				className,
			)}
			data-day={day.date.toLocaleDateString(locale?.code)}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			data-range-start={modifiers.range_start}
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			size={'icon'}
			variant={'ghost'}
			{...restProps}
		/>
	)
}

export { Calendar, CalendarDayButton }
