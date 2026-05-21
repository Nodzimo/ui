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

const DEFAULT_WRAPPER_BACKGROUND = 'transparent'
const LIGHT_THEME = 'light'
const DARK_THEME = 'dark'

type DocsContextWithStore = DocsContainerProps['context'] & {
	store?: {
		userGlobals?: {
			globals?: {
				theme?: typeof LIGHT_THEME | typeof DARK_THEME
			}
		}
	}
}

function ThemedDocsContainer(props: DocsContainerProps) {
	const isDark = useDarkMode()
	const theme = isDark ? themes.dark : themes.normal
	const context = props.context as DocsContextWithStore
	const componentTheme = context.store?.userGlobals?.globals?.theme

	document.documentElement.classList.toggle(
		LIGHT_THEME,
		componentTheme === LIGHT_THEME,
	)

	document.documentElement.classList.toggle(
		DARK_THEME,
		componentTheme === DARK_THEME,
	)

	return <DocsContainer {...props} theme={theme} />
}

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
			defaultTheme: LIGHT_THEME,
			themes: {
				light: LIGHT_THEME,
				dark: DARK_THEME,
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
