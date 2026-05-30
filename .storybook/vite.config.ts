import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { mdxReactProxyPlugin } from './mdx'

export default defineConfig({
	plugins: [tailwindcss(), mdxReactProxyPlugin()],
})
