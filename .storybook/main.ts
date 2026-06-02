import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-themes',
		'storybook-dark-mode',
		'storybook-addon-pseudo-states',
		'storybook-addon-rtl',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {
			builder: {
				viteConfigPath: '.storybook/vite.config',
			},
		},
	},
	staticDirs: ['../assets/storybook'],
	stories: [
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'./showcase/**/*.mdx',
		'./showcase/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	viteFinal: (config) => {
		return {
			...config,
			build: {
				...config.build,
				chunkSizeWarningLimit: 1_300,
			},
		}
	},
}

// noinspection JSUnusedGlobalSymbols
export default config
