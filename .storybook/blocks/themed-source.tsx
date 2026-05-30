import { Source, type SourceProps } from '@storybook/addon-docs/blocks'
import { useStorybookDocsTheme } from './docs-theme-context'

export function ThemedSource(props: SourceProps) {
	const docsTheme = useStorybookDocsTheme()
	const isDarkTheme = docsTheme === 'dark'

	return <Source {...props} dark={isDarkTheme} />
}
