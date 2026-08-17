import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Button } from '#client/components/button'
import { XIcon } from '#core/icons'
import { mcn } from '#lib'

type DialogPortalProps = DialogPrimitive.Portal.Props

function DialogPortal({ ...props }: DialogPortalProps) {
	return <DialogPrimitive.Portal data-slot={'dialog-portal'} {...props} />
}

type DialogOverlayProps = DialogPrimitive.Backdrop.Props

function DialogOverlay({ className, ...restProps }: DialogOverlayProps) {
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

type DialogContentProps = DialogPrimitive.Popup.Props & {
	showCloseButton?: boolean
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	...restProps
}: DialogContentProps) {
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

export {
	DialogContent,
	type DialogContentProps,
	DialogOverlay,
	type DialogOverlayProps,
	DialogPortal,
	type DialogPortalProps,
}
