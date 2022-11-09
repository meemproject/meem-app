import { Text, Center, Space, Divider } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useGlobalStyles } from '../Styles/GlobalStyles'

export const MeemFooter: React.FC = () => {
	const { classes: design } = useGlobalStyles()

	return (
		<div>
			<Space h={128} />
			<div className={design.footerContainer}>
				<Divider />
				<div className={design.footerBackground}>
					<Center>
						<div className={design.row}>
							<Text>Powered by</Text>
							<Space w={4} />
							<a
								className={design.tLink}
								href="https://build.meem.wtf"
							>
								Meem
							</a>
						</div>
						<Space h={32} />
					</Center>
				</div>
			</div>
		</div>
	)
}
