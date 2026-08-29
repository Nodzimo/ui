import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import { mcn } from '#lib'

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

export {
	ALERT_DIALOG_CONTENT_SIZES,
	AlertDialogContent,
	type AlertDialogContentProps,
	type AlertDialogContentSize,
	AlertDialogOverlay,
	type AlertDialogOverlayProps,
	AlertDialogPortal,
	type AlertDialogPortalProps,
}
