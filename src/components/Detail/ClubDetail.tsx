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
		position: 'relative',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingLeft: 8,
			paddingRight: 8,
			paddingTop: 24,
			paddingBottom: 24
		}
	},
	headerClubDescription: {
		fontSize: 16,
		marginTop: 8,
		marginRight: 16,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		marginTop: -8
	},
	headerLinks: {
		position: 'absolute',
		top: '24px',
		right: '64px',
		display: 'flex',
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		},
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			display: 'flex'
		}
	},
	mobileHeaderLinks: {
		marginTop: 16,
		display: 'flex',
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'flex'
		},
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
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
	outlineHeaderButton: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 0,
			marginLeft: 0,
			marginRight: 0,
			backgroundColor: 'transparent',
			borderColor: 'transparent'
		}
	},
	clubSettingsIcon: {
		width: 16,
		height: 16,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 24,
			height: 24
		}
	},
	clubMemberReqsTitleText: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	clubMembersListTitleText: {
		fontSize: 18,
		marginBottom: 16,
		marginTop: 40,
		fontWeight: 600,
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
		imageRendering: 'pixelated',
		width: 120,
		height: 120,
		marginRight: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 60,
			height: 60,
			minHeight: 60,
			minWidth: 60,
			marginLeft: 20,
			marginRight: 20
		}
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
		fontWeight: 600,
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
		router.push({ pathname: `/clubname/admin` })
	}

	return (
		<>
			<div className={classes.header}>
				<Image className={classes.clubLogoImage} src="/exampleclub.png" />
				<div>
					<Text className={classes.headerClubName}>{clubName}</Text>
					<Text className={classes.headerClubDescription}>
						{clubDescription}
					</Text>
					<div className={classes.headerButtons}>
						<Button className={classes.buttonJoinClub}>Join</Button>
						<Button className={classes.outlineButton}>Leave</Button>
						<Button
							onClick={navigateToSettings}
							className={classes.outlineHeaderButton}
							leftIcon={<Settings className={classes.clubSettingsIcon} />}
						>
							Settings
						</Button>
					</div>
					<div className={classes.mobileHeaderLinks}>
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
							<Grid.Col xs={6} sm={4} md={4} lg={4} xl={4} key={member}>
								<Text className={classes.memberItem}>{member}</Text>
							</Grid.Col>
						))}
					</Grid>
				)}
				<Space h={'xl'} />
			</Container>
		</>
	)
}
