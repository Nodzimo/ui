import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import type { ComponentProps } from 'react'
import { Button } from '#client/components/button'
import { mcn } from '#lib'

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
	return <AlertDialogPrimitive.Root data-slot={'alert-dialog'} {...props} />
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
	return (
		<AlertDialogPrimitive.Trigger
			data-slot={'alert-dialog-trigger'}
			{...props}
		/>
	)
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
	return (
		<AlertDialogPrimitive.Portal data-slot={'alert-dialog-portal'} {...props} />
	)
}

function AlertDialogOverlay({
	className,
	...restProps
}: AlertDialogPrimitive.Backdrop.Props) {
	return (
		<AlertDialogPrimitive.Backdrop
			className={mcn(
				'data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs',
				className,
			)}
			data-slot={'alert-dialog-overlay'}
			{...restProps}
		/>
	)
}

function AlertDialogContent({
	className,
	size = 'default',
	...restProps
}: AlertDialogPrimitive.Popup.Props & {
	size?: 'default' | 'sm'
}) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Popup
				className={mcn(
					'group/alert-dialog-content data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-nui-xl bg-nui-popover p-4 text-nui-popover-foreground outline-none ring-1 ring-nui-foreground/10 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-closed:animate-out data-open:animate-in data-[size=default]:sm:max-w-sm',
					className,
				)}
				data-size={size}
				data-slot={'alert-dialog-content'}
				{...restProps}
			/>
		</AlertDialogPortal>
	)
}

function AlertDialogHeader({ className, ...restProps }: ComponentProps<'div'>) {
	return (
		<div
			className={mcn(
				'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
				className,
			)}
			data-slot={'alert-dialog-header'}
			{...restProps}
		/>
	)
}

function AlertDialogFooter({ className, ...restProps }: ComponentProps<'div'>) {
	return (
		<div
			className={mcn(
				'-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-nui-xl border-t bg-nui-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
				className,
			)}
			data-slot={'alert-dialog-footer'}
			{...restProps}
		/>
	)
}

function AlertDialogMedia({ className, ...restProps }: ComponentProps<'div'>) {
	return (
		<div
			className={mcn(
				"mb-2 inline-flex size-10 items-center justify-center rounded-nui-md bg-nui-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
				className,
			)}
			data-slot={'alert-dialog-media'}
			{...restProps}
		/>
	)
}

function AlertDialogTitle({
	className,
	...restProps
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			className={mcn(
				'font-medium font-nui-heading text-base sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
				className,
			)}
			data-slot={'alert-dialog-title'}
			{...restProps}
		/>
	)
}

function AlertDialogDescription({
	className,
	...restProps
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			className={mcn(
				'text-balance text-nui-muted-foreground text-sm md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-nui-foreground',
				className,
			)}
			data-slot={'alert-dialog-description'}
			{...restProps}
		/>
	)
}

function AlertDialogAction({
	className,
	...restProps
}: ComponentProps<typeof Button>) {
	return (
		<Button
			className={mcn(className)}
			data-slot={'alert-dialog-action'}
			{...restProps}
		/>
	)
}

function AlertDialogCancel({
	className,
	variant = 'outline',
	size = 'default',
	...restProps
}: AlertDialogPrimitive.Close.Props &
	Pick<ComponentProps<typeof Button>, 'variant' | 'size'>) {
	return (
		<AlertDialogPrimitive.Close
			className={mcn(className)}
			data-slot={'alert-dialog-cancel'}
			render={<Button size={size} variant={variant} />}
			{...restProps}
		/>
	)
}

export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
	AlertDialogTrigger,
}
