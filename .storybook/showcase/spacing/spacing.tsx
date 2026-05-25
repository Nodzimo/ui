const SPACING_TOKENS = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
const SPACING_PREFIX = '--nui-spacing-'

type SpacingToken = (typeof SPACING_TOKENS)[number]
type SpacingVariable = `${typeof SPACING_PREFIX}${SpacingToken}`

function getSpacingVariable(token: SpacingToken): SpacingVariable {
	return `${SPACING_PREFIX}${token}`
}

export function SpacingScale() {
	return (
		<table>
			<thead>
				<tr>
					<th>Token</th>
					<th>CSS variable</th>
					<th>Preview</th>
				</tr>
			</thead>
			<tbody>
				{SPACING_TOKENS.map((token: SpacingToken) => {
					const spacingVariable: SpacingVariable = getSpacingVariable(token)

					return (
						<tr key={token}>
							<td>
								<code>{token}</code>
							</td>
							<td>
								<code>{spacingVariable}</code>
							</td>
							<td>
								<div
									className={'h-4 bg-nui-primary'}
									style={{ width: `var(${spacingVariable})` }}
								/>
							</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
