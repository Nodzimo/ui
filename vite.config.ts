import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

const clientCompilerIncludes = [/src[\\/]client\.ts$/, /src[\\/]client[\\/]/]

// https://vite.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: {
				client: 'src/client',
				'nodzimo-ui': 'src/index',
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
			output: {
				chunkFileNames: 'internal/[name]-[hash].js',
			},
		},
		target: 'esnext',
	},
	plugins: [
		react(),
		babel({
			include: clientCompilerIncludes,
			presets: [reactCompilerPreset()],
		}),
		dts({
			bundleTypes: true,
			exclude: '**/*.stories.*',
			tsconfigPath: 'tsconfig.app.json',
		}),
		tailwindcss(),
	],
})
