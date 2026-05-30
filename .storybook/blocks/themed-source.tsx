import { Source, type SourceProps } from '@storybook/addon-docs/blocks'
import { useDocsTheme } from '../preview-runtime'

export function ThemedSource(props: SourceProps) {
	const docsTheme = useDocsTheme()
	const isDarkTheme = docsTheme === 'dark'

	return <Source {...props} dark={isDarkTheme} />
}
