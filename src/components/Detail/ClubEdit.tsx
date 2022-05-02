import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Tabs,
	Space,
	Textarea,
	Chips,
	Chip
} from '@mantine/core'
import React, { useState } from 'react'
import { Edit, Settings, Lock } from 'tabler-icons-react'

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubName: {
		fontWeight: '600',
		fontSize: 24,
		marginLeft: 32
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},
	buttonEditProfile: {
		borderRadius: 24,
		marginRight: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	buttonSaveChanges: {
		marginTop: 48,
		marginBottom: 48,

		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	tabs: {
		display: 'flex',
		flexDirection: 'row'
	},
	activeTab: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '600',
		color: 'black',
		textDecoration: 'underline'
	},
	inactiveTab: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '600',
		color: 'rgba(45, 28, 28, 0.3)',
		cursor: 'pointer'
	},
	membershipText: { fontSize: 20, marginBottom: 8, lineHeight: 2 },

	membershipSelector: {
		padding: 4,
		borderRadius: 8,
		fontWeight: 'bold',
		backgroundColor: 'rgba(255, 102, 81, 0.1)',
		color: 'rgba(255, 102, 81, 1)'
	},
	clubAdminsPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '600',
		marginTop: 36
	},
	clubAdminsInstructions: {
		fontSize: 18,
		marginBottom: 16,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	adminsTextAreaContainer: {
		position: 'relative'
	},
	adminsTextArea: {
		paddingTop: 48,
		paddingLeft: 32
	},
	primaryAdminChip: {
		position: 'absolute',
		pointerEvents: 'none',
		top: 12,
		left: 12
	},
	primaryAdminChipContents: {
		display: 'flex',
		alignItems: 'center'
	}
}))

enum Tab {
	Membership,
	Admins,
	Integrations
}

export const ClubEditComponent: React.FC = () => {
	const { classes } = useStyles()
	const [isLoading, setIsLoading] = useState(true)
	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Membership)

	// Membership settings
	const [whoCanJoin, setWhoCanJoin] = useState('anyone')
	const [tokenQuantity, setTokenQuantity] = useState('0')
	const [tokenSymbol, setTokenSymbol] = useState('ETH')
	const [mintingStart, setMintingStart] = useState('now')
	const [mintingEnd, setMintingEnd] = useState('never')

	// Club admins
	const [primaryClubAdmin, setPrimaryClubAdmin] = useState('gadsby.eth')
	const [clubAdminsString, setClubAdminsString] = useState('')
	const [clubAdmins, setClubAdmins] = useState<string[]>([])

	const switchToMembership = () => {
		setCurrentTab(Tab.Membership)
	}

	const switchToClubAdmins = () => {
		setCurrentTab(Tab.Admins)
	}

	const switchToIntegrations = () => {
		setCurrentTab(Tab.Integrations)
	}

	const parseClubAdmins = (rawString: string) => {
		setClubAdminsString(rawString)
		const adminsList = rawString.split('\n')
		const finalList: string[] = []
		adminsList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		console.log(`admins count = ${finalList.length + 1}`)
		setClubAdmins(finalList)
	}

	return (
		<>
			<div className={classes.header}>
				<div className={classes.headerTitle}>
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
				<Button
					leftIcon={<Settings size={14} />}
					className={classes.buttonEditProfile}
				>
					Edit profile
				</Button>
			</div>

			<Container>
				<div className={classes.tabs}>
					<a onClick={switchToMembership}>
						<Text
							className={
								currentTab == Tab.Membership
									? classes.activeTab
									: classes.inactiveTab
							}
						>
							Membership Settings
						</Text>
					</a>
					<Space w="lg" />
					<a onClick={switchToClubAdmins}>
						<Text
							className={
								currentTab == Tab.Admins
									? classes.activeTab
									: classes.inactiveTab
							}
						>
							Club Admins
						</Text>
					</a>
					<Space w="lg" />
					<a onClick={switchToIntegrations}>
						<Text
							className={
								currentTab == Tab.Integrations
									? classes.activeTab
									: classes.inactiveTab
							}
						>
							Integrations
						</Text>
					</a>
				</div>
				{currentTab === Tab.Membership && (
					<div>
						<Space h="lg" />

						<Text className={classes.membershipText}>
							This club is open for{' '}
							<span className={classes.membershipSelector}>{whoCanJoin}</span>{' '}
							to join.
						</Text>
						<Text className={classes.membershipText}>
							Our membership token costs{' '}
							<span className={classes.membershipSelector}>
								{tokenQuantity} {tokenSymbol}
							</span>{' '}
							to mint.
						</Text>
						<Text className={classes.membershipText}>
							Minting starts{' '}
							<span className={classes.membershipSelector}>{mintingStart}</span>{' '}
							and ends{' '}
							<span className={classes.membershipSelector}>{mintingEnd}</span>.
						</Text>
					</div>
				)}

				{currentTab === Tab.Admins && (
					<div>
						<Text className={classes.clubAdminsPrompt}>
							Who can manage this club’s profile and membership settings?
						</Text>
						<Text className={classes.clubAdminsInstructions}>
							Add a line break between each address. Note that the club creator
							will always have admin permissions.
						</Text>
						<div className={classes.adminsTextAreaContainer}>
							<Textarea
								classNames={{ input: classes.adminsTextArea }}
								radius="lg"
								size="md"
								value={clubAdminsString}
								minRows={10}
								onChange={event => parseClubAdmins(event.currentTarget.value)}
							/>
							<Chips
								color={'rgba(0, 0, 0, 0.05)'}
								className={classes.primaryAdminChip}
								variant="filled"
							>
								<Chip size="md" value="" checked={false}>
									<div className={classes.primaryAdminChipContents}>
										<Lock width={16} height={16} />
										<Space w={4} />
										<Text>{primaryClubAdmin}</Text>
									</div>
								</Chip>
							</Chips>
						</div>
					</div>
				)}

				<Button className={classes.buttonSaveChanges}>Save Changes</Button>
			</Container>
		</>
	)
}
