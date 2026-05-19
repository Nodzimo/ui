import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-themes',
		'storybook-addon-pseudo-states',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {
			builder: {
				viteConfigPath: '.storybook/vite.config',
			},
		},
	},
	viteFinal: config => {
		return {
			...config,
			build: {
				...config.build,
				chunkSizeWarningLimit: 1_100,
			},
		}
	},
	staticDirs: ['../assets/storybook'],
}

// noinspection JSUnusedGlobalSymbols
export default config
