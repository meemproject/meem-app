/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
	Select,
	Center,
	Divider
} from '@mantine/core'
import { Calendar, DatePicker, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CircleMinus, Plus, Lock, Clock } from 'tabler-icons-react'
import {
	MembershipSettings,
	MembershipReqAndor,
	MembershipReqType,
	MembershipRequirement,
	Club
} from '../../model/club/club'
import { truncatedWalletAddress } from '../../utils/truncated_wallet'
import { CreateClubTransactionsModal } from '../Create/CreateClubTransactionsModal'

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
	manageClubHeader: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	},
	membershipText: {
		fontSize: 20,
		marginBottom: 8,
		lineHeight: 2,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	membershipTextAdditionalReq: {
		fontSize: 20,
		marginBottom: 16,
		marginTop: 16,
		lineHeight: 2,
		position: 'relative',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
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
		fontWeight: 600,
		marginBottom: 12
	},
	removeAdditionalReq: {
		color: 'rgba(255, 102, 81, 1)',
		cursor: 'pointer',
		marginRight: 8,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: -6
		}
	},
	radio: { fontWeight: 600, fontFamily: 'Inter' },
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
	buttonModalCancel: {
		marginLeft: 8,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
		fontWeight: 600,
		color: 'rgba(0, 0, 0, 0.3)',
		marginBottom: 4,
		marginTop: 16
	},
	// Admins
	clubAdminsPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
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

interface IProps {
	isCreatingClub: boolean
	club?: Club
}

export const ClubAdminMembershipSettingsComponent: React.FC<IProps> = ({
	isCreatingClub,
	club
}) => {
	const { classes } = useStyles()

	const router = useRouter()

	const wallet = useWallet()

	const [hasLoadedClubData, setHasLoadedClubData] = useState(false)

	// Membership
	const [membershipSettings, setMembershipSettings] =
		useState<MembershipSettings>()

	const [membershipRequirements, setMembershipRequirements] = useState<
		MembershipRequirement[]
	>([
		{
			index: 0,
			andor: MembershipReqAndor.None,
			type: MembershipReqType.None,
			applicationLink: '',
			approvedAddresses: [],
			approvedAddressesString: '',
			tokenName: '',
			tokenChain: 'matic',
			tokenContractAddress: '',
			tokenMinQuantity: 0,
			clubContractAddress: '',
			clubName: ''
		}
	])

	// Cost to join
	// Note: Not used in MVP
	const [costToJoin, setCostToJoin] = useState(0)
	const [membershipFundsAddress, setMembershipFundsAddress] = useState('')

	// Membership quantity
	const [membershipQuantity, setMembershipQuantity] = useState(0)

	// Membership timing / dates
	const [membershipStartDate, setMembershipStartDate] = useState<
		Date | undefined
	>(undefined)

	const [membershipEndDate, setMembershipEndDate] = useState<Date | undefined>(
		undefined
	)

	const [lockedMainAdmin, setLockedMainAdmin] = useState('')

	// Club admins
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
			index: membershipRequirements.length,
			andor: MembershipReqAndor.And,
			type: MembershipReqType.None,
			applicationLink: '',
			approvedAddresses: [],
			approvedAddressesString: '',
			tokenName: '',
			tokenChain: 'matic',
			tokenContractAddress: '',
			tokenMinQuantity: 0,
			clubContractAddress: '',
			clubName: ''
		})
		setMembershipRequirements(newReqs)
	}

	const removeMembershipRequirement = (index: number) => {
		const newReqs = membershipRequirements.filter(item => item.index !== index)
		setMembershipRequirements(newReqs)
		updateReqCurrentlyEditing(membershipRequirements[0])
	}

	const parseApprovedAddresses = (rawString: string): string[] => {
		const approvedAddressesList = rawString.split('\n')
		const finalList: string[] = []
		approvedAddressesList.forEach(potentialApprovedAddress => {
			if (potentialApprovedAddress.length > 0) {
				finalList.push(potentialApprovedAddress)
			}
		})
		if (!finalList.includes(lockedMainAdmin)) {
			finalList.push(lockedMainAdmin)
		}
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
		updateReqCurrentlyEditing(membershipRequirements[1])
		setSecondReqTypeModalOpened(true)
	}

	const [
		isMembershipTimingStartModalOpened,
		setMembershipTimingStartModalOpened
	] = useState(false)
	const openMembershipStartTimingModal = () => {
		// e.g. start now or later (w/ calendar)
		setMembershipTimingStartModalOpened(true)
	}

	const [isMembershipTimingEndModalOpened, setMembershipTimingEndModalOpened] =
		useState(false)
	const openMembershipTimingEndModal = () => {
		// e.g. end now or later (w/ calendar)
		setMembershipTimingEndModalOpened(true)
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

	const [isTransactionsModalOpened, setTransactionsModalOpened] =
		useState(false)
	const openTransactionsModal = () => {
		// transactions modal for club creation
		// convert current settings and update for the modal

		const finalClubAdmins = Object.assign([], clubAdmins)
		finalClubAdmins.push(wallet.accounts[0])

		const settings: MembershipSettings = {
			requirements: membershipRequirements,
			costToJoin,
			membershipFundsAddress,
			membershipQuantity,
			membershipStartDate,
			membershipEndDate,
			clubAdmins: finalClubAdmins
		}
		setMembershipSettings(settings)
		setTransactionsModalOpened(true)
	}

	const membershipTypeStringForFirstReq = (
		req: MembershipRequirement
	): string => {
		switch (req.type) {
			case MembershipReqType.None:
				return 'anyone'
			case MembershipReqType.ApprovedApplicants:
				return 'approved applicants'
			case MembershipReqType.NftHolders:
				return 'NFT holders'
			case MembershipReqType.TokenHolders:
				return 'token holders'
			case MembershipReqType.OtherClubMember:
				return 'join another club' // Note: currently not an option for v1
		}
	}

	const membershipTypeStringForSecondReq = (
		req: MembershipRequirement
	): string => {
		switch (req.type) {
			case MembershipReqType.None:
				return '...'
			case MembershipReqType.ApprovedApplicants:
				return 'submit an approved application'
			case MembershipReqType.NftHolders:
				return `hold one ${membershipRequirements[1].tokenName}`
			case MembershipReqType.TokenHolders:
				return `hold ${membershipRequirements[1].tokenMinQuantity} ${membershipRequirements[1].tokenName}`
			case MembershipReqType.OtherClubMember:
				return `join ${membershipRequirements[1].clubName}`
		}
	}

	// Is the req we're currently editing the first requirement or not? This affects language and modal options
	const isEditedReqFirstReq: boolean = reqCurrentlyEditing.index === 0

	const saveChanges = async () => {
		// TODO
		setHasLoadedClubData(true)

		if (isCreatingClub) {
			openTransactionsModal()
		} else {
			// TODO
		}
	}

	useEffect(() => {
		if (isCreatingClub) {
			if (wallet.isConnected) {
				setLockedMainAdmin(wallet.accounts[0])
			}
		} else {
			if (club && !hasLoadedClubData) {
				setHasLoadedClubData(true)
				setClubAdmins(club.admins!)
				if (club.admins && club.admins!.length > 0) {
					setLockedMainAdmin(club.admins![0])
				} else {
					setLockedMainAdmin('null')
				}
				setCostToJoin(club.membershipSettings!.costToJoin)
				setMembershipQuantity(club.membershipSettings!.membershipQuantity)
				setMembershipRequirements(club.membershipSettings!.requirements)
				setMembershipSettings(club.membershipSettings)
				console.log(club.membershipSettings!.membershipStartDate)
				// if (club.membershipSettings!.membershipStartDate) {
				// 	setMembershipStartDate(club.membershipSettings!.membershipStartDate)
				// }
				// setMembershipEndDate(club.membershipSettings!.membershipEndDate)
				setMembershipFundsAddress(
					club.membershipSettings!.membershipFundsAddress
				)
			}
		}
	}, [
		club,
		hasLoadedClubData,
		isCreatingClub,
		wallet.accounts,
		wallet.isConnected
	])

	return (
		<>
			<div>
				<Space h="lg" />
				<Text className={classes.manageClubHeader}>Membership</Text>
				<Text className={classes.membershipSettingHeader}>Requirements</Text>
				<Text className={classes.membershipText}>
					This club is open for{' '}
					<a
						onClick={() => {
							openMembershipReqModal(0)
						}}
					>
						<span className={classes.membershipSelector}>
							{membershipTypeStringForFirstReq(membershipRequirements[0])}
						</span>
					</a>{' '}
					to join.{' '}
					{membershipRequirements[0].type ===
						MembershipReqType.ApprovedApplicants && (
						<>
							Members can apply{' '}
							<a
								onClick={() => {
									openMembershipReqModal(0)
								}}
							>
								<span className={classes.membershipSelector}>at this link</span>
							</a>
							.
						</>
					)}
					{membershipRequirements[0].type ===
						MembershipReqType.TokenHolders && (
						<>
							Members must hold{' '}
							<a
								onClick={() => {
									openMembershipReqModal(0)
								}}
							>
								<span className={classes.membershipSelector}>
									{membershipRequirements[0].tokenMinQuantity}{' '}
									{membershipRequirements[0].tokenName}
								</span>
							</a>
							.
						</>
					)}
					{membershipRequirements[0].type === MembershipReqType.NftHolders && (
						<>
							Members must hold one{' '}
							<a
								onClick={() => {
									openMembershipReqModal(0)
								}}
							>
								<span className={classes.membershipSelector}>
									{membershipRequirements[0].tokenName}
								</span>
							</a>
							.
						</>
					)}
				</Text>
				{membershipRequirements.length > 1 && (
					<Text className={classes.membershipTextAdditionalReq}>
						<CircleMinus
							onClick={() => {
								// Hardcoded for now as there's only one additional req in v1
								removeMembershipRequirement(1)
							}}
							className={classes.removeAdditionalReq}
						/>
						<a onClick={openSecondReqTypeModal}>
							<span className={classes.membershipSelector}>
								{membershipRequirements[1].andor === MembershipReqAndor.And
									? 'In addition'
									: 'Alternatively'}
							</span>
						</a>
						, members{' '}
						{membershipRequirements[1].andor === MembershipReqAndor.Or
							? 'can'
							: 'must'}{' '}
						<a
							onClick={() => {
								openMembershipReqModal(1)
							}}
						>
							<span className={classes.membershipSelector}>
								{membershipTypeStringForSecondReq(membershipRequirements[1])}
							</span>
						</a>{' '}
						to join.
					</Text>
				)}
				{membershipRequirements[0].type !== MembershipReqType.None &&
					membershipRequirements.length === 1 && (
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
					Our club {isNaN(costToJoin) || costToJoin === 0 ? 'is' : 'costs'}{' '}
					<a onClick={openMembershipCostModal}>
						<span className={classes.membershipSelector}>
							{isNaN(costToJoin) || costToJoin === 0 ? 'free' : costToJoin}
							{isNaN(costToJoin) || costToJoin === 0 ? '' : ' MATIC'}
						</span>
					</a>{' '}
					to join.{' '}
					{membershipFundsAddress.length > 0 && costToJoin > 0 && (
						<>
							Funds will be sent to{' '}
							<a onClick={openMembershipCostModal}>
								<span className={classes.membershipSelector}>
									{truncatedWalletAddress(membershipFundsAddress)}
								</span>
							</a>
							.
						</>
					)}
				</Text>
				<Space h="lg" />

				<Text className={classes.membershipSettingHeader}>Capacity</Text>
				<Text className={classes.membershipText}>
					There are{' '}
					<a onClick={openMembershipQuantityModal}>
						<span className={classes.membershipSelector}>
							{membershipQuantity === 0 || isNaN(membershipQuantity)
								? 'unlimited'
								: membershipQuantity}
						</span>
					</a>{' '}
					memberships available in total.
				</Text>
				<Space h="lg" />
				<Text className={classes.membershipSettingHeader}>Timing</Text>

				<Text className={classes.membershipText}>
					Memberships are available starting{' '}
					<a onClick={openMembershipStartTimingModal}>
						<span className={classes.membershipSelector}>
							{membershipStartDate === undefined
								? 'now'
								: `${membershipStartDate.toDateString()} at ${membershipStartDate.getHours()}:${
										membershipStartDate.getMinutes() > 9
											? membershipStartDate.getMinutes()
											: `0${membershipStartDate.getMinutes()}`
								  }`}
						</span>
					</a>{' '}
					until{' '}
					<a onClick={openMembershipTimingEndModal}>
						<span className={classes.membershipSelector}>
							{membershipEndDate === undefined
								? 'forever'
								: `${membershipEndDate.toDateString()} at ${membershipEndDate.getHours()}:${
										membershipEndDate.getMinutes() > 9
											? membershipEndDate.getMinutes()
											: `0${membershipEndDate.getMinutes()}`
								  }`}
						</span>
					</a>
					.
				</Text>
				<Space h={32} />

				<Divider />
				<Space h={32} />

				<Text className={classes.manageClubHeader}>Club Admins</Text>

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
									<Text>{truncatedWalletAddress(lockedMainAdmin)}</Text>
								</div>
							</Chip>
						</Chips>
					</div>
				</div>
				<Button
					disabled={hasLoadedClubData}
					loading={hasLoadedClubData}
					className={classes.buttonSaveChanges}
					onClick={saveChanges}
				>
					{isCreatingClub ? 'Launch Club' : 'Save Changes'}
				</Button>
				<Space h="lg" />
				<Modal
					withCloseButton={false}
					centered
					overlayBlur={8}
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
							reqCurrentlyEditing.type === MembershipReqType.None
								? 'anyone'
								: reqCurrentlyEditing.type ===
								  MembershipReqType.ApprovedApplicants
								? 'approved-applicants'
								: reqCurrentlyEditing.type === MembershipReqType.TokenHolders
								? 'token-holders'
								: reqCurrentlyEditing.type === MembershipReqType.NftHolders
								? 'nft-holders'
								: 'other-club-member'
						}
						onChange={value => {
							switch (value) {
								case 'anyone':
									reqCurrentlyEditing.type = MembershipReqType.None
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
								case 'other-club-member':
									reqCurrentlyEditing.type = MembershipReqType.OtherClubMember
									updateMembershipRequirement(reqCurrentlyEditing)
									break
							}
						}}
						required
					>
						{isEditedReqFirstReq && <Radio value="anyone" label="anyone" />}
						<Radio
							value="approved-applicants"
							label={
								isEditedReqFirstReq
									? 'approved applicants'
									: 'submit an approved application'
							}
						/>
						<Radio
							value="token-holders"
							label={isEditedReqFirstReq ? 'token holders' : 'hold a token'}
						/>
						<Radio
							value="nft-holders"
							label={isEditedReqFirstReq ? 'NFT holders' : 'hold an NFT'}
						/>
						{!isEditedReqFirstReq && (
							<Radio
								value="other-club-member"
								label="join another club"
								disabled
							/>
						)}
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
										<Text>{truncatedWalletAddress(lockedMainAdmin)}</Text>
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
						{/* <Text className={classes.modalHeaderText}>Chain</Text>
						<Select
							data={[
								{
									value: 'eth',
									label: 'Ethereum'
								},
								{ value: 'matic', label: 'MATIC' }
							]}
							size={'md'}
							radius={'lg'}
							onChange={value => {
								reqCurrentlyEditing.tokenChain = value ?? 'eth'
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
							value={reqCurrentlyEditing.tokenChain}
						/> */}
						<Text className={classes.modalHeaderText}>Token Name</Text>
						<TextInput
							radius="lg"
							size="md"
							value={reqCurrentlyEditing.tokenName}
							onChange={event => {
								reqCurrentlyEditing.tokenName = event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
						<Text className={classes.modalHeaderText}>Contract Address</Text>
						<TextInput
							radius="lg"
							size="md"
							value={reqCurrentlyEditing.tokenContractAddress}
							onChange={event => {
								reqCurrentlyEditing.tokenContractAddress = event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
					</div>
					<div
						className={
							reqCurrentlyEditing.type == MembershipReqType.TokenHolders
								? classes.visible
								: classes.invisible
						}
					>
						{/* <Text className={classes.modalHeaderText}>Chain</Text>
						<Select
							data={[
								{
									value: 'eth',
									label: 'Ethereum'
								},
								{ value: 'matic', label: 'MATIC' }
							]}
							size={'md'}
							radius={'lg'}
							onChange={value => {
								reqCurrentlyEditing.tokenChain = value ?? 'eth'
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
							value={reqCurrentlyEditing.tokenChain}
						/> */}
						<Text className={classes.modalHeaderText}>Token Name</Text>
						<TextInput
							radius="lg"
							size="md"
							value={reqCurrentlyEditing.tokenName}
							onChange={event => {
								reqCurrentlyEditing.tokenName = event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
						<Text className={classes.modalHeaderText}>Token Address</Text>
						<TextInput
							radius="lg"
							size="md"
							value={reqCurrentlyEditing.tokenContractAddress}
							onChange={event => {
								reqCurrentlyEditing.tokenContractAddress = event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
						<Text className={classes.modalHeaderText}>Minimum Quantity</Text>
						<TextInput
							radius="lg"
							size="md"
							type="number"
							value={reqCurrentlyEditing.tokenMinQuantity}
							onChange={event => {
								reqCurrentlyEditing.tokenMinQuantity = parseInt(
									event.target.value
								)
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
					</div>
					<div
						className={
							reqCurrentlyEditing.type == MembershipReqType.OtherClubMember
								? classes.visible
								: classes.invisible
						}
					>
						<Text className={classes.modalHeaderText}>Club Name</Text>

						<TextInput
							radius="lg"
							size="md"
							value={reqCurrentlyEditing.clubName}
							onChange={event => {
								// TODO: Look up club and retrive club contract address!
								reqCurrentlyEditing.clubName = event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
					</div>
					<Space h={'md'} />
					<Button
						onClick={() => {
							switch (reqCurrentlyEditing.type) {
								case MembershipReqType.ApprovedApplicants:
									if (reqCurrentlyEditing.applicationLink.length === 0) {
										showNotification({
											title: 'Oops!',
											message: 'Please enter an application link.'
										})
										return
									}

									// Add locked admin as primary approved address if it doesn't exist
									if (reqCurrentlyEditing.approvedAddresses.length === 0) {
										reqCurrentlyEditing.approvedAddresses = [lockedMainAdmin]
										updateMembershipRequirement(reqCurrentlyEditing)
									}

									break
								case MembershipReqType.TokenHolders:
									if (reqCurrentlyEditing.tokenContractAddress.length < 10) {
										showNotification({
											title: 'Oops!',
											message: 'Please enter a valid contract address.'
										})
										return
									} else if (reqCurrentlyEditing.tokenMinQuantity === 0) {
										showNotification({
											title: 'Oops!',
											message: 'Please enter a minimum token quantity.'
										})
										return
									}
									break
								case MembershipReqType.NftHolders:
									if (reqCurrentlyEditing.tokenContractAddress.length < 10) {
										showNotification({
											title: 'Oops!',
											message: 'Please enter a valid contract address.'
										})
										return
									}
									break
							}

							setMembershipReqModalOpened(false)
						}}
						className={classes.buttonModalSave}
					>
						Done
					</Button>
					{!isEditedReqFirstReq && (
						<Button
							onClick={() => {
								setMembershipReqModalOpened(false)
							}}
							className={classes.buttonModalCancel}
						>
							Cancel
						</Button>
					)}
				</Modal>
				<Modal
					withCloseButton={false}
					centered
					overlayBlur={8}
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					padding={'sm'}
					opened={isSecondReqTypeModalOpened}
					onClose={() => setSecondReqTypeModalOpened(false)}
				>
					<RadioGroup
						classNames={{ label: classes.radio }}
						orientation="vertical"
						spacing={12}
						size="lg"
						color="dark"
						value={
							reqCurrentlyEditing.andor === MembershipReqAndor.And
								? 'and'
								: 'or'
						}
						onChange={value => {
							switch (value) {
								case 'and':
									reqCurrentlyEditing.andor = MembershipReqAndor.And
									updateMembershipRequirement(reqCurrentlyEditing)
									break
								case 'or':
									reqCurrentlyEditing.andor = MembershipReqAndor.Or
									updateMembershipRequirement(reqCurrentlyEditing)
									break
							}
						}}
						required
					>
						<Radio value="and" label="In addition" />
						<Radio value="or" label="Alternatively" />
					</RadioGroup>
					<Space h={'md'} />
					<Button
						onClick={() => {
							setSecondReqTypeModalOpened(false)
						}}
						className={classes.buttonModalSave}
					>
						Done
					</Button>
				</Modal>
				<Modal
					withCloseButton={false}
					centered
					overlayBlur={8}
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					padding={'sm'}
					opened={isMembershipCostModalOpened}
					onClose={() => setMembershipCostModalOpened(false)}
				>
					<Text className={classes.modalHeaderText}>Enter cost to join</Text>
					<TextInput
						radius="lg"
						size="md"
						type="number"
						rightSectionWidth={80}
						rightSection={<Text>MATIC</Text>}
						value={costToJoin}
						onChange={event => {
							setCostToJoin(parseInt(event.target.value))
						}}
					/>
					<Space h={'md'} />
					<Text className={classes.modalHeaderText}>
						Send Funds to this Address
					</Text>
					<TextInput
						radius="lg"
						size="md"
						value={membershipFundsAddress}
						onChange={event => {
							setMembershipFundsAddress(event.target.value)
						}}
					/>
					<Space h={'md'} />
					<Button
						onClick={() => {
							if (isNaN(costToJoin)) {
								setCostToJoin(0)
							}
							if (costToJoin > 0) {
								if (membershipFundsAddress.length < 2) {
									showNotification({
										title: 'Oops!',
										message:
											'Please enter a wallet address where membership fees will go.'
									})
									return
								}
							}
							setMembershipCostModalOpened(false)
						}}
						className={classes.buttonModalSave}
					>
						Done
					</Button>
				</Modal>
				<Modal
					withCloseButton={false}
					centered
					overlayBlur={8}
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					padding={'sm'}
					opened={isMembershipQuantityModalOpened}
					onClose={() => setMembershipQuantityModalOpened(false)}
				>
					<RadioGroup
						classNames={{ label: classes.radio }}
						orientation="vertical"
						spacing={12}
						size="lg"
						color="dark"
						value={
							isNaN(membershipQuantity) || membershipQuantity === 0
								? 'unlimited'
								: 'finite'
						}
						onChange={value => {
							switch (value) {
								case 'unlimited':
									setMembershipQuantity(0)
									break
								case 'finite':
									setMembershipQuantity(100)
									break
							}
						}}
						required
					>
						<Radio value="unlimited" label="unlimited" />
						<Radio value="finite" label="finite" />
					</RadioGroup>
					{(membershipQuantity > 0 || isNaN(membershipQuantity)) && (
						<>
							<Text className={classes.modalHeaderText}>
								Enter total memberships
							</Text>

							<TextInput
								radius="lg"
								size="md"
								value={isNaN(membershipQuantity) ? '' : membershipQuantity}
								onChange={event => {
									setMembershipQuantity(parseInt(event.target.value))
								}}
							/>
						</>
					)}
					<Space h={'md'} />
					<Button
						onClick={() => {
							setMembershipQuantityModalOpened(false)
						}}
						className={classes.buttonModalSave}
					>
						Done
					</Button>
				</Modal>
				<Modal
					withCloseButton={false}
					centered
					overlayBlur={8}
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					padding={'sm'}
					opened={isMembershipTimingStartModalOpened}
					onClose={() => setMembershipTimingStartModalOpened(false)}
				>
					<RadioGroup
						classNames={{ label: classes.radio }}
						orientation="vertical"
						spacing={12}
						size="lg"
						color="dark"
						value={membershipStartDate === undefined ? 'now' : 'later'}
						onChange={value => {
							switch (value) {
								case 'now':
									setMembershipStartDate(undefined)
									break
								case 'later':
									setMembershipStartDate(new Date())
									break
							}
						}}
						required
					>
						<Radio value="now" label="now" />
						<Radio value="later" label="at at later date" />
					</RadioGroup>
					<Space h={'sm'} />

					{membershipStartDate !== undefined && (
						<>
							<Center>
								<div>
									<Calendar
										value={membershipStartDate}
										onChange={date => {
											if (date != null) {
												const hr = membershipStartDate.getHours()
												const min = membershipStartDate.getMinutes()
												date.setHours(hr)
												date.setMinutes(min)
												setMembershipStartDate(date)
											}
										}}
									/>
									<Space h={16} />
									<TimeInput
										format="24"
										size="md"
										icon={<Clock size={16} />}
										radius={'lg'}
										value={membershipStartDate}
										onChange={time => {
											const day = membershipStartDate.getDate()
											time.setDate(day)
											setMembershipStartDate(time)
										}}
									/>
								</div>
							</Center>
						</>
					)}
					<Space h={'md'} />
					<Button
						onClick={() => {
							const now = new Date()
							if (
								membershipStartDate !== undefined &&
								membershipStartDate.getTime() < now.getTime()
							) {
								showNotification({
									title: 'Oops!',
									message: 'Please choose a start date or time later than now.'
								})
								return
							}
							setMembershipTimingStartModalOpened(false)
						}}
						className={classes.buttonModalSave}
					>
						Done
					</Button>
				</Modal>
				<Modal
					withCloseButton={false}
					centered
					overlayBlur={8}
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					padding={'sm'}
					opened={isMembershipTimingEndModalOpened}
					onClose={() => setMembershipTimingEndModalOpened(false)}
				>
					<RadioGroup
						classNames={{ label: classes.radio }}
						orientation="vertical"
						spacing={12}
						size="lg"
						color="dark"
						value={membershipEndDate === undefined ? 'forever' : 'end'}
						onChange={value => {
							switch (value) {
								case 'forever':
									setMembershipEndDate(undefined)
									break
								case 'end':
									setMembershipEndDate(new Date())
									break
							}
						}}
						required
					>
						<Radio value="forever" label="forever" />
						<Radio value="end" label="on a date" />
					</RadioGroup>
					<Space h={'sm'} />

					{membershipEndDate !== undefined && (
						<>
							<Center>
								<div>
									<Calendar
										value={membershipEndDate}
										onChange={date => {
											if (date != null) {
												const hr = membershipEndDate.getHours()
												const min = membershipEndDate.getMinutes()
												date.setHours(hr)
												date.setMinutes(min)
												setMembershipEndDate(date)
											}
										}}
									/>
									<Space h={16} />
									<TimeInput
										format="24"
										size="md"
										icon={<Clock size={16} />}
										radius={'lg'}
										value={membershipEndDate}
										onChange={time => {
											const day = membershipEndDate.getDate()
											time.setDate(day)
											setMembershipEndDate(time)
										}}
									/>
								</div>
							</Center>
						</>
					)}
					<Space h={'md'} />
					<Button
						onClick={() => {
							const now = new Date()

							if (
								membershipEndDate !== undefined &&
								membershipEndDate.getTime() < now.getTime()
							) {
								showNotification({
									title: 'Oops!',
									message: 'Please choose an end date or time later than now.'
								})
								return
							}
							setMembershipTimingEndModalOpened(false)
						}}
						className={classes.buttonModalSave}
					>
						Done
					</Button>
				</Modal>
				<CreateClubTransactionsModal
					membershipSettings={membershipSettings}
					isOpened={isTransactionsModalOpened}
					onModalClosed={() => {
						setHasLoadedClubData(false)
						setTransactionsModalOpened(false)
					}}
				/>
			</div>
		</>
	)
}
