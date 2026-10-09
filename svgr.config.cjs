const template = ({ componentName, jsx }, { tpl }) => tpl`
import type { IconProps } from '../../icon-types'

const ${componentName} = (props: IconProps) => ${jsx}

export default ${componentName}
`

module.exports = {
	filenameCase: 'kebab',
	jsxRuntime: 'automatic',
	prettier: false,
	template,
	typescript: true,
}
