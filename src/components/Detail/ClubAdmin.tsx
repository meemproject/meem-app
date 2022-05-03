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
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Edit, Settings, Lock, ArrowLeft, Plus } from 'tabler-icons-react'

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
	headerArrow: {
		marginRight: 24,
		cursor: 'pointer'
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
	// Membership tab
	membershipText: { fontSize: 20, marginBottom: 8, lineHeight: 2 },
	membershipSelector: {
		padding: 4,
		borderRadius: 8,
		fontWeight: 'bold',
		backgroundColor: 'rgba(255, 102, 81, 0.1)',
		color: 'rgba(255, 102, 81, 1)',
		cursor: 'pointer'
	},
	addRequirementButton: {
		backgroundColor: 'white',
		color: 'rgba(255, 102, 81, 1)',
		border: '1px dashed rgba(255, 102, 81, 1)',
		borderRadius: 24,
		'&:hover': {
			backgroundColor: 'rgba(255, 102, 81, 0.05)'
		},
		marginBottom: 8
	},
	// Admins tab
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
	},
	// Integrations tab
	clubIntegrationsHeader: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '600',
		marginTop: 36,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	clubIntegrationItem: {
		display: 'flex',
		alignItems: 'center',
		fontWeight: '600',
		marginBottom: 8,
		cursor: 'pointer',
		width: '100px'
	}
}))

enum Tab {
	Membership,
	Admins,
	Integrations
}

export const ClubAdminComponent: React.FC = () => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Membership)

	const navigateToClubDetail = () => {
		router.push({ pathname: '/club/clubname' })
	}

	const switchToMembership = () => {
		setCurrentTab(Tab.Membership)
	}

	const switchToClubAdmins = () => {
		setCurrentTab(Tab.Admins)
	}

	const switchToIntegrations = () => {
		setCurrentTab(Tab.Integrations)
	}

	// Membership
	// TODO: hook up to data
	//const [whoCanJoin, setWhoCanJoin] = useState('anyone')
	// const [tokenLimit, setTokenLimit] = useState('unlimited')
	// const [tokenQuantity, setTokenQuantity] = useState('0')
	// const [tokenSymbol, setTokenSymbol] = useState('ETH')
	// const [mintingStart, setMintingStart] = useState('now')
	// const [mintingEnd, setMintingEnd] = useState('never')

	const addAdditionalRequirement = () => {
		// TODO
	}

	const [membershipReqTypeModalOpened, setMembershipReqTypeModalOpened] =
		useState(false)
	const chooseMembershipReqType = () => {
		// e.g. anyone, approved applicants
		setMembershipReqTypeModalOpened(true)
	}

	const [tokenHolderReqsModalOpened, setTokenHolderReqsModalOpened] =
		useState(false)
	const chooseTokenHolderReqs = () => {
		// e.g members must hold 1 MATIC
		// e.g. chain, token, quantity
		setTokenHolderReqsModalOpened(true)
	}

	const [mintingDatesModalOpened, setMintingDatesModalOpened] = useState(false)
	const chooseMintingDates = () => {
		// e.g. now or later (w/ calendar)
		setMintingDatesModalOpened(true)
	}

	const [
		addtionalMembershipReqAndOrModalOpened,
		setAddtionalMembershipReqAndOrModalOpened
	] = useState(false)
	const chooseAdditionalMembershipReqAndOr = () => {
		// e.g in addition vs alternatively
		setAddtionalMembershipReqAndOrModalOpened(true)
	}

	const [additionalReqTypeModalOpened, setAdditionalReqTypeModalOpened] =
		useState(false)
	const chooseAdditionalMembershipReqType = () => {
		// e.g. choose an application, hold a token, hold an NFT
		setAdditionalReqTypeModalOpened(true)
	}
	const [membershipMintCostModalOpened, setMembershipMintCostModalOpened] =
		useState(false)
	const chooseMembershipMintCost = () => {
		// e.g. our tokens costs X to mint
		setMembershipMintCostModalOpened(true)
	}

	const [
		membershipMintQuantityModalOpened,
		setMembershipMintQuantityModalOpened
	] = useState(false)
	const chooseMembershipMintQuantity = () => {
		// e.g. there are unlimited tokens available
		setMembershipMintQuantityModalOpened(true)
	}

	// Club admins
	const [primaryClubAdmin, setPrimaryClubAdmin] = useState('gadsby.eth')
	const [clubAdminsString, setClubAdminsString] = useState('')
	const [clubAdmins, setClubAdmins] = useState<string[]>([])

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

	// Integrations

	const handleTwitterIntegration = () => {}
	const handleDiscordIntegration = () => {}
	const handleGuildIntegration = () => {}
	const handleSliksafeIntegration = () => {}
	const handleTellieIntegration = () => {}
	const handleClarityIntegration = () => {}
	const handleGnosisIntegration = () => {}
	const handleMycoIntegration = () => {}
	const handleOrcaIntegration = () => {}

	return (
		<>
			<div className={classes.header}>
				<div className={classes.headerTitle}>
					<a onClick={navigateToClubDetail}>
						<ArrowLeft className={classes.headerArrow} size={32} />
					</a>
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
							<a onClick={chooseMembershipReqType}>
								<span className={classes.membershipSelector}>anyone</span>
							</a>{' '}
							to join.
						</Text>
						<Button
							onClick={addAdditionalRequirement}
							className={classes.addRequirementButton}
							size={'md'}
							leftIcon={<Plus size={14} />}
						>
							Add another requirement
						</Button>
						<Text className={classes.membershipText}>
							<a onClick={chooseAdditionalMembershipReqAndOr}>
								<span className={classes.membershipSelector}>In addition</span>
							</a>
							, members must{' '}
							<a onClick={chooseAdditionalMembershipReqType}>
								<span className={classes.membershipSelector}>...</span>
							</a>
							.
						</Text>
						<Text className={classes.membershipText}>
							Our membership token costs{' '}
							<a onClick={chooseMembershipMintQuantity}>
								<span className={classes.membershipSelector}>1 ETH</span>
							</a>{' '}
							to mint. There are
							<span className={classes.membershipSelector}>unlimited</span>{' '}
							tokens available.
						</Text>
						<Text className={classes.membershipText}>
							Minting starts{' '}
							<span className={classes.membershipSelector}>now</span> and ends{' '}
							<span className={classes.membershipSelector}>never</span>.
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

				{currentTab === Tab.Integrations && (
					<div>
						<Text className={classes.clubIntegrationsHeader}>Social</Text>
						<a onClick={handleTwitterIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-twitter.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Twitter</Text>
							</div>
						</a>
						<a onClick={handleDiscordIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-discord.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Discord</Text>
							</div>
						</a>
						<Text className={classes.clubIntegrationsHeader}>Token Gating</Text>
						<a onClick={handleGuildIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-guild.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Guild</Text>
							</div>
						</a>
						<a onClick={handleSliksafeIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-sliksafe.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Sliksafe</Text>
							</div>
						</a>
						<a onClick={handleTellieIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-tellie.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Tellie</Text>
							</div>
						</a>
						<a onClick={handleClarityIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-clarity.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Clarity</Text>
							</div>
						</a>
						<Text className={classes.clubIntegrationsHeader}>DAO Tools</Text>
						<a onClick={handleGnosisIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-gnosis.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Gnosis</Text>
							</div>
						</a>
						<a onClick={handleMycoIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-myco.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Myco</Text>
							</div>
						</a>
						<a onClick={handleOrcaIntegration}>
							<div className={classes.clubIntegrationItem}>
								<Image
									src="/integration-orca.png"
									width={16}
									height={16}
									fit={'contain'}
								/>
								<Space w={'xs'} />
								<Text>Orca</Text>
							</div>
						</a>
						<Space h="xl" />
					</div>
				)}
				{currentTab === Tab.Membership ||
					(currentTab == Tab.Admins && (
						<Button className={classes.buttonSaveChanges}>Save Changes</Button>
					))}
			</Container>
		</>
	)
}
