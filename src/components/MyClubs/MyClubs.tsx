import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Space
} from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		paddingRight: 32
	},
	headerLeftItems: {
		display: 'flex',
		alignItems: 'center'
	},
	headerArrow: {
		marginRight: 32,
		cursor: 'pointer'
	},
	headerClubName: {
		fontWeight: '600',
		fontSize: 24
	},
	buttonCreate: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	createClubLink: {
		marginTop: 24,
		a: {
			color: 'rgba(255, 102, 81, 1)',
			textDecoration: 'underline',
			fontWeight: 'bold'
		}
	},
	clubItem: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 24,
		fontSize: 16,
		fontWeight: '600',
		cursor: 'pointer'
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},

	myClubsPrompt: { fontSize: 18, marginBottom: 16 }
}))

export const MyClubsComponent: React.FC = () => {
	const { classes } = useStyles()
	const router = useRouter()
	const [clubs, setClubs] = useState(['Harry Potter Club', 'ClubClub'])
	const [isLoading, setIsLoading] = useState(true)

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	const navigateToCreate = () => {
		router.push({ pathname: '/create' })
	}

	const navigateToClub = (club: string) => {
		router.push({ pathname: `/club/${club}` })
	}

	return (
		<>
			<div className={classes.header}>
				<div className={classes.headerLeftItems}>
					<a onClick={navigateHome}>
						<ArrowLeft className={classes.headerArrow} size={32} />
					</a>
					<Text className={classes.headerClubName}>My Clubs</Text>
				</div>
				<Button onClick={navigateToCreate} className={classes.buttonCreate}>
					Create a Club
				</Button>
			</div>

			<Container>
				{clubs.length === 0 && (
					<>
						<Text className={classes.myClubsPrompt}>
							{`You haven't joined any clubs!`}
						</Text>
						<Text className={classes.createClubLink}>
							<a onClick={navigateToCreate}>Start a new one?</a>
						</Text>
					</>
				)}
				{clubs.length > 0 && (
					<>
						{clubs.map(club => (
							<div
								key={club}
								className={classes.clubItem}
								onClick={() => {
									navigateToClub(club)
								}}
							>
								<Image
									className={classes.clubLogoImage}
									src="/exampleclub.png"
									width={40}
									height={40}
									fit={'contain'}
								/>
								<Space w="xs" />
								<Text>{club}</Text>
							</div>
						))}
					</>
				)}
			</Container>
		</>
	)
}
