const template = ({ componentName, jsx }, { tpl }) => tpl`
import type { JSX } from 'react'

const ${componentName} = (props: JSX.IntrinsicElements['svg']) => ${jsx}

export default ${componentName}
`

module.exports = {
	filenameCase: 'kebab',
	icon: true,
	jsxRuntime: 'automatic',
	outDir: 'src/core/icons/generated',
	prettier: false,
	template,
	typescript: true,
}
