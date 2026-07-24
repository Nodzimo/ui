// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react-vite'
import {
	STRING_UNION_SUMMARY,
	UNION_SEPARATOR,
} from '../../../storybook/constants'
import {
	SELECT_CONTENT_ALIGNS,
	SELECT_CONTENT_SIDES,
	SELECT_TRIGGER_SIZES,
	Select,
	SelectContent,
	type SelectContentProps,
	SelectGroup,
	SelectItem,
	SelectLabel,
	type SelectProps,
	SelectTrigger,
	type SelectTriggerProps,
	SelectValue,
} from '.'

const NORTH_AMERICA = [
	{ label: 'Eastern Standard Time', value: 'est' },
	{ label: 'Central Standard Time', value: 'cst' },
	{ label: 'Mountain Standard Time', value: 'mst' },
	{ label: 'Pacific Standard Time', value: 'pst' },
	{ label: 'Alaska Standard Time', value: 'akst' },
	{ label: 'Hawaii Standard Time', value: 'hst' },
] as const

const EUROPE_AFRICA = [
	{ label: 'Greenwich Mean Time', value: 'gmt' },
	{ label: 'Central European Time', value: 'cet' },
	{ label: 'Eastern European Time', value: 'eet' },
	{ label: 'Western European Summer Time', value: 'west' },
	{ label: 'Central Africa Time', value: 'cat' },
	{ label: 'East Africa Time', value: 'eat' },
] as const

const ASIA = [
	{ label: 'Moscow Time', value: 'msk' },
	{ label: 'India Standard Time', value: 'ist' },
	{ label: 'China Standard Time', value: 'cst_china' },
	{ label: 'Japan Standard Time', value: 'jst' },
	{ label: 'Korea Standard Time', value: 'kst' },
	{ label: 'Indonesia Central Standard Time', value: 'ist_indonesia' },
] as const

const AUSTRALIA_PACIFIC = [
	{ label: 'Australian Western Standard Time', value: 'awst' },
	{ label: 'Australian Central Standard Time', value: 'acst' },
	{ label: 'Australian Eastern Standard Time', value: 'aest' },
	{ label: 'New Zealand Standard Time', value: 'nzst' },
	{ label: 'Fiji Time', value: 'fjt' },
] as const

const SOUTH_AMERICA = [
	{ label: 'Argentina Time', value: 'art' },
	{ label: 'Bolivia Time', value: 'bot' },
	{ label: 'Brasilia Time', value: 'brt' },
	{ label: 'Chile Standard Time', value: 'clt' },
] as const

const ITEMS = [
	{ label: 'Select a timezone', value: null },
	...NORTH_AMERICA,
	...EUROPE_AFRICA,
	...ASIA,
	...AUSTRALIA_PACIFIC,
	...SOUTH_AMERICA,
] as const

const SELECT_DEFAULTS = {
	contentAlign: SELECT_CONTENT_ALIGNS[1],
	contentAlignItemWithTrigger: true,
	contentAlignOffset: 0,
	contentSide: SELECT_CONTENT_SIDES[1],
	contentSideOffset: 4,
	disabled: false,
	triggerAriaInvalid: false,
	triggerSize: SELECT_TRIGGER_SIZES[0],
} as const

type SelectStoryArgs = SelectProps & {
	contentAlign?: SelectContentProps['align']
	contentAlignItemWithTrigger?: SelectContentProps['alignItemWithTrigger']
	contentAlignOffset?: SelectContentProps['alignOffset']
	contentSide?: SelectContentProps['side']
	contentSideOffset?: SelectContentProps['sideOffset']
	triggerSize?: SelectTriggerProps['size']
	triggerAriaInvalid: SelectTriggerProps['aria-invalid']
}

const meta = {
	args: {
		contentAlign: SELECT_DEFAULTS.contentAlign,
		contentAlignItemWithTrigger: SELECT_DEFAULTS.contentAlignItemWithTrigger,
		contentAlignOffset: SELECT_DEFAULTS.contentAlignOffset,
		contentSide: SELECT_DEFAULTS.contentSide,
		contentSideOffset: SELECT_DEFAULTS.contentSideOffset,
		disabled: SELECT_DEFAULTS.disabled,
		triggerAriaInvalid: SELECT_DEFAULTS.triggerAriaInvalid,
		triggerSize: SELECT_DEFAULTS.triggerSize,
	},
	argTypes: {
		contentAlign: {
			control: 'select',
			options: SELECT_CONTENT_ALIGNS,
			table: {
				defaultValue: { summary: `'${SELECT_DEFAULTS.contentAlign}'` },
				type: {
					detail: SELECT_CONTENT_ALIGNS.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		contentAlignItemWithTrigger: {
			control: 'boolean',
			table: {
				defaultValue: {
					summary: String(SELECT_DEFAULTS.contentAlignItemWithTrigger),
				},
			},
		},
		contentAlignOffset: {
			control: 'number',
			table: {
				defaultValue: { summary: String(SELECT_DEFAULTS.contentAlignOffset) },
			},
		},
		contentSide: {
			control: 'select',
			options: SELECT_CONTENT_SIDES,
			table: {
				defaultValue: { summary: `'${SELECT_DEFAULTS.contentSide}'` },
				type: {
					detail: SELECT_CONTENT_SIDES.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
		contentSideOffset: {
			control: 'number',
			table: {
				defaultValue: { summary: String(SELECT_DEFAULTS.contentSideOffset) },
			},
		},
		disabled: {
			control: 'boolean',
			table: {
				defaultValue: { summary: String(SELECT_DEFAULTS.disabled) },
			},
		},
		triggerAriaInvalid: {
			table: {
				defaultValue: { summary: String(SELECT_DEFAULTS.triggerAriaInvalid) },
			},
		},
		triggerSize: {
			control: 'select',
			options: SELECT_TRIGGER_SIZES,
			table: {
				defaultValue: { summary: `'${SELECT_DEFAULTS.triggerSize}'` },
				type: {
					detail: SELECT_TRIGGER_SIZES.join(UNION_SEPARATOR),
					summary: STRING_UNION_SUMMARY,
				},
			},
		},
	},
	component: Select,
	render: ({
		contentAlign,
		contentAlignItemWithTrigger,
		contentAlignOffset,
		contentSide,
		contentSideOffset,
		triggerSize,
		triggerAriaInvalid,
		...restArgs
	}) => {
		return (
			<Select items={ITEMS} {...restArgs}>
				<SelectTrigger
					aria-invalid={triggerAriaInvalid}
					className={'w-64'}
					size={triggerSize}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent
					align={contentAlign}
					alignItemWithTrigger={contentAlignItemWithTrigger}
					alignOffset={contentAlignOffset}
					side={contentSide}
					sideOffset={contentSideOffset}
				>
					<SelectGroup>
						<SelectLabel>North America</SelectLabel>
						{NORTH_AMERICA.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Europe & Africa</SelectLabel>
						{EUROPE_AFRICA.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Asia</SelectLabel>
						{ASIA.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Australia & Pacific</SelectLabel>
						{AUSTRALIA_PACIFIC.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>South America</SelectLabel>
						{SOUTH_AMERICA.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		)
	},
	title: 'Client/Components/Select',
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
