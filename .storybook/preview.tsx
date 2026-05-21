import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import './preview.css'
import {
	DocsContainer,
	type DocsContainerProps,
} from '@storybook/addon-docs/blocks'
import { themes } from 'storybook/theming'
import { useDarkMode } from 'storybook-dark-mode'

function ThemedDocsContainer(props: DocsContainerProps) {
	const isDark = useDarkMode()
	const theme = isDark ? themes.dark : themes.normal

	return <DocsContainer {...props} theme={theme} />
}

const DEFAULT_WRAPPER_BACKGROUND = 'transparent'

const preview: Preview = {
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			toc: true, // Enables the table of contents
			container: ThemedDocsContainer,
		},
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo',
		},
	},
	argTypes: {
		wrapperBackground: {
			table: {
				category: 'Story canvas',
				defaultValue: { summary: `'${DEFAULT_WRAPPER_BACKGROUND}'` },
			},
			name: 'Wrapper background',
		},
	},
	args: { wrapperBackground: DEFAULT_WRAPPER_BACKGROUND },
	decorators: [
		withThemeByClassName({
			defaultTheme: 'light',
			themes: {
				light: '',
				dark: 'dark',
			},
		}),
		(Story, { args }) => {
			const { wrapperBackground, ...storyArgs } = args

			const wrapperStyle: CSSProperties | undefined =
				wrapperBackground === DEFAULT_WRAPPER_BACKGROUND
					? undefined
					: { backgroundColor: wrapperBackground }

			return (
				<div
					className={'nui-surface nui-boundaries nui-interactive'}
					style={wrapperStyle}
				>
					<Story args={storyArgs} />
				</div>
			)
		},
	],
}

// noinspection JSUnusedGlobalSymbols
export default preview
