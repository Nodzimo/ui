import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import type { ComponentProps } from 'react'
import { Button, type ButtonProps } from '#client/components/button'
import { mcn } from '#lib'

type AlertDialogProps = AlertDialogPrimitive.Root.Props

function AlertDialog({ ...props }: AlertDialogProps) {
	return <AlertDialogPrimitive.Root data-slot={'alert-dialog'} {...props} />
}

type AlertDialogTriggerProps = AlertDialogPrimitive.Trigger.Props

function AlertDialogTrigger({ ...props }: AlertDialogTriggerProps) {
	return (
		<AlertDialogPrimitive.Trigger
			data-slot={'alert-dialog-trigger'}
			{...props}
		/>
	)
}

type AlertDialogPortalProps = AlertDialogPrimitive.Portal.Props

function AlertDialogPortal({ ...props }: AlertDialogPortalProps) {
	return (
		<AlertDialogPrimitive.Portal data-slot={'alert-dialog-portal'} {...props} />
	)
}

type AlertDialogOverlayProps = AlertDialogPrimitive.Backdrop.Props

function AlertDialogOverlay({
	className,
	...restProps
}: AlertDialogOverlayProps) {
	return (
		<AlertDialogPrimitive.Backdrop
			className={mcn(
				'fixed inset-0 isolate z-50',
				'bg-black/10',
				'data-open:fade-in-0 data-closed:fade-out-0',
				'data-closed:animate-out data-open:animate-in',
				'duration-100 supports-backdrop-filter:backdrop-blur-xs',
				className,
			)}
			data-slot={'alert-dialog-overlay'}
			{...restProps}
		/>
	)
}

const ALERT_DIALOG_CONTENT_SIZES = Object.freeze(['default', 'sm'] as const)

type AlertDialogContentSize = (typeof ALERT_DIALOG_CONTENT_SIZES)[number]

type AlertDialogContentProps = AlertDialogPrimitive.Popup.Props & {
	size?: AlertDialogContentSize
}

function AlertDialogContent({
	className,
	size = 'default',
	...restProps
}: AlertDialogContentProps) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Popup
				className={mcn(
					'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full',
					'-translate-x-1/2 -translate-y-1/2 gap-4 p-4',
					'rounded-nui-xl outline-none ring-1 ring-nui-foreground/10',
					'bg-nui-popover text-nui-popover-foreground',
					'data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95',
					'data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-closed:animate-out data-open:animate-in',
					'duration-100 data-[size=default]:sm:max-w-sm',
					className,
				)}
				data-size={size}
				data-slot={'alert-dialog-content'}
				{...restProps}
			/>
		</AlertDialogPortal>
	)
}

type AlertDialogHeaderProps = ComponentProps<'div'>

function AlertDialogHeader({
	className,
	...restProps
}: AlertDialogHeaderProps) {
	return (
		<div
			className={mcn(
				'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center',
				'has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4',
				'sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-start',
				'sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
				className,
			)}
			data-slot={'alert-dialog-header'}
			{...restProps}
		/>
	)
}

type AlertDialogFooterProps = ComponentProps<'div'>

function AlertDialogFooter({
	className,
	...restProps
}: AlertDialogFooterProps) {
	return (
		<div
			className={mcn(
				'-mx-4 -mb-4 flex flex-col-reverse gap-2 p-4',
				'rounded-b-nui-xl border-t',
				'bg-nui-muted/50',
				'group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2',
				'sm:flex-row sm:justify-end',
				className,
			)}
			data-slot={'alert-dialog-footer'}
			{...restProps}
		/>
	)
}

type AlertDialogMediaProps = ComponentProps<'div'>

function AlertDialogMedia({ className, ...restProps }: AlertDialogMediaProps) {
	return (
		<div
			className={mcn(
				'mb-2 inline-flex size-10 items-center justify-center',
				'rounded-nui-md',
				'bg-nui-muted',
				'sm:group-data-[size=default]/alert-dialog-content:row-span-2',
				"*:[svg:not([class*='size-'])]:size-6",
				className,
			)}
			data-slot={'alert-dialog-media'}
			{...restProps}
		/>
	)
}

type AlertDialogTitleProps = AlertDialogPrimitive.Title.Props

function AlertDialogTitle({ className, ...restProps }: AlertDialogTitleProps) {
	return (
		<AlertDialogPrimitive.Title
			className={mcn(
				'font-medium font-nui-heading text-base',
				'sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
				className,
			)}
			data-slot={'alert-dialog-title'}
			{...restProps}
		/>
	)
}

type AlertDialogDescriptionProps = AlertDialogPrimitive.Description.Props

function AlertDialogDescription({
	className,
	...restProps
}: AlertDialogDescriptionProps) {
	return (
		<AlertDialogPrimitive.Description
			className={mcn(
				'text-balance text-nui-muted-foreground text-sm',
				'md:text-pretty',
				'*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-nui-foreground',
				className,
			)}
			data-slot={'alert-dialog-description'}
			{...restProps}
		/>
	)
}

type AlertDialogActionProps = ButtonProps

function AlertDialogAction({
	className,
	...restProps
}: AlertDialogActionProps) {
	return (
		<Button
			className={mcn(className)}
			data-slot={'alert-dialog-action'}
			{...restProps}
		/>
	)
}

type AlertDialogCancelProps = AlertDialogPrimitive.Close.Props &
	Pick<ButtonProps, 'variant' | 'size'>

function AlertDialogCancel({
	className,
	variant = 'outline',
	size = 'default',
	...restProps
}: AlertDialogCancelProps) {
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
	ALERT_DIALOG_CONTENT_SIZES,
	AlertDialog,
	AlertDialogAction,
	type AlertDialogActionProps,
	AlertDialogCancel,
	type AlertDialogCancelProps,
	AlertDialogContent,
	type AlertDialogContentProps,
	type AlertDialogContentSize,
	AlertDialogDescription,
	type AlertDialogDescriptionProps,
	AlertDialogFooter,
	type AlertDialogFooterProps,
	AlertDialogHeader,
	type AlertDialogHeaderProps,
	AlertDialogMedia,
	type AlertDialogMediaProps,
	AlertDialogOverlay,
	type AlertDialogOverlayProps,
	AlertDialogPortal,
	type AlertDialogPortalProps,
	type AlertDialogProps,
	AlertDialogTitle,
	type AlertDialogTitleProps,
	AlertDialogTrigger,
	type AlertDialogTriggerProps,
}
