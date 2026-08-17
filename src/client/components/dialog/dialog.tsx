import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import type { ComponentProps } from 'react'
import { Button } from '#client/components/button'
import { mcn } from '#lib'

type DialogProps = DialogPrimitive.Root.Props

type DialogModal = NonNullable<DialogProps['modal']>

const DIALOG_MODAL_MODES = Object.freeze([
	true,
	false,
	'trap-focus',
] as const satisfies readonly DialogModal[])

function Dialog({ ...props }: DialogProps) {
	return <DialogPrimitive.Root data-slot={'dialog'} {...props} />
}

type DialogTriggerProps = DialogPrimitive.Trigger.Props

function DialogTrigger({ ...props }: DialogTriggerProps) {
	return <DialogPrimitive.Trigger data-slot={'dialog-trigger'} {...props} />
}

type DialogCloseProps = DialogPrimitive.Close.Props

function DialogClose({ ...props }: DialogCloseProps) {
	return <DialogPrimitive.Close data-slot={'dialog-close'} {...props} />
}

type DialogHeaderProps = ComponentProps<'div'>

function DialogHeader({ className, ...restProps }: DialogHeaderProps) {
	return (
		<div
			className={mcn('flex flex-col gap-2', className)}
			data-slot={'dialog-header'}
			{...restProps}
		/>
	)
}

type DialogFooterProps = ComponentProps<'div'> & {
	showCloseButton?: boolean
}

function DialogFooter({
	className,
	showCloseButton = false,
	children,
	...restProps
}: DialogFooterProps) {
	return (
		<div
			className={mcn(
				'-mx-4 -mb-4 flex flex-col-reverse gap-2 p-4',
				'rounded-b-nui-xl border-t bg-nui-muted/50',
				'sm:flex-row sm:justify-end',
				className,
			)}
			data-slot={'dialog-footer'}
			{...restProps}
		>
			{children}
			{showCloseButton && (
				<DialogPrimitive.Close
					render={<Button variant={'outline'}>Close</Button>}
				/>
			)}
		</div>
	)
}

type DialogTitleProps = DialogPrimitive.Title.Props

function DialogTitle({ className, ...restProps }: DialogTitleProps) {
	return (
		<DialogPrimitive.Title
			className={mcn(
				'font-medium font-nui-heading text-base leading-none',
				className,
			)}
			data-slot={'dialog-title'}
			{...restProps}
		/>
	)
}

type DialogDescriptionProps = DialogPrimitive.Description.Props

function DialogDescription({
	className,
	...restProps
}: DialogDescriptionProps) {
	return (
		<DialogPrimitive.Description
			className={mcn(
				'text-nui-muted-foreground text-sm',
				'*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-nui-foreground',
				className,
			)}
			data-slot={'dialog-description'}
			{...restProps}
		/>
	)
}

export {
	DIALOG_MODAL_MODES,
	Dialog,
	DialogClose,
	type DialogCloseProps,
	DialogDescription,
	type DialogDescriptionProps,
	DialogFooter,
	type DialogFooterProps,
	DialogHeader,
	type DialogHeaderProps,
	type DialogModal,
	type DialogProps,
	DialogTitle,
	type DialogTitleProps,
	DialogTrigger,
	type DialogTriggerProps,
}
