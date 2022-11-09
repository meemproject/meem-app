import { Text, Center, Space, Divider } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useGlobalStyles } from '../Styles/GlobalStyles'

export const MeemFooter: React.FC = () => {
	const { classes: styles } = useGlobalStyles()

	return (
		<div>
			<Space h={128} />
			<div className={styles.footerContainer}>
				<Divider />
				<div className={styles.footerBackground}>
					<Center>
						<div className={styles.row}>
							<Text>Powered by</Text>
							<Space w={4} />
							<a
								className={styles.tLink}
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
