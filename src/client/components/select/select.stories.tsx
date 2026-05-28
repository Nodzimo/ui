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

const northAmerica = [
	{ label: 'Eastern Standard Time', value: 'est' },
	{ label: 'Central Standard Time', value: 'cst' },
	{ label: 'Mountain Standard Time', value: 'mst' },
	{ label: 'Pacific Standard Time', value: 'pst' },
	{ label: 'Alaska Standard Time', value: 'akst' },
	{ label: 'Hawaii Standard Time', value: 'hst' },
] as const

const europeAfrica = [
	{ label: 'Greenwich Mean Time', value: 'gmt' },
	{ label: 'Central European Time', value: 'cet' },
	{ label: 'Eastern European Time', value: 'eet' },
	{ label: 'Western European Summer Time', value: 'west' },
	{ label: 'Central Africa Time', value: 'cat' },
	{ label: 'East Africa Time', value: 'eat' },
] as const

const asia = [
	{ label: 'Moscow Time', value: 'msk' },
	{ label: 'India Standard Time', value: 'ist' },
	{ label: 'China Standard Time', value: 'cst_china' },
	{ label: 'Japan Standard Time', value: 'jst' },
	{ label: 'Korea Standard Time', value: 'kst' },
	{ label: 'Indonesia Central Standard Time', value: 'ist_indonesia' },
] as const

const australiaPacific = [
	{ label: 'Australian Western Standard Time', value: 'awst' },
	{ label: 'Australian Central Standard Time', value: 'acst' },
	{ label: 'Australian Eastern Standard Time', value: 'aest' },
	{ label: 'New Zealand Standard Time', value: 'nzst' },
	{ label: 'Fiji Time', value: 'fjt' },
] as const

const southAmerica = [
	{ label: 'Argentina Time', value: 'art' },
	{ label: 'Bolivia Time', value: 'bot' },
	{ label: 'Brasilia Time', value: 'brt' },
	{ label: 'Chile Standard Time', value: 'clt' },
] as const

const items = [
	{ label: 'Select a timezone', value: null },
	...northAmerica,
	...europeAfrica,
	...asia,
	...australiaPacific,
	...southAmerica,
] as const

const SELECT_DEFAULTS = {
	contentAlign: SELECT_CONTENT_ALIGNS[1],
	contentAlignItemWithTrigger: true,
	contentAlignOffset: 0,
	contentSide: SELECT_CONTENT_SIDES[1],
	contentSideOffset: 4,
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
	title: 'Client/Components/Select',
	component: Select,
	argTypes: {
		triggerSize: {
			table: {
				type: {
					summary: STRING_UNION_SUMMARY,
					detail: SELECT_TRIGGER_SIZES.join(UNION_SEPARATOR),
				},
				defaultValue: { summary: `'${SELECT_DEFAULTS.triggerSize}'` },
			},
			control: 'select',
			options: SELECT_TRIGGER_SIZES,
		},
		contentSide: {
			table: {
				type: {
					summary: STRING_UNION_SUMMARY,
					detail: SELECT_CONTENT_SIDES.join(UNION_SEPARATOR),
				},
				defaultValue: { summary: `'${SELECT_DEFAULTS.contentSide}'` },
			},
			control: 'select',
			options: SELECT_CONTENT_SIDES,
		},
		contentAlign: {
			table: {
				type: {
					summary: STRING_UNION_SUMMARY,
					detail: SELECT_CONTENT_ALIGNS.join(UNION_SEPARATOR),
				},
				defaultValue: { summary: `'${SELECT_DEFAULTS.contentAlign}'` },
			},
			control: 'select',
			options: SELECT_CONTENT_ALIGNS,
		},
		contentSideOffset: {
			control: 'number',
			table: {
				defaultValue: { summary: String(SELECT_DEFAULTS.contentSideOffset) },
			},
		},
		contentAlignOffset: {
			control: 'number',
			table: {
				defaultValue: { summary: String(SELECT_DEFAULTS.contentAlignOffset) },
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
		triggerAriaInvalid: {
			table: {
				defaultValue: { summary: String(SELECT_DEFAULTS.triggerAriaInvalid) },
			},
		},
	},
	args: {
		contentAlign: SELECT_DEFAULTS.contentAlign,
		contentAlignItemWithTrigger: SELECT_DEFAULTS.contentAlignItemWithTrigger,
		contentAlignOffset: SELECT_DEFAULTS.contentAlignOffset,
		contentSide: SELECT_DEFAULTS.contentSide,
		contentSideOffset: SELECT_DEFAULTS.contentSideOffset,
		triggerSize: SELECT_DEFAULTS.triggerSize,
		triggerAriaInvalid: SELECT_DEFAULTS.triggerAriaInvalid,
	},
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
			<Select items={items} {...restArgs}>
				<SelectTrigger
					aria-invalid={triggerAriaInvalid}
					className={'w-full max-w-64'}
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
						{northAmerica.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Europe & Africa</SelectLabel>
						{europeAfrica.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Asia</SelectLabel>
						{asia.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Australia & Pacific</SelectLabel>
						{australiaPacific.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>South America</SelectLabel>
						{southAmerica.map(({ value, label }) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		)
	},
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
