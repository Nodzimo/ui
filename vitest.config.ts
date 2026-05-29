import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			projects: [
				{
					extends: true,
					plugins: [
						// The plugin will run tests for the stories defined in your Storybook config
						// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
						storybookTest({
							// The location of your Storybook config, main.js|ts
							configDir: path.join(dirname, '.storybook'),
							// This should match your package.json script to run Storybook
							// The --no-open flag will skip the automatic opening of a browser
							storybookScript: 'bun storybook --no-open',
						}),
					],
					test: {
						// Enable browser mode
						browser: {
							api: { host: '127.0.0.1' },
							enabled: true,
							headless: true,
							instances: [{ browser: 'chromium' }],
							// Make sure to install Playwright
							provider: playwright({}),
						},
						name: 'storybook',
					},
				},
			],
		},
	}),
)
