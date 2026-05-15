import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo',
		},
	},
	args: {
		wrapperBackground: 'transparent',
	},
	argTypes: {
		wrapperBackground: {
			table: {
				category: 'Story canvas',
			},
			name: 'Wrapper background',
		},
	},
	tags: ['autodocs'],
	decorators: [
		(Story, storyContext) => {
			const { wrapperBackground, ...storyArgs } = storyContext.args

			return (
				<div
					className={'nui-boundaries nui-interactive flex justify-center p-8'}
					style={{
						backgroundColor: wrapperBackground,
					}}
				>
					<Story args={storyArgs} />
				</div>
			)
		},
	],
}

// noinspection JSUnusedGlobalSymbols
export default preview
