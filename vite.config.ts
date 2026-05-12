/// <reference types="vitest/config" />

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import babel from '@rolldown/plugin-babel'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url))

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
		target: 'esnext',
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
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: path.join(dirname, '.storybook'),
					}),
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [
							{
								browser: 'chromium',
							},
						],
					},
				},
			},
		],
	},
})
