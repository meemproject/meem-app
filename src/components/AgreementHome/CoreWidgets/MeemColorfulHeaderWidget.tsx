import { Button, Center, Space, Text } from '@mantine/core'
import React, { useEffect } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { colorBlack, useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const MeemColorfulHeaderWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	return (
		<div>
			<>
				<div className={meemTheme.widgetMeem}>
					<Space h={16} />

					<Center>
						<Text
							className={meemTheme.tMediumBold}
							color={colorBlack}
						>
							{`Have a community tool you want to build together?`}
						</Text>
					</Center>
					<Space h={16} />
					<Center>
						<Button
							className={meemTheme.buttonBlack}
							onClick={() => {
								window.open(
									'https://form.typeform.com/to/TyeFu5om'
								)
							}}
						>
							Collaborate with us
						</Button>
					</Center>
					<Space h={16} />
				</div>
			</>
		</div>
	)
}
