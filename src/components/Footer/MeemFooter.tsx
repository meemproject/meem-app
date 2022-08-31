import { createStyles, Text, Center, Space } from '@mantine/core'
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
	}
}))

export const MeemFooter: React.FC = () => {
	const { classes } = useStyles()

	return (
		<>
			<Center>
				<Space h={100} />
				<div className={classes.row}>
					<Text className={classes.normalText}>Powered by</Text>
					<Space w={4} />
					<a className={classes.link} href="https://build.meem.wtf">
						Meem
					</a>
				</div>
				<Space h={32} />
			</Center>
		</>
	)
}
