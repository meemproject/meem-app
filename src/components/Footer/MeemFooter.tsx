/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text, Center, Space, Divider } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useClubsTheme } from '../Styles/ClubsTheme'

export const MeemFooter: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()

	return (
		<div>
			{/* <Space h={128} />
			<div className={clubsTheme.pageFooterContainer}>
				<Divider />
				<div className={clubsTheme.pageFooterBackground}>
					<Center>
						<div className={clubsTheme.row}>
							<Text>Powered by</Text>
							<Space w={4} />
							<a
								className={clubsTheme.tLink}
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
