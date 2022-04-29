import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Tabs,
	Space
} from '@mantine/core'
import React, { useState } from 'react'
import { Edit, Settings } from 'tabler-icons-react'

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
	membershipText: { fontSize: 20, marginTop: 24, lineHeight: 2 },

	membershipSelector: {
		padding: 4,
		borderRadius: 8,
		fontWeight: 'bold',
		backgroundColor: 'rgba(255, 102, 81, 0.1)',
		color: 'rgba(255, 102, 81, 1)'
	}
}))

enum Tab {
	Membership,
	Admins
}

export const ClubEditComponent: React.FC = () => {
	const { classes } = useStyles()
	const [isLoading, setIsLoading] = useState(true)
	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Membership)

	const [whoCanJoin, setWhoCanJoin] = useState('anyone')
	const [tokenQuantity, setTokenQuantity] = useState('0')
	const [tokenSymbol, setTokenSymbol] = useState('ETH')
	const [mintingStart, setMintingStart] = useState('now')
	const [mintingEnd, setMintingEnd] = useState('never')

	const switchToMembership = () => {
		setCurrentTab(Tab.Membership)
	}

	const switchToClubAdmins = () => {
		setCurrentTab(Tab.Admins)
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
				</div>
				{currentTab === Tab.Membership && (
					<Text className={classes.membershipText}>
						This club is open for{' '}
						<span className={classes.membershipSelector}>{whoCanJoin}</span> to
						join. Our membership token costs{' '}
						<span className={classes.membershipSelector}>
							{tokenQuantity} {tokenSymbol}
						</span>{' '}
						to mint. Minting starts{' '}
						<span className={classes.membershipSelector}>{mintingStart}</span>{' '}
						and ends{' '}
						<span className={classes.membershipSelector}>{mintingEnd}</span>.
					</Text>
				)}

				<Button className={classes.buttonSaveChanges}>Save Changes</Button>
			</Container>
		</>
	)
}
