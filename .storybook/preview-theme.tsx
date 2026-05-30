import {
	DocsContainer,
	type DocsContainerProps,
} from '@storybook/addon-docs/blocks'
import { createContext, useContext } from 'react'
import { themes } from 'storybook/theming'
import { useDarkMode } from 'storybook-dark-mode'
import { PreviewWrapper } from './preview-wrapper'

const THEMES = {
	dark: 'dark',
	light: 'light',
} as const

type Theme = (typeof THEMES)[keyof typeof THEMES]

const DocsThemeContext = createContext<Theme>(THEMES.light)

function useDocsTheme() {
	return useContext(DocsThemeContext)
}

type DocsContextWithStore = DocsContainerProps['context'] & {
	store?: {
		userGlobals?: {
			globals?: {
				theme?: Theme
			}
		}
	}
}

function ThemedDocsContainer(props: DocsContainerProps) {
	const isManagerDark = useDarkMode()
	const docsTheme = isManagerDark ? themes.dark : themes.normal
	const context = props.context as DocsContextWithStore
	const componentTheme = context.store?.userGlobals?.globals?.theme

	const blockTheme: Theme =
		componentTheme ?? (isManagerDark ? THEMES.dark : THEMES.light)

	document.documentElement.classList.toggle(
		THEMES.light,
		componentTheme === THEMES.light,
	)

	document.documentElement.classList.toggle(
		THEMES.dark,
		componentTheme === THEMES.dark,
	)

	return (
		<DocsThemeContext.Provider value={blockTheme}>
			<PreviewWrapper>
				<DocsContainer {...props} theme={docsTheme} />
			</PreviewWrapper>
		</DocsThemeContext.Provider>
	)
}

export { THEMES, ThemedDocsContainer, useDocsTheme }
