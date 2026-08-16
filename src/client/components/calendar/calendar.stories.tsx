// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import { arSA, enUS, faIR, ja, ru, zhCN } from 'react-day-picker/locale'
import { fn } from 'storybook/test'
import { BUTTON_VARIANTS } from '#client'
import {
	STRING_UNION_SUMMARY,
	UNION_SEPARATOR,
} from '../../../storybook/constants'
import {
	CALENDAR_CAPTION_LAYOUTS,
	CALENDAR_MODES,
	CALENDAR_NAV_LAYOUTS,
	Calendar,
} from '.'

const CALENDAR_STORY_LOCALES = {
	'Arabic (Saudi Arabia)': arSA,
	'Chinese (China)': zhCN,
	'English (United States)': enUS,
	'Japanese (Japan)': ja,
	'Persian (Iran)': faIR,
	'Russian (Russia)': ru,
} as const

const CALENDAR_STORY_LOCALE_OPTIONS = Object.keys(CALENDAR_STORY_LOCALES)

const meta = {
	args: {
		buttonVariant: 'ghost',
		captionLayout: 'label',
		disabled: false,
		disableNavigation: false,
		fixedWeeks: false,
		hideNavigation: false,
		hideWeekdays: false,
		mode: CALENDAR_MODES[0],
		numberOfMonths: 1,
		onMonthChange: fn(),
		pagedNavigation: false,
		reverseMonths: false,
		reverseYears: false,
		showOutsideDays: true,
		showWeekNumber: false,
	},
	argTypes: {
		buttonVariant: {
			control: 'select',
			options: BUTTON_VARIANTS,
			table: {
				type: {
					detail: BUTTON_VARIANTS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		captionLayout: {
			control: 'select',
			options: CALENDAR_CAPTION_LAYOUTS,
			table: {
				type: {
					detail: CALENDAR_CAPTION_LAYOUTS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		disabled: {
			table: { defaultValue: { summary: 'false' } },
		},
		disableNavigation: {
			table: { defaultValue: { summary: 'false' } },
		},
		fixedWeeks: {
			table: { defaultValue: { summary: 'false' } },
		},
		hideNavigation: {
			table: { defaultValue: { summary: 'false' } },
		},
		hideWeekdays: {
			table: { defaultValue: { summary: 'false' } },
		},
		locale: {
			control: 'select',
			description: 'Locale examples for this story',
			mapping: CALENDAR_STORY_LOCALES,
			options: CALENDAR_STORY_LOCALE_OPTIONS,
			table: {
				defaultValue: { summary: 'enUS' },
				type: { summary: 'DayPickerLocale' },
			},
		},
		mode: {
			control: 'inline-radio',
			options: CALENDAR_MODES,
			table: {
				defaultValue: { summary: 'undefined' },
				type: {
					detail: CALENDAR_MODES.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		navLayout: {
			control: 'inline-radio',
			options: CALENDAR_NAV_LAYOUTS,
			table: {
				defaultValue: { summary: 'undefined' },
				type: {
					detail: CALENDAR_NAV_LAYOUTS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		numberOfMonths: {
			control: { min: 1 },
			table: { defaultValue: { summary: '1' } },
		},
		pagedNavigation: {
			description: 'Moves by all visible months at once',
			table: { defaultValue: { summary: 'false' } },
		},
		reverseMonths: {
			table: { defaultValue: { summary: 'false' } },
		},
		reverseYears: {
			table: { defaultValue: { summary: 'false' } },
		},
		showOutsideDays: {
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		showWeekNumber: {
			table: { defaultValue: { summary: 'false' } },
		},
	},
	component: Calendar,
	title: 'Client/Components/Calendar',
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
