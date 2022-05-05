import { createStyles, Text, Button, Space } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Plus } from 'tabler-icons-react'

const useStyles = createStyles(theme => ({
	buttonSaveChanges: {
		marginTop: 48,
		marginBottom: 48,

		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	// Membership tab
	membershipText: { fontSize: 20, marginBottom: 8, lineHeight: 2 },
	membershipTextAdditionalReq: {
		fontSize: 20,
		marginBottom: 16,
		lineHeight: 2
	},

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
	membershipSettingHeader: {
		fontSize: 16,
		color: 'rgba(0, 0, 0, 0.5)',
		fontWeight: '600',
		marginBottom: 12
	}
}))

export const ClubAdminMembershipSettingsComponent: React.FC = () => {
	// General properties / tab management
	const { classes } = useStyles()

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

	return (
		<>
			<div>
				<Space h="lg" />
				<Text className={classes.membershipSettingHeader}>Requirements</Text>
				<Text className={classes.membershipText}>
					This club is open for{' '}
					<a onClick={chooseMembershipReqType}>
						<span className={classes.membershipSelector}>anyone</span>
					</a>{' '}
					to join.
				</Text>
				<Text className={classes.membershipTextAdditionalReq}>
					<a onClick={chooseAdditionalMembershipReqAndOr}>
						<span className={classes.membershipSelector}>In addition</span>
					</a>
					, members must{' '}
					<a onClick={chooseAdditionalMembershipReqType}>
						<span className={classes.membershipSelector}>...</span>
					</a>
					.
				</Text>
				<Button
					onClick={addAdditionalRequirement}
					className={classes.addRequirementButton}
					size={'md'}
					leftIcon={<Plus size={14} />}
				>
					Add another requirement
				</Button>
				<Space h="lg" />

				<Text className={classes.membershipSettingHeader}>Price</Text>

				<Text className={classes.membershipText}>
					Our club costs{' '}
					<a onClick={chooseMembershipMintQuantity}>
						<span className={classes.membershipSelector}>1 ETH</span>
					</a>{' '}
					to join.
				</Text>
				<Space h="lg" />

				<Text className={classes.membershipSettingHeader}>Capacity</Text>

				<Text className={classes.membershipText}>
					There are{' '}
					<span className={classes.membershipSelector}>unlimited</span>{' '}
					memberships available.
				</Text>
				<Space h="lg" />
				<Text className={classes.membershipSettingHeader}>Timing</Text>

				<Text className={classes.membershipText}>
					Minting starts <span className={classes.membershipSelector}>now</span>{' '}
					and ends <span className={classes.membershipSelector}>never</span>.
				</Text>
				<Space h="lg" />
				<Button className={classes.buttonSaveChanges}>Save Changes</Button>
				<Space h="lg" />
			</div>
		</>
	)
}
