import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

const clientCompilerIncludes = [/src[\\/]client\.ts$/, /src[\\/]client[\\/]/]

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		babel({
			presets: [reactCompilerPreset()],
			include: clientCompilerIncludes,
		}),
		dts({
			tsconfigPath: 'tsconfig.app.json',
		}),
		tailwindcss(),
	],
	build: {
		lib: {
			entry: {
				'nodzimo-ui': 'src/index',
				client: 'src/client',
			},
			formats: ['es'],
		},
		rolldownOptions: {
			external: [
				'react',
				'react-dom',
				'react/jsx-runtime',
				'react/compiler-runtime',
			],
		},
	},
})
