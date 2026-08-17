import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import type { ComponentProps } from 'react'
import { Button } from '#client/components/button'
import { XIcon } from '#core/icons'
import { mcn } from '#lib'

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
	return <DialogPrimitive.Root data-slot={'dialog'} {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
	return <DialogPrimitive.Trigger data-slot={'dialog-trigger'} {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
	return <DialogPrimitive.Portal data-slot={'dialog-portal'} {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
	return <DialogPrimitive.Close data-slot={'dialog-close'} {...props} />
}

function DialogOverlay({
	className,
	...restProps
}: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			className={mcn(
				'fixed inset-0 isolate z-50 bg-black/10 duration-100',
				'data-open:fade-in-0 data-closed:fade-out-0 data-closed:animate-out data-open:animate-in',
				'supports-backdrop-filter:backdrop-blur-xs',
				className,
			)}
			data-slot={'dialog-overlay'}
			{...restProps}
		/>
	)
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	...restProps
}: DialogPrimitive.Popup.Props & {
	showCloseButton?: boolean
}) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Popup
				className={mcn(
					'fixed inset-s-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)]',
					'-translate-x-1/2 -translate-y-1/2 gap-4 p-4',
					'rounded-nui-xl bg-nui-popover text-nui-popover-foreground text-sm outline-none ring-1 ring-nui-foreground/10',
					'data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:animate-out data-open:animate-in',
					'duration-100 sm:max-w-sm',
					className,
				)}
				data-slot={'dialog-content'}
				{...restProps}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot={'dialog-close'}
						render={
							<Button
								className={'absolute inset-e-2 top-2'}
								size={'icon-sm'}
								variant={'ghost'}
							>
								<XIcon />
								<span className={'sr-only'}>Close</span>
							</Button>
						}
					/>
				)}
			</DialogPrimitive.Popup>
		</DialogPortal>
	)
}

function DialogHeader({ className, ...restProps }: ComponentProps<'div'>) {
	return (
		<div
			className={mcn('flex flex-col gap-2', className)}
			data-slot={'dialog-header'}
			{...restProps}
		/>
	)
}

function DialogFooter({
	className,
	showCloseButton = false,
	children,
	...restProps
}: ComponentProps<'div'> & {
	showCloseButton?: boolean
}) {
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

function DialogTitle({ className, ...restProps }: DialogPrimitive.Title.Props) {
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

function DialogDescription({
	className,
	...restProps
}: DialogPrimitive.Description.Props) {
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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
}
