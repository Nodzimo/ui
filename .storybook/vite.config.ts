import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { mdxReactProxyPlugin } from './mdx-react-proxy-plugin'

export default defineConfig({
	plugins: [tailwindcss(), mdxReactProxyPlugin()],
})
