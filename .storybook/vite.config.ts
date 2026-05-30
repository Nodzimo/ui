import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { mdxReactProxyPlugin } from './build-plugins'

export default defineConfig({
	plugins: [tailwindcss(), mdxReactProxyPlugin()],
})
