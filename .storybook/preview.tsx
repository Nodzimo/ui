import type { Preview } from '@storybook/react-vite'
import './preview.css'
import {
	previewDecorators,
	previewWrapperArgs,
	previewWrapperArgTypes,
	ThemedDocsContainer,
} from './preview/'

const preview: Preview = {
	args: { ...previewWrapperArgs },
	argTypes: { ...previewWrapperArgTypes },
	decorators: [...previewDecorators],
	parameters: {
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo',
		},
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		docs: {
			container: ThemedDocsContainer,
			toc: true, // Enables the table of contents
		},
		layout: 'centered',
		options: {
			storySort: {
				method: 'alphabetical',
				order: [
					'Design System',
					[
						'Doctrine',
						[
							'Overview',
							'Core Position',
							'Theme-Specific Values',
							'Token Role Semantics',
							'Button Action Hierarchy',
							'Token Discipline',
							'Theme Character Guardrails',
							'References And Evidence',
							'Final Reminder',
						],
						'Colors',
						'Icons',
						'Spacing',
					],
					'Core',
					'Client',
					'*',
				],
			},
		},
	},
	tags: ['autodocs'],
}

// noinspection JSUnusedGlobalSymbols
export default preview
