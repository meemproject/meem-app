import { createStyles, Text, Center, Space, Divider } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'

const useStyles = createStyles(() => ({
	row: { display: 'flex' },
	normalText: {
		fontWeight: 600
	},
	link: {
		fontWeight: 600,
		color: '#000'
	},
	footerContainer: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0
	},
	footerBackground: {
		backgroundColor: 'white',
		width: '100%',
		height: 48,
		paddingTop: 8
	}
}))

export const MeemFooter: React.FC = () => {
	const { classes } = useStyles()

	return (
		<div>
			<Space h={32} />
			<div className={classes.footerContainer}>
				<Divider />
				<div className={classes.footerBackground}>
					<Center>
						<div className={classes.row}>
							<Text className={classes.normalText}>
								Powered by
							</Text>
							<Space w={4} />
							<a
								className={classes.link}
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
