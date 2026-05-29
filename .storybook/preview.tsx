import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
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

function PreviewWrapper(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div {...props} className={'nui-surface nui-boundaries nui-interactive'} />
	)
}

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

	return (
		<PreviewWrapper>
			<DocsContainer {...props} theme={theme} />
		</PreviewWrapper>
	)
}

const preview: Preview = {
	args: { wrapperBackground: DEFAULT_WRAPPER_BACKGROUND },
	argTypes: {
		wrapperBackground: {
			name: 'Wrapper background',
			table: {
				category: 'Story canvas',
				defaultValue: { summary: `'${DEFAULT_WRAPPER_BACKGROUND}'` },
			},
		},
	},
	decorators: [
		withThemeByClassName({
			defaultTheme: LIGHT_THEME,
			themes: {
				dark: DARK_THEME,
				light: LIGHT_THEME,
			},
		}),
		(Story, { args }) => {
			const { wrapperBackground, ...storyArgs } = args

			const wrapperStyle: CSSProperties | undefined =
				wrapperBackground === DEFAULT_WRAPPER_BACKGROUND
					? undefined
					: { backgroundColor: wrapperBackground }

			return (
				<PreviewWrapper style={wrapperStyle}>
					<Story args={storyArgs} />
				</PreviewWrapper>
			)
		},
	],
	parameters: {
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo',
		},
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		docs: {
			container: ThemedDocsContainer,
			toc: true, // Enables the table of contents
		},
		layout: 'centered',
		options: {
			storySort: {
				method: 'alphabetical',
				order: [
					'Design System',
					[
						'Doctrine',
						[
							'Overview',
							'Core Position',
							'Theme-Specific Values',
							'Token Role Semantics',
							'Button Action Hierarchy',
							'Token Discipline',
							'Theme Character Guardrails',
							'References And Evidence',
							'Final Reminder',
						],
						'Colors',
						'Icons',
						'Spacing',
					],
					'Core',
					'Client',
					'*',
				],
			},
		},
	},
	tags: ['autodocs'],
}

// noinspection JSUnusedGlobalSymbols
export default preview
