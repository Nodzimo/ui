import type { JSX } from 'react'

type IconProps = JSX.IntrinsicElements['svg']

type Icon = (props: IconProps) => JSX.Element

export type { Icon, IconProps }
