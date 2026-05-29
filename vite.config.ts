import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'
import packageJson from './package.json'

const clientCompilerIncludes = [/src[\\/]client\.ts$/, /src[\\/]client[\\/]/]
const { dependencies, peerDependencies } = packageJson

const runtimePackageNames = [
	...Object.keys(dependencies),
	...Object.keys(peerDependencies),
]

function isExternalRuntimeImport(importId: string) {
	return runtimePackageNames.some((packageName) => {
		return importId === packageName || importId.startsWith(`${packageName}/`)
	})
}

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
			external: isExternalRuntimeImport,
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
