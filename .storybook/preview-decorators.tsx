import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { THEMES } from './preview-theme'
import { DEFAULT_WRAPPER_BACKGROUND, PreviewWrapper } from './preview-wrapper'

export const previewDecorators = [
	withThemeByClassName({
		defaultTheme: THEMES.light,
		themes: {
			dark: THEMES.dark,
			light: THEMES.light,
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
] satisfies Preview['decorators']
