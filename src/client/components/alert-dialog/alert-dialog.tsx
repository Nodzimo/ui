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
	AlertDialog,
	AlertDialogAction,
	type AlertDialogActionProps,
	AlertDialogCancel,
	type AlertDialogCancelProps,
	AlertDialogDescription,
	type AlertDialogDescriptionProps,
	AlertDialogFooter,
	type AlertDialogFooterProps,
	AlertDialogHeader,
	type AlertDialogHeaderProps,
	AlertDialogMedia,
	type AlertDialogMediaProps,
	type AlertDialogProps,
	AlertDialogTitle,
	type AlertDialogTitleProps,
	AlertDialogTrigger,
	type AlertDialogTriggerProps,
}
