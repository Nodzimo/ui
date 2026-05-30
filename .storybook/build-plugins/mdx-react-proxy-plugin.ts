import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const MDX_REACT_PROXY_PATH = fileURLToPath(
	new URL('./mdx-react-proxy', import.meta.url),
)

const MDX_REACT_PROXY_IMPORT = MDX_REACT_PROXY_PATH.replaceAll('\\', '/')

export function mdxReactProxyPlugin(): Plugin {
	return {
		enforce: 'pre',
		name: 'storybook-mdx-react-proxy',
		transform(code, id) {
			if (
				id.includes('@storybook/addon-docs') &&
				code.includes('import("@mdx-js/react")')
			) {
				return code.replace(
					'import("@mdx-js/react")',
					`import(${JSON.stringify(MDX_REACT_PROXY_IMPORT)})`,
				)
			}
		},
	}
}
