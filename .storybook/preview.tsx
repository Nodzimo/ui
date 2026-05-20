import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { themes } from 'storybook/theming'
import './preview.css'

const DEFAULT_WRAPPER_BACKGROUND = 'transparent'

const preview: Preview = {
	parameters: {
		controls: {
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
		docs: {
			theme: themes.normal,
		},
	},
	args: {
		wrapperBackground: DEFAULT_WRAPPER_BACKGROUND,
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
	tags: ['autodocs'],
	decorators: [
		withThemeByClassName({
			defaultTheme: 'light',
			themes: {
				light: '',
				dark: 'dark',
			},
		}),
		(Story, storyContext) => {
			const { wrapperBackground, ...storyArgs } = storyContext.args

			const wrapperStyle: CSSProperties | undefined =
				wrapperBackground === DEFAULT_WRAPPER_BACKGROUND
					? undefined
					: { backgroundColor: wrapperBackground }

			return (
				<div
					className={
						'nui-surface nui-boundaries nui-interactive flex justify-center p-8'
					}
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
