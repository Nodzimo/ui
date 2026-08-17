import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import type { ReactNode } from 'react'
import { Button } from '#client/components/button'
import {
	CircleCheckIcon,
	InfoIcon,
	LoaderCircleIcon,
	OctagonXIcon,
	TriangleAlertIcon,
	XIcon,
} from '#core/icons'
import { mcn } from '#lib'

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
	return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
	return <ToastPrimitive.Portal data-slot={'toast-portal'} {...props} />
}

function ToastViewport({
	className,
	...restProps
}: ToastPrimitive.Viewport.Props) {
	return (
		<ToastPrimitive.Viewport
			className={mcn(
				'pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full',
				className,
			)}
			data-slot={'toast-viewport'}
			{...restProps}
		/>
	)
}

function Toast({ className, ...restProps }: ToastPrimitive.Root.Props) {
	return (
		<ToastPrimitive.Root
			className={mcn(
				'group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom select-none rounded-nui-2xl border bg-nui-popover text-nui-popover-foreground shadow-lg outline-none will-change-transform focus-visible:border-nui-ring focus-visible:ring-[3px] focus-visible:ring-nui-ring/50',
				'[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
				'transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] h-(--height) [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]',
				"after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
				'data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))] data-expanded:h-(--toast-height)',
				'data-starting-style:transform-[translateY(150%)] data-limited:opacity-0',
				'[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]',
				'data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]',
				'data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
				'data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
				'data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]',
				'data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]',
				'data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
				'data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
				'data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]',
				className,
			)}
			data-slot={'toast'}
			{...restProps}
		/>
	)
}

function ToastContent({
	className,
	...restProps
}: ToastPrimitive.Content.Props) {
	return (
		<ToastPrimitive.Content
			className={mcn(
				'flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100',
				className,
			)}
			data-slot={'toast-content'}
			{...restProps}
		/>
	)
}

function ToastTitle({ className, ...restProps }: ToastPrimitive.Title.Props) {
	return (
		<ToastPrimitive.Title
			className={mcn('font-medium text-sm', className)}
			data-slot={'toast-title'}
			{...restProps}
		/>
	)
}

function ToastDescription({
	className,
	...restProps
}: ToastPrimitive.Description.Props) {
	return (
		<ToastPrimitive.Description
			className={mcn('text-nui-muted-foreground text-sm', className)}
			data-slot={'toast-description'}
			{...restProps}
		/>
	)
}

function ToastAction({
	className,
	render = <Button size={'sm'} variant={'outline'} />,
	...restProps
}: ToastPrimitive.Action.Props) {
	return (
		<ToastPrimitive.Action
			className={mcn('shrink-0', className)}
			data-slot={'toast-action'}
			render={render}
			{...restProps}
		/>
	)
}

function ToastClose({
	className,
	children,
	render = <Button size={'icon-sm'} variant={'ghost'} />,
	...restProps
}: ToastPrimitive.Close.Props) {
	return (
		<ToastPrimitive.Close
			aria-label={'Close toast'}
			className={mcn(
				"relative shrink-0 text-nui-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-nui-foreground",
				className,
			)}
			data-slot={'toast-close'}
			render={render}
			{...restProps}
		>
			{children ?? <XIcon aria-hidden={'true'} />}
		</ToastPrimitive.Close>
	)
}

function ToastIcon({ type }: { type: string | undefined }) {
	let icon: ReactNode = null

	if (type === 'success') {
		icon = <CircleCheckIcon aria-hidden={'true'} />
	}

	if (type === 'info') {
		icon = <InfoIcon aria-hidden={'true'} />
	}

	if (type === 'warning') {
		icon = <TriangleAlertIcon aria-hidden={'true'} />
	}

	if (type === 'error') {
		icon = (
			<OctagonXIcon aria-hidden={'true'} className={'text-nui-destructive'} />
		)
	}

	if (type === 'loading') {
		icon = <LoaderCircleIcon aria-hidden={'true'} className={'animate-spin'} />
	}

	if (!icon) {
		return null
	}

	return (
		<span
			className={
				"shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none"
			}
			data-slot={'toast-icon'}
		>
			{icon}
		</span>
	)
}

function ToastList() {
	const { toasts } = ToastPrimitive.useToastManager()

	return toasts.map((toastItem) => (
		<Toast key={toastItem.id} toast={toastItem}>
			<ToastContent>
				<ToastIcon type={toastItem.type} />
				<div className={'flex min-w-0 flex-1 flex-col gap-1'}>
					<ToastTitle />
					<ToastDescription />
				</div>
				<ToastAction />
				<ToastClose />
			</ToastContent>
		</Toast>
	))
}

function Toaster({
	children,
	toastManager = toast,
	...restProps
}: ToastPrimitive.Provider.Props) {
	return (
		<ToastProvider toastManager={toastManager} {...restProps}>
			{children}
			<ToastPortal>
				<ToastViewport>
					<ToastList />
				</ToastViewport>
			</ToastPortal>
		</ToastProvider>
	)
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
	createToastManager,
	Toast,
	ToastAction,
	ToastClose,
	ToastContent,
	ToastDescription,
	Toaster,
	ToastPortal,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	toast,
	useToastManager,
}
