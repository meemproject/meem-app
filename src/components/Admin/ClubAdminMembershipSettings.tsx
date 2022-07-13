/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
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
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { CircleMinus, Plus, Lock, Clock } from 'tabler-icons-react'
import {
	MembershipSettings,
	MembershipReqAndor,
	MembershipReqType,
	MembershipRequirement,
	Club
} from '../../model/club/club'
import { tokenFromContractAddress } from '../../model/token/token'
import { quickTruncate, ensWalletAddress } from '../../utils/truncated_wallet'
import { CreateClubTransactionsModal } from '../Create/CreateClubTransactionsModal'
import ClubClubContext from '../Detail/ClubClubProvider'
import { ClubAdminChangesModal } from './ClubAdminChangesModal'

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
		marginBottom: -4
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
	modalHeaderText: {
		fontSize: 18,
		fontWeight: 600,
		color: 'rgba(0, 0, 0, 0.6)',
		marginBottom: 4,
		marginTop: 16
	},
	modalInfoText: {
		fontSize: 14,
		opacity: 0.6
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

	const clubclub = useContext(ClubClubContext)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [isCheckingRequirement, setIsCheckingRequirement] = useState(false)

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
			applicationInstructions: '',
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

	const [membershipEndDate, setMembershipEndDate] = useState<
		Date | undefined
	>(undefined)

	// Club admins
	const [clubAdminsString, setClubAdminsString] = useState('')
	const [clubAdmins, setClubAdmins] = useState<string[]>([])
	const [hasAddedInitialAdmin, setHasAddedInitialAdmin] = useState(false)

	const parseClubAdmins = (rawString: string) => {
		setClubAdminsString(rawString)
		const adminsList = rawString.split('\n')
		const finalList: string[] = []
		adminsList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		log.debug(`admins count = ${finalList.length + 1}`)
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
			applicationInstructions: '',
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
		const newReqs = membershipRequirements.filter(
			item => item.index !== index
		)
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

	const [
		isMembershipTimingEndModalOpened,
		setMembershipTimingEndModalOpened
	] = useState(false)
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
	const openTransactionsModal = async () => {
		// transactions modal for club creation
		setTransactionsModalOpened(true)
	}

	const [newClubData, setNewClubData] = useState<Club>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = async () => {
		// 'save changes' modal for execution club settings updates
		setSaveChangesModalOpened(true)
	}

	const membershipTypeStringForFirstReq = (
		req: MembershipRequirement
	): string => {
		switch (req.type) {
			case MembershipReqType.None:
				return 'anyone'
			case MembershipReqType.ApprovedApplicants:
				return 'approved addresses'
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
				return `own an address on this list`
			case MembershipReqType.TokenHolders:
				return `hold ${membershipRequirements[1].tokenMinQuantity} ${membershipRequirements[1].tokenName}`
			case MembershipReqType.OtherClubMember:
				return `join ${membershipRequirements[1].clubName}`
		}
	}

	// Is the req we're currently editing the first requirement or not? This affects language and modal options
	const isEditedReqFirstReq: boolean = reqCurrentlyEditing.index === 0

	async function isAddress(address: string) {
		try {
			await wallet.web3Provider?._getAddress(address)
		} catch (e) {
			return false
		}
		return true
	}

	const saveChanges = async () => {
		if (!clubclub.isMember) {
			showNotification({
				title: 'No Club Club membership found.',
				message: `Join Club Club to continue.`
			})
			router.push({ pathname: '/' })
			return
		}

		if (clubAdmins.length === 0) {
			showNotification({
				title: 'Oops!',
				message: 'At least one club admin is required.'
			})
			return
		}

		// Validate / convert club admins
		let isAdminListValid = true
		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

		// Add current user as an admin if this is a new club
		const finalClubAdmins = Object.assign([], clubAdmins)
		if (isCreatingClub) {
			finalClubAdmins.push(wallet.accounts[0])
		}

		// Start saving changes on UI
		setIsSavingChanges(true)

		// Validate and convert club admins
		const clubAdminAddresses: string[] = []
		await Promise.all(
			finalClubAdmins.map(async function (admin) {
				const name = await provider.resolveName(admin)
				if (!name) {
					isAdminListValid = false
					return
				} else {
					// log.debug(
					// 	`validated and converted club admin address ${name}`
					// )
					clubAdminAddresses.push(name)
				}
			})
		)

		if (!isAdminListValid) {
			showNotification({
				title: 'Oops!',
				message:
					'One or more club admin addresses are invalid. Check what you entered and try again.'
			})
			setIsSavingChanges(false)
			return
		}

		// Validate and convert all approved addresses if necessary
		let isApprovedAddressesInvalid = true
		const sanitizedRequirements: MembershipRequirement[] = []
		await Promise.all(
			membershipRequirements.map(async function (req) {
				const newReq = req
				if (req.approvedAddresses.length > 0) {
					const rawAddresses: string[] = []
					await Promise.all(
						// Make sure all addresses resolve correctly.

						req.approvedAddresses.map(async function (address) {
							if (isApprovedAddressesInvalid) {
								const name = await provider.resolveName(address)
								if (!name) {
									isApprovedAddressesInvalid = true
									return
								} else {
									// log.debug(
									// 	`validated approved address ${address}`
									// )
									rawAddresses.push(name)
								}
							}
						})
					)
					newReq.approvedAddresses = rawAddresses
				}
				sanitizedRequirements.push(newReq)
			})
		)

		// Convert funds address from ENS if necessary
		let rawMembershipFundsAddress = ''
		if (membershipFundsAddress.length > 0) {
			const address = await provider.lookupAddress(membershipFundsAddress)
			rawMembershipFundsAddress = address ?? membershipFundsAddress
		}

		// If all good, build Membership Settings
		const settings: MembershipSettings = {
			requirements: sanitizedRequirements,
			costToJoin,
			membershipFundsAddress: rawMembershipFundsAddress,
			membershipQuantity,
			membershipStartDate,
			membershipEndDate,
			clubAdmins: clubAdminAddresses
		}
		setMembershipSettings(settings)

		// Show the appropriate modal (create vs edit)
		if (isCreatingClub) {
			openTransactionsModal()
		} else {
			const newClub = club!
			newClub.membershipSettings = settings
			setNewClubData(newClub)
			openSaveChangesModal()
		}
	}

	useEffect(() => {
		if (isCreatingClub) {
			if (wallet.isConnected && !hasAddedInitialAdmin) {
				setHasAddedInitialAdmin(true)
				setClubAdmins([wallet.accounts[0]])
				setClubAdminsString(`${wallet.accounts[0]}\n`)
			}
		} else {
			if (club && !hasLoadedClubData) {
				setHasLoadedClubData(true)

				// Set club admins
				setClubAdmins(club.admins!)

				// Set the club admins string, used by the club admins textfield
				let adminsString = ''
				if (club.admins) {
					club.admins.forEach(admin => {
						adminsString = adminsString + `${admin}\n`
					})
				}
				setClubAdminsString(adminsString)

				setCostToJoin(club.membershipSettings!.costToJoin)
				setMembershipQuantity(
					club.membershipSettings!.membershipQuantity
				)
				setMembershipRequirements(club.membershipSettings!.requirements)
				setMembershipSettings(club.membershipSettings)
				log.debug(club.membershipSettings!.membershipStartDate)
				if (club.membershipSettings!.membershipStartDate) {
					setMembershipStartDate(
						new Date(club.membershipSettings!.membershipStartDate)
					)
				}
				if (club.membershipSettings!.membershipEndDate) {
					setMembershipEndDate(
						new Date(club.membershipSettings!.membershipEndDate)
					)
				}

				setMembershipFundsAddress(
					club.membershipSettings!.membershipFundsAddress
				)
			}
		}
	}, [
		club,
		clubAdmins.length,
		hasAddedInitialAdmin,
		hasLoadedClubData,
		isCreatingClub,
		wallet.accounts,
		wallet.isConnected
	])

	return (
		<>
			<div>
				<Space h="lg" />

				<Text className={classes.manageClubHeader}>Club Admins</Text>

				<div>
					<Text className={classes.clubAdminsPrompt}>
						Who can manage this club’s profile and membership
						settings?
					</Text>
					<Text className={classes.clubAdminsInstructions}>
						Add a line break between each address. Note that at
						least one club admin is required at all times.
					</Text>
					<Textarea
						radius="lg"
						size="sm"
						value={clubAdminsString}
						minRows={10}
						onChange={event =>
							parseClubAdmins(event.currentTarget.value)
						}
					/>
				</div>
				<Space h={64} />

				<Divider />
				<Space h={64} />

				<Text className={classes.manageClubHeader}>Membership</Text>
				<Text className={classes.membershipSettingHeader}>
					Requirements
				</Text>
				<Text className={classes.membershipText}>
					This club is open for{' '}
					<a
						onClick={() => {
							openMembershipReqModal(0)
						}}
					>
						<span className={classes.membershipSelector}>
							{membershipTypeStringForFirstReq(
								membershipRequirements[0]
							)}
						</span>
					</a>{' '}
					to join.{' '}
					{membershipRequirements[0].type ===
						MembershipReqType.ApprovedApplicants &&
						membershipRequirements[0].applicationInstructions && (
							<>
								<>Here are the application instructions: </>
								<Space h={1} />
								<a
									onClick={() => {
										openMembershipReqModal(0)
									}}
								>
									<span
										className={classes.membershipSelector}
									>
										{
											membershipRequirements[0]
												.applicationInstructions
										}
									</span>
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
						{/* <a onClick={openSecondReqTypeModal}>
							<span className={classes.membershipSelector}>
								{membershipRequirements[1].andor === MembershipReqAndor.And
									? 'In addition'
									: 'Alternatively'}
							</span>
						</a> */}
						in addition, members{' '}
						{membershipRequirements[1].andor ===
						MembershipReqAndor.Or
							? 'can'
							: 'must'}{' '}
						<a
							onClick={() => {
								openMembershipReqModal(1)
							}}
						>
							<span className={classes.membershipSelector}>
								{membershipTypeStringForSecondReq(
									membershipRequirements[1]
								)}
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
					Our club{' '}
					{isNaN(costToJoin) || costToJoin === 0 ? 'is' : 'costs'}{' '}
					<a onClick={openMembershipCostModal}>
						<span className={classes.membershipSelector}>
							{isNaN(costToJoin) || costToJoin === 0
								? 'free'
								: costToJoin}
							{isNaN(costToJoin) || costToJoin === 0
								? ''
								: ' MATIC'}
						</span>
					</a>{' '}
					to join.{' '}
					{membershipFundsAddress.length > 0 && costToJoin > 0 && (
						<>
							Funds will be sent to{' '}
							<a onClick={openMembershipCostModal}>
								<span className={classes.membershipSelector}>
									{quickTruncate(membershipFundsAddress)}
								</span>
							</a>
							.
						</>
					)}
				</Text>
				<Space h="lg" />

				<Text className={classes.membershipSettingHeader}>
					Capacity
				</Text>
				<Text className={classes.membershipText}>
					There are{' '}
					<a onClick={openMembershipQuantityModal}>
						<span className={classes.membershipSelector}>
							{membershipQuantity === 0 ||
							isNaN(membershipQuantity)
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

				<Button
					disabled={isSavingChanges}
					loading={isSavingChanges}
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
						spacing={10}
						size="md"
						color="dark"
						value={
							reqCurrentlyEditing.type === MembershipReqType.None
								? 'anyone'
								: reqCurrentlyEditing.type ===
								  MembershipReqType.ApprovedApplicants
								? 'approved-applicants'
								: reqCurrentlyEditing.type ===
								  MembershipReqType.TokenHolders
								? 'token-holders'
								: 'other-club-member'
						}
						onChange={value => {
							switch (value) {
								case 'anyone':
									reqCurrentlyEditing.type =
										MembershipReqType.None
									updateMembershipRequirement(
										reqCurrentlyEditing
									)
									break
								case 'approved-applicants':
									reqCurrentlyEditing.type =
										MembershipReqType.ApprovedApplicants
									updateMembershipRequirement(
										reqCurrentlyEditing
									)
									break
								case 'token-holders':
									reqCurrentlyEditing.type =
										MembershipReqType.TokenHolders
									updateMembershipRequirement(
										reqCurrentlyEditing
									)
									break
								case 'other-club-member':
									reqCurrentlyEditing.type =
										MembershipReqType.OtherClubMember
									updateMembershipRequirement(
										reqCurrentlyEditing
									)
									break
							}
						}}
						required
					>
						{isEditedReqFirstReq && (
							<Radio value="anyone" label="anyone" />
						)}
						<Radio
							value="approved-applicants"
							label={
								isEditedReqFirstReq
									? 'approved addresses'
									: 'own an address on this list'
							}
						/>
						<Radio
							value="token-holders"
							label={
								isEditedReqFirstReq
									? 'token holders'
									: 'hold a token'
							}
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
							reqCurrentlyEditing.type ==
							MembershipReqType.ApprovedApplicants
								? classes.visible
								: classes.invisible
						}
					>
						<Space h={8} />
						<Text className={classes.modalHeaderText}>
							How to apply
						</Text>
						<Text className={classes.modalInfoText}>
							Leave blank if you do not have an application
							process.
						</Text>
						<Space h={'xs'} />

						<Textarea
							radius="lg"
							size="sm"
							minRows={3}
							value={reqCurrentlyEditing.applicationInstructions}
							onChange={event => {
								reqCurrentlyEditing.applicationInstructions =
									event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
						<Text className={classes.modalHeaderText}>
							Approved Addresses
						</Text>
						<Text className={classes.modalInfoText}>
							Enter one wallet address or ENS name per line.
							Admins should not be included here, and should be
							added separately in the Club Admins panel. New
							approved addresses can be added manually anytime.
						</Text>
						<Space h={'xs'} />

						<Textarea
							radius="lg"
							size="sm"
							value={reqCurrentlyEditing.approvedAddressesString}
							minRows={5}
							onChange={event => {
								reqCurrentlyEditing.approvedAddressesString =
									event.currentTarget.value
								reqCurrentlyEditing.approvedAddresses =
									parseApprovedAddresses(
										event.currentTarget.value
									)
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
					</div>

					<div
						className={
							reqCurrentlyEditing.type ==
							MembershipReqType.TokenHolders
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
						<Text className={classes.modalHeaderText}>
							Token Address
						</Text>
						<TextInput
							radius="lg"
							size="sm"
							value={reqCurrentlyEditing.tokenContractAddress}
							onChange={event => {
								reqCurrentlyEditing.tokenContractAddress =
									event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
						<Text className={classes.modalHeaderText}>
							Minimum Quantity
						</Text>
						<TextInput
							radius="lg"
							size="sm"
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
							reqCurrentlyEditing.type ==
							MembershipReqType.OtherClubMember
								? classes.visible
								: classes.invisible
						}
					>
						<Text className={classes.modalHeaderText}>
							Club Name
						</Text>

						<TextInput
							radius="lg"
							size="sm"
							value={reqCurrentlyEditing.clubName}
							onChange={event => {
								// TODO: Look up club and retrive club contract address!
								reqCurrentlyEditing.clubName =
									event.target.value
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
						/>
					</div>
					<Space h={'md'} />
					<Button
						disabled={isCheckingRequirement}
						loading={isCheckingRequirement}
						onClick={async () => {
							if (
								reqCurrentlyEditing.type ===
								MembershipReqType.TokenHolders
							) {
								// Validate token
								setIsCheckingRequirement(true)

								if (
									reqCurrentlyEditing.tokenMinQuantity === 0
								) {
									showNotification({
										title: 'Oops!',
										message:
											'Please enter a quantity greater than 0.'
									})
									setIsCheckingRequirement(false)

									return
								}

								setIsCheckingRequirement(false)

								const token = await tokenFromContractAddress(
									reqCurrentlyEditing.tokenContractAddress,
									wallet
								)

								if (!token) {
									showNotification({
										title: 'Oops!',
										message:
											'That token is not valid. Check the contract address and try again.'
									})
									setIsCheckingRequirement(false)
									return
								} else {
									setIsCheckingRequirement(false)
									reqCurrentlyEditing.tokenName = token.name
									updateMembershipRequirement(
										reqCurrentlyEditing
									)
								}
							}

							switch (reqCurrentlyEditing.type) {
								case MembershipReqType.ApprovedApplicants:
									let doesApplicantsListContainAdmin = false

									// Make sure there's no admin addresses in here
									clubAdmins.forEach(admin => {
										if (
											reqCurrentlyEditing.approvedAddressesString
												.toLowerCase()
												.includes(admin.toLowerCase())
										) {
											doesApplicantsListContainAdmin =
												true
										}
									})

									if (doesApplicantsListContainAdmin) {
										showNotification({
											title: 'Oops!',
											message:
												'You cannot add a club admin as an approved address.'
										})
										return
									}
									break
								case MembershipReqType.TokenHolders:
									if (
										reqCurrentlyEditing.tokenMinQuantity ===
										0
									) {
										showNotification({
											title: 'Oops!',
											message:
												'Please enter a minimum token quantity.'
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
								membershipRequirements[1].type =
									MembershipReqType.None
								setMembershipRequirements(
									membershipRequirements
								)
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
						spacing={10}
						size="md"
						color="dark"
						value={
							reqCurrentlyEditing.andor === MembershipReqAndor.And
								? 'and'
								: 'or'
						}
						onChange={value => {
							switch (value) {
								case 'and':
									reqCurrentlyEditing.andor =
										MembershipReqAndor.And
									updateMembershipRequirement(
										reqCurrentlyEditing
									)
									break
								case 'or':
									reqCurrentlyEditing.andor =
										MembershipReqAndor.Or
									updateMembershipRequirement(
										reqCurrentlyEditing
									)
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
					<Text className={classes.modalHeaderText}>
						Enter cost to join
					</Text>
					<TextInput
						radius="lg"
						size="sm"
						type="text"
						rightSectionWidth={80}
						rightSection={<Text>MATIC</Text>}
						defaultValue={costToJoin}
						onChange={event => {
							if (event.target.value.length === 0) {
								setCostToJoin(0)
							} else {
								const potentialNumber = parseFloat(
									event.target.value
								)
								if (isNaN(potentialNumber)) {
									showNotification({
										title: 'Oops!',
										message:
											'Please enter a number, not text.'
									})
									setCostToJoin(0)
									return
								}
								setCostToJoin(parseFloat(event.target.value))
							}
						}}
					/>
					<Space h={'md'} />
					<Text className={classes.modalHeaderText}>
						Send funds to this address
					</Text>
					<TextInput
						radius="lg"
						size="sm"
						value={membershipFundsAddress}
						onChange={event => {
							setMembershipFundsAddress(event.target.value)
						}}
					/>
					<Space h={'md'} />
					<Button
						loading={isCheckingRequirement}
						disabled={isCheckingRequirement}
						onClick={async () => {
							if (isNaN(costToJoin)) {
								setCostToJoin(0)
							}
							if (costToJoin > 0) {
								setIsCheckingRequirement(true)
								const provider =
									new ethers.providers.AlchemyProvider(
										'mainnet',
										process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
									)
								const isValid = await provider.resolveName(
									membershipFundsAddress
								)

								setIsCheckingRequirement(false)
								if (!isValid) {
									showNotification({
										title: 'Oops!',
										message:
											'Please enter a valid wallet address.'
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
						spacing={10}
						size="md"
						color="dark"
						value={
							isNaN(membershipQuantity) ||
							membershipQuantity === 0
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
								size="sm"
								value={
									isNaN(membershipQuantity)
										? ''
										: membershipQuantity
								}
								onChange={event => {
									setMembershipQuantity(
										parseInt(event.target.value)
									)
								}}
							/>
						</>
					)}
					<Space h={'md'} />
					<Button
						onClick={() => {
							if (membershipQuantity > 10000000) {
								showNotification({
									title: 'Oops!',
									message:
										'Total memberships is too large. Choose unlimited instead.'
								})
								return
							}
							if (membershipQuantity < 0) {
								showNotification({
									title: 'Oops!',
									message:
										'How can you have negative total memberships?!'
								})
								return
							}
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
						spacing={10}
						size="md"
						color="dark"
						value={
							membershipStartDate === undefined ? 'now' : 'later'
						}
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
						<Radio value="later" label="from a different date" />
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
												const hr =
													membershipStartDate.getHours()
												const min =
													membershipStartDate.getMinutes()
												date.setHours(hr)
												date.setMinutes(min)
												setMembershipStartDate(date)
											}
										}}
									/>
									<Space h={16} />
									<TimeInput
										format="24"
										size="sm"
										icon={<Clock size={16} />}
										radius={'lg'}
										value={membershipStartDate}
										onChange={time => {
											const day =
												membershipStartDate.getDate()
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
								membershipEndDate !== undefined &&
								membershipStartDate.getTime() >
									membershipEndDate.getTime()
							) {
								showNotification({
									title: 'Oops!',
									message:
										'Please choose a start date or time earlier than the end date.'
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
						spacing={10}
						size="md"
						color="dark"
						value={
							membershipEndDate === undefined ? 'forever' : 'end'
						}
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
												const hr =
													membershipEndDate.getHours()
												const min =
													membershipEndDate.getMinutes()
												date.setHours(hr)
												date.setMinutes(min)
												setMembershipEndDate(date)
											}
										}}
									/>
									<Space h={16} />
									<TimeInput
										format="24"
										size="sm"
										icon={<Clock size={16} />}
										radius={'lg'}
										value={membershipEndDate}
										onChange={time => {
											const day =
												membershipEndDate.getDate()
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
								membershipStartDate !== undefined &&
								membershipEndDate !== undefined &&
								membershipStartDate.getTime() >
									membershipEndDate.getTime()
							) {
								showNotification({
									title: 'Oops!',
									message:
										'Please choose an end date or time later than the start date.'
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
						setIsSavingChanges(false)
						setTransactionsModalOpened(false)
					}}
				/>
				<ClubAdminChangesModal
					club={newClubData}
					isOpened={isSaveChangesModalOpened}
					onModalClosed={() => {
						setIsSavingChanges(false)
						setSaveChangesModalOpened(false)
					}}
				/>
			</div>
		</>
	)
}
