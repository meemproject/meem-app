/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	createStyles,
	Text,
	Button,
	Space,
	Modal,
	RadioGroup,
	Radio,
	TextInput,
	Textarea,
	Chips,
	Chip,
	Select
} from '@mantine/core'
import React, { useState } from 'react'
import { CircleMinus, Plus, Lock } from 'tabler-icons-react'

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
		lineHeight: 2,
		position: 'relative'
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
	},
	removeAdditionalReq: {
		position: 'absolute',
		top: 8,
		left: -40,
		color: 'rgba(255, 102, 81, 1)',
		cursor: 'pointer'
	},
	radio: { fontWeight: '600', fontFamily: 'Inter' },
	visible: {
		display: 'block'
	},
	invisible: {
		display: 'none'
	},
	buttonModalSave: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	approvedAddressesTextAreaContainer: {
		position: 'relative'
	},
	approvedAddressesTextArea: {
		paddingTop: 48,
		paddingLeft: 32
	},
	primaryApprovedAddressChip: {
		position: 'absolute',
		pointerEvents: 'none',
		top: 12,
		left: 12
	},
	primaryApprovedAddressChipContents: {
		display: 'flex',
		alignItems: 'center'
	},
	modalHeaderText: {
		fontSize: 18,
		fontWeight: '600',
		color: 'rgba(0, 0, 0, 0.3)',
		marginBottom: 4,
		marginTop: 16
	}
}))

enum MembershipReqType {
	Anyone,
	ApprovedApplicants,
	TokenHolders,
	NftHolders
}

interface MembershipRequirement {
	index: number
	type: MembershipReqType
	// Applicants
	applicationLink: string
	approvedAddresses: string[]
	approvedAddressesString: string
	// NFT holders
	nftChain: string
	nftContractAddress: string
	nftTokenStandard: string
	// Token holders
	tokenChain: string
	tokenAddress: string
	tokenMinQuantity: number
}

export const ClubAdminMembershipSettingsComponent: React.FC = () => {
	// General properties / tab management
	const { classes } = useStyles()

	// Membership
	// TODO: hook up to data
	const [membershipRequirements, setMembershipRequirements] = useState<
		MembershipRequirement[]
	>([
		{
			index: 0,
			type: MembershipReqType.Anyone,
			applicationLink: '',
			approvedAddresses: [],
			approvedAddressesString: '',
			nftChain: '',
			nftContractAddress: '',
			nftTokenStandard: '',
			tokenChain: '',
			tokenAddress: '',
			tokenMinQuantity: 0
		}
	])

	const lockedApprovedAddress = 'gadsby.eth' // TODO: use club main admin here

	const [reqCurrentlyEditing, updateReqCurrentlyEditing] =
		useState<MembershipRequirement>(membershipRequirements[0])

	const updateMembershipRequirement = (updatedReq: MembershipRequirement) => {
		const newReqs = [...membershipRequirements]
		newReqs.forEach(currentReq => {
			if (currentReq.index == updatedReq.index) {
				newReqs[currentReq.index] = updatedReq
			}
		})
		setMembershipRequirements(newReqs)
	}

	const addMembershipRequirement = () => {
		const newReqs = [...membershipRequirements]
		newReqs.push({
			index: membershipRequirements.length + 1,
			type: MembershipReqType.Anyone,
			applicationLink: '',
			approvedAddresses: [],
			approvedAddressesString: '',
			nftChain: '',
			nftContractAddress: '',
			nftTokenStandard: '',
			tokenChain: '',
			tokenAddress: '',
			tokenMinQuantity: 0
		})
		setMembershipRequirements(newReqs)
	}

	const removeMembershipRequirement = (index: number) => {
		const newReqs = membershipRequirements.filter(item => item.index == index)
		setMembershipRequirements(newReqs)
	}

	const parseApprovedAddresses = (rawString: string): string[] => {
		const approvedAddressesList = rawString.split('\n')
		const finalList: string[] = []
		approvedAddressesList.forEach(potentialApprovedAddress => {
			if (potentialApprovedAddress.length > 0) {
				finalList.push(potentialApprovedAddress)
			}
		})
		finalList.push(lockedApprovedAddress)
		console.log(`approved addresses count = ${finalList.length}`)
		return finalList
	}

	const [isMembershipReqModalOpened, setMembershipReqModalOpened] =
		useState(false)
	const openMembershipReqModal = (index: number) => {
		updateReqCurrentlyEditing(membershipRequirements[index])
		setMembershipReqModalOpened(true)
	}

	const [isSecondReqTypeModalOpened, setSecondReqTypeModalOpened] =
		useState(false)
	const openSecondReqTypeModal = () => {
		// e.g. in addition vs alternatively
		setSecondReqTypeModalOpened(true)
	}

	const [isMembershipTimingModalOpened, setMembershipTimingModalOpened] =
		useState(false)
	const openMembershipTimingModal = () => {
		// e.g. now or later (w/ calendar)
		setMembershipTimingModalOpened(true)
	}

	const [isMembershipCostModalOpened, setMembershipCostModalOpened] =
		useState(false)
	const openMembershipCostModal = () => {
		// e.g. membership costs X
		setMembershipCostModalOpened(true)
	}

	const [isMembershipQuantityModalOpened, setMembershipQuantityModalOpened] =
		useState(false)
	const openMembershipQuantityModal = () => {
		// e.g. there are unlimited memberships available
		setMembershipQuantityModalOpened(true)
	}

	return (
		<>
			<div>
				<Space h="lg" />
				<Text className={classes.membershipSettingHeader}>Requirements</Text>
				<Text className={classes.membershipText}>
					This club is open for{' '}
					<a
						onClick={() => {
							openMembershipReqModal(0)
						}}
					>
						<span className={classes.membershipSelector}>anyone</span>
					</a>{' '}
					to join.
				</Text>
				{membershipRequirements.length > 1 && (
					<Text className={classes.membershipTextAdditionalReq}>
						<a onClick={openSecondReqTypeModal}>
							<span className={classes.membershipSelector}>In addition</span>
						</a>
						, members must{' '}
						<a
							onClick={() => {
								openMembershipReqModal(1)
							}}
						>
							<span className={classes.membershipSelector}>...</span>
						</a>
						.
						<CircleMinus
							onClick={() => {
								// Hardcoded for now as there's only one additional req in v1
								removeMembershipRequirement(1)
							}}
							className={classes.removeAdditionalReq}
						/>
					</Text>
				)}
				{membershipRequirements.length === 0 && (
					<Button
						onClick={() => {
							addMembershipRequirement()
						}}
						className={classes.addRequirementButton}
						size={'md'}
						leftIcon={<Plus size={14} />}
					>
						Add another requirement
					</Button>
				)}

				<Space h="lg" />

				<Text className={classes.membershipSettingHeader}>Price</Text>

				<Text className={classes.membershipText}>
					Our club costs{' '}
					<a onClick={openMembershipCostModal}>
						<span className={classes.membershipSelector}>1 ETH</span>
					</a>{' '}
					to join.
				</Text>
				<Space h="lg" />

				<Text className={classes.membershipSettingHeader}>Capacity</Text>

				<Text className={classes.membershipText}>
					There are{' '}
					<a onClick={openMembershipQuantityModal}>
						<span className={classes.membershipSelector}>unlimited</span>
					</a>{' '}
					memberships available.
				</Text>
				<Space h="lg" />
				<Text className={classes.membershipSettingHeader}>Timing</Text>

				<Text className={classes.membershipText}>
					Minting starts{' '}
					<a onClick={openMembershipTimingModal}>
						<span className={classes.membershipSelector}>now</span>
					</a>{' '}
					and ends{' '}
					<a onClick={openMembershipTimingModal}>
						<span className={classes.membershipSelector}>never</span>
					</a>
					.
				</Text>
				<Space h="lg" />
				<Button className={classes.buttonSaveChanges}>Save Changes</Button>
				<Space h="lg" />
				<Modal
					withCloseButton={false}
					centered
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					padding={'sm'}
					opened={isMembershipReqModalOpened}
					onClose={() => setMembershipReqModalOpened(false)}
				>
					<RadioGroup
						classNames={{ label: classes.radio }}
						orientation="vertical"
						spacing={12}
						size="lg"
						color="dark"
						value={
							reqCurrentlyEditing.type === MembershipReqType.Anyone
								? 'anyone'
								: reqCurrentlyEditing.type ===
								  MembershipReqType.ApprovedApplicants
								? 'approved-applicants'
								: reqCurrentlyEditing.type === MembershipReqType.TokenHolders
								? 'token-holders'
								: 'nft-holders'
						}
						onChange={value => {
							switch (value) {
								case 'anyone':
									reqCurrentlyEditing.type = MembershipReqType.Anyone
									updateMembershipRequirement(reqCurrentlyEditing)
									break
								case 'approved-applicants':
									reqCurrentlyEditing.type =
										MembershipReqType.ApprovedApplicants
									updateMembershipRequirement(reqCurrentlyEditing)
									break
								case 'token-holders':
									reqCurrentlyEditing.type = MembershipReqType.TokenHolders
									updateMembershipRequirement(reqCurrentlyEditing)
									break
								case 'nft-holders':
									reqCurrentlyEditing.type = MembershipReqType.NftHolders
									updateMembershipRequirement(reqCurrentlyEditing)
									break
							}
						}}
						required
					>
						<Radio value="anyone" label="anyone" />
						<Radio value="approved-applicants" label="approved applicants" />
						<Radio value="token-holders" label="token holders" />
						<Radio value="nft-holders" label="NFT holders" />
					</RadioGroup>
					<div
						className={
							reqCurrentlyEditing.type == MembershipReqType.ApprovedApplicants
								? classes.visible
								: classes.invisible
						}
					>
						<Text className={classes.modalHeaderText}>Application Link</Text>
						<TextInput
							radius="lg"
							size="md"
							value={reqCurrentlyEditing.applicationLink}
							onChange={event => {
								reqCurrentlyEditing.applicationLink = event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
						<Text className={classes.modalHeaderText}>Approved Addresses</Text>

						<div className={classes.approvedAddressesTextAreaContainer}>
							<Textarea
								classNames={{ input: classes.approvedAddressesTextArea }}
								radius="lg"
								size="md"
								value={reqCurrentlyEditing.approvedAddressesString}
								minRows={5}
								onChange={event => {
									reqCurrentlyEditing.approvedAddressesString =
										event.currentTarget.value
									reqCurrentlyEditing.approvedAddresses =
										parseApprovedAddresses(event.currentTarget.value)
									updateMembershipRequirement(reqCurrentlyEditing)
								}}
							/>
							<Chips
								color={'rgba(0, 0, 0, 0.05)'}
								className={classes.primaryApprovedAddressChip}
								variant="filled"
							>
								<Chip size="md" value="" checked={false}>
									<div className={classes.primaryApprovedAddressChipContents}>
										<Lock width={16} height={16} />
										<Space w={4} />
										<Text>{lockedApprovedAddress}</Text>
									</div>
								</Chip>
							</Chips>
						</div>
					</div>
					<div
						className={
							reqCurrentlyEditing.type == MembershipReqType.NftHolders
								? classes.visible
								: classes.invisible
						}
					>
						<Text className={classes.modalHeaderText}>Chain</Text>
						<Select
							data={[{ value: 'eth', label: 'Ethereum' }]}
							size={'md'}
							radius={'md'}
							value={'eth'}
						/>

						<Text className={classes.modalHeaderText}>Contract Address</Text>
						<Text className={classes.modalHeaderText}>Token Standard</Text>
					</div>
					<div
						className={
							reqCurrentlyEditing.type == MembershipReqType.TokenHolders
								? classes.visible
								: classes.invisible
						}
					></div>
					<Space h={'md'} />
					<Button
						onClick={() => {
							updateMembershipRequirement(reqCurrentlyEditing)
							setMembershipReqModalOpened(false)
						}}
						className={classes.buttonModalSave}
					>
						Save
					</Button>
				</Modal>
			</div>
		</>
	)
}
