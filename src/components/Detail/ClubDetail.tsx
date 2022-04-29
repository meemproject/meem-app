import { createStyles, Container, Text, Image } from '@mantine/core'
import React, { useState } from 'react'

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32
	},
	headerClubName: {
		fontWeight: '600',
		fontSize: 24,
		marginLeft: 32
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},

	clubDescriptionPrompt: { fontSize: 18, marginBottom: 16, fontWeight: '600' }
}))

export const ClubDetailComponent: React.FC = () => {
	const { classes } = useStyles()
	const [isLoading, setIsLoading] = useState(true)

	return (
		<>
			<div className={classes.header}>
				<Image
					className={classes.clubLogoImage}
					src="/exampleclub.png"
					width={80}
					height={80}
					fit={'contain'}
				/>
				{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
				<Text className={classes.headerClubName}>Harry Potter Fan Club</Text>
			</div>

			<Container>
				<Text className={classes.clubDescriptionPrompt}>Club detail</Text>
			</Container>
		</>
	)
}
