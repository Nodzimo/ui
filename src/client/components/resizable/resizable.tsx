import * as ResizablePrimitive from 'react-resizable-panels'
import { mcn } from '#lib'

function ResizablePanelGroup({
	className,
	...restProps
}: ResizablePrimitive.GroupProps) {
	return (
		<ResizablePrimitive.Group
			className={mcn(
				'flex h-full w-full aria-[orientation=vertical]:flex-col',
				className,
			)}
			data-slot={'resizable-panel-group'}
			{...restProps}
		/>
	)
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
	return <ResizablePrimitive.Panel data-slot={'resizable-panel'} {...props} />
}

function ResizableHandle({
	withHandle,
	className,
	...restProps
}: ResizablePrimitive.SeparatorProps & {
	withHandle?: boolean
}) {
	return (
		<ResizablePrimitive.Separator
			className={mcn(
				'relative flex w-px items-center justify-center bg-nui-border ring-offset-nui-background',
				'after:absolute after:inset-s-1/2 after:inset-y-0 after:w-1 after:-translate-x-1/2',
				'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-nui-ring',
				'aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full',
				'aria-[orientation=horizontal]:after:inset-s-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2',
				'[&[aria-orientation=horizontal]>div]:rotate-90',
				className,
			)}
			data-slot={'resizable-handle'}
			{...restProps}
		>
			{withHandle && (
				<div
					className={'z-10 flex h-6 w-1 shrink-0 rounded-nui-lg bg-nui-border'}
				/>
			)}
		</ResizablePrimitive.Separator>
	)
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
