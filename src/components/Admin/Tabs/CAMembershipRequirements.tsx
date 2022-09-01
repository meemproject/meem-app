/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Button,
	Space,
	Modal,
	Radio,
	TextInput,
	Textarea
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { CircleMinus, Plus } from 'tabler-icons-react'
import {
	MembershipSettings,
	MembershipReqAndor,
	MembershipReqType,
	MembershipRequirement,
	Club
} from '../../../model/club/club'
import { tokenFromContractAddress } from '../../../model/token/token'
import ClubClubContext from '../../Detail/ClubClubProvider'
import { ClubAdminChangesModal } from '../ClubAdminChangesModal'

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
		marginBottom: 24
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
		marginBottom: 6,
		'&:hover': {
			backgroundColor: 'rgba(255, 102, 81, 0.05)'
		}
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
	club?: Club
}

export const CAMembershipRequirements: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()

	const router = useRouter()

	const wallet = useWallet()

	const clubclub = useContext(ClubClubContext)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [isCheckingRequirement, setIsCheckingRequirement] = useState(false)

	const [hasLoadedClubData, setHasLoadedClubData] = useState(false)

	// Membership
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
			andor: MembershipReqAndor.Or,
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

	const saveChanges = async () => {
		if (!clubclub.isMember) {
			showNotification({
				radius: 'lg',
				title: 'No Club Club membership found.',
				message: `Join Club Club to continue.`
			})
			router.push({ pathname: '/' })
			return
		}

		// Validate / convert club admins
		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

		// Start saving changes on UI
		setIsSavingChanges(true)

		// Validate and convert all approved addresses if necessary
		let isApprovedAddressesInvalid = false
		const sanitizedRequirements: MembershipRequirement[] = []
		await Promise.all(
			membershipRequirements.map(async function (req) {
				const newReq = { ...req }
				if (req.approvedAddresses.length > 0) {
					const rawAddresses: string[] = []
					await Promise.all(
						// Make sure all addresses resolve correctly.

						req.approvedAddresses.map(async function (address) {
							if (!isApprovedAddressesInvalid) {
								const name = await provider.resolveName(address)
								if (!name) {
									isApprovedAddressesInvalid = true
									log.debug(
										'an approved address was invalid. Returning...'
									)
									return
								} else {
									log.debug(
										`validated approved address ${address}`
									)
									rawAddresses.push(name)
								}
							}
						})
					)
					newReq.approvedAddresses = rawAddresses
				} else {
					log.debug(`no approved addresses found`)
				}
				sanitizedRequirements.push(newReq)
			})
		)

		if (isApprovedAddressesInvalid) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'One or more approved wallet addresses are invalid. Check what you entered and try again.'
			})
			setIsSavingChanges(false)
			return
		}

		if (club?.membershipSettings) {
			// If all good, build Membership Settings
			const settings: MembershipSettings = {
				requirements: sanitizedRequirements,
				costToJoin: club.membershipSettings.costToJoin,
				membershipFundsAddress:
					club.membershipSettings.membershipFundsAddress,
				membershipQuantity: club.membershipSettings.membershipQuantity,
				membershipStartDate:
					club.membershipSettings.membershipStartDate,
				membershipEndDate: club.membershipSettings.membershipEndDate
			}

			// Now compare to see if there's anything to change - if saving changes

			// Compare membership settings
			const oldMembershipSettings = JSON.stringify(
				club?.membershipSettings
			)
			const newMembershipSettings = JSON.stringify(settings)
			const isMembershipSettingsSame =
				oldMembershipSettings === newMembershipSettings

			if (isMembershipSettingsSame) {
				log.debug('no changes, nothing to save. Tell user.')
				setIsSavingChanges(false)
				showNotification({
					radius: 'lg',
					title: 'Oops!',
					message: 'There are no changes to save.'
				})
				return
			}

			// Show the appropriate modal (create vs edit)
			const newClub = club
			if (newClub) {
				newClub.membershipSettings = settings
				setNewClubData(newClub)
				openSaveChangesModal()
			}
		}
	}

	useEffect(() => {
		if (club && !hasLoadedClubData) {
			setHasLoadedClubData(true)

			// Create a deep copy of original settings which we can use later to compare
			const originalSettings: MembershipSettings = JSON.parse(
				JSON.stringify(club.membershipSettings)
			)

			setMembershipRequirements(originalSettings.requirements)
		}
	}, [club, hasLoadedClubData, wallet.accounts, wallet.isConnected])

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={classes.manageClubHeader}>
					Membership Requirements
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

				<Space h="xs" />

				<Button
					disabled={isSavingChanges}
					loading={isSavingChanges}
					className={classes.buttonSaveChanges}
					onClick={saveChanges}
				>
					{'Save Changes'}
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
					<Radio.Group
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
						onChange={(value: any) => {
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
					</Radio.Group>
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

								if (reqCurrentlyEditing.tokenMinQuantity <= 0) {
									showNotification({
										radius: 'lg',
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
										radius: 'lg',
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
							let doesApplicantsListContainAdmin = false

							switch (reqCurrentlyEditing.type) {
								case MembershipReqType.ApprovedApplicants:
									// Make sure there's no admin addresses in here
									if (club && club.admins) {
										club?.admins.forEach(admin => {
											if (
												reqCurrentlyEditing.approvedAddressesString
													.toLowerCase()
													.includes(
														admin.toLowerCase()
													)
											) {
												doesApplicantsListContainAdmin =
													true
											}
										})
									}
									if (doesApplicantsListContainAdmin) {
										showNotification({
											radius: 'lg',
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
											radius: 'lg',
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
