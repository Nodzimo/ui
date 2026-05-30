import type { Preview } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef } from 'react'

const DEFAULT_WRAPPER_BACKGROUND = 'transparent'

const previewWrapperArgs: Preview['args'] = {
	wrapperBackground: DEFAULT_WRAPPER_BACKGROUND,
}

const previewWrapperArgTypes: Preview['argTypes'] = {
	wrapperBackground: {
		name: 'Wrapper background',
		table: {
			category: 'Story canvas',
			defaultValue: { summary: `'${DEFAULT_WRAPPER_BACKGROUND}'` },
		},
	},
}

function PreviewWrapper(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div {...props} className={'nui-surface nui-boundaries nui-interactive'} />
	)
}

export {
	DEFAULT_WRAPPER_BACKGROUND,
	PreviewWrapper,
	previewWrapperArgs,
	previewWrapperArgTypes,
}
