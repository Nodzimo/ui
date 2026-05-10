import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		dts({
			tsconfigPath: 'tsconfig.app.json',
		}),
	],
	build: {
		lib: {
			entry: 'src/index',
			formats: ['es'],
		},
	},
})
