/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Space,
	Grid
} from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
	BrandDiscord,
	BrandTwitter,
	CircleCheck,
	Settings
} from 'tabler-icons-react'

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 32,
		paddingBottom: 32,
		paddingLeft: 32,
		position: 'relative'
	},
	headerClubDescription: {
		fontSize: 16,
		marginTop: 8,
		fontWeight: '500',
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: '600',
		fontSize: 24,
		marginTop: -8
	},
	headerLinks: {
		position: 'absolute',
		top: '24px',
		right: '24px',
		display: 'flex',
		fontWeight: '600'
	},
	headerLink: {
		display: 'flex',
		cursor: 'pointer',
		color: 'black',
		textDecoration: 'none'
	},
	headerButtons: {
		marginTop: 24,
		display: 'flex'
	},
	outlineButton: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	clubMemberReqsTitleText: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '600',
		color: 'rgba(0, 0, 0, 0.6)'
	},
	clubMembersListTitleText: {
		fontSize: 18,
		marginBottom: 16,
		marginTop: 40,
		fontWeight: '600',
		color: 'rgba(0, 0, 0, 0.6)'
	},

	buttonJoinClub: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},
	requirementsContainer: {
		border: '1px solid rgba(0, 0, 0, 0.5)',
		borderRadius: 16,
		padding: 16
	},
	requirementItem: {
		display: 'flex',
		alignItems: 'center'
	},
	memberItem: {
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		fontWeight: '600',
		borderRadius: 16,
		padding: 16
	}
}))

export const ClubDetailComponent: React.FC = () => {
	const router = useRouter()
	const { classes } = useStyles()

	const [clubName, setClubName] = useState('Harry  Potter Club')
	const [clubDescription, setClubDescription] = useState(
		'A club to talk about spells and magic'
	)
	const [membershipRequirements, setMembershipRequirements] = useState([
		'Hold a Memesters Union Card'
	])

	const [clubMembers, setClubMembers] = useState([
		'popp.eth',
		'kateweimer.eth',
		'kencodes.eth',
		'gadsby.eth',
		'gregb.eth',
		'shoople.eth'
	])

	const [isLoading, setIsLoading] = useState(true)

	const navigateToSettings = () => {
		router.push({ pathname: `/club/clubname/admin` })
	}

	return (
		<>
			<div className={classes.header}>
				<Image
					className={classes.clubLogoImage}
					src="/exampleclub.png"
					width={100}
					height={100}
					fit={'contain'}
				/>
				<Space w={'lg'} />
				<div>
					<Text className={classes.headerClubName}>{clubName}</Text>
					<Text className={classes.headerClubDescription}>
						{clubDescription}
					</Text>
					<div className={classes.headerButtons}>
						<Button className={classes.buttonJoinClub}>Join Club</Button>
						<Button className={classes.outlineButton}>Leave Club</Button>
						<Space w={16} />
						<Button
							onClick={navigateToSettings}
							className={classes.outlineButton}
							leftIcon={<Settings size={14} />}
						>
							Settings
						</Button>
					</div>
				</div>
				<div className={classes.headerLinks}>
					<a href="twitter.com" className={classes.headerLink}>
						{' '}
						<BrandTwitter />
						<Space w={8} />
						<Text>Twitter</Text>
					</a>
					<Space w={'sm'} />
					<a href="discord.com" className={classes.headerLink}>
						{' '}
						<BrandDiscord />
						<Space w={8} />
						<Text>Discord</Text>
					</a>
				</div>
			</div>

			<Container>
				<Text className={classes.clubMemberReqsTitleText}>
					Membership Requirements
				</Text>
				{membershipRequirements.length > 0 && (
					<div className={classes.requirementsContainer}>
						{membershipRequirements.map(requirement => (
							<div className={classes.requirementItem} key={requirement}>
								<CircleCheck color="green" />
								<Space w={'xs'} />

								<Text>{requirement}</Text>
							</div>
						))}
					</div>
				)}

				<Text
					className={classes.clubMembersListTitleText}
				>{`Members (${clubMembers.length})`}</Text>
				{clubMembers.length > 0 && (
					<Grid>
						{clubMembers.map(member => (
							<Grid.Col span={4} key={member}>
								<Text className={classes.memberItem}>{member}</Text>
							</Grid.Col>
						))}
					</Grid>
				)}
			</Container>
		</>
	)
}
