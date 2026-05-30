import { createContext, useContext } from 'react'

export type StorybookDocsTheme = 'light' | 'dark'

export const StorybookDocsThemeContext =
	createContext<StorybookDocsTheme>('light')

export function useStorybookDocsTheme() {
	return useContext(StorybookDocsThemeContext)
}
