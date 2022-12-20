/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text, Center, Space, Divider } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../Styles/AgreementsTheme'

export const MeemFooter: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<div>
			{/* <Space h={128} />
			<div className={meemTheme.pageFooterContainer}>
				<Divider />
				<div className={meemTheme.pageFooterBackground}>
					<Center>
						<div className={meemTheme.row}>
							<Text>Powered by</Text>
							<Space w={4} />
							<a
								className={meemTheme.tLink}
								href="https://build.meem.wtf"
							>
								Meem
							</a>
						</div>
						<Space h={32} />
					</Center>
				</div>
			</div> */}
		</div>
	)
}
