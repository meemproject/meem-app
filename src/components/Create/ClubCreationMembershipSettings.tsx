/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
	Text,
	Button,
	Space,
	Modal,
	Radio,
	TextInput,
	Textarea,
	Center,
	Divider
} from '@mantine/core'
import { Calendar, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { CircleMinus, Plus, Clock } from 'tabler-icons-react'
import {
	MembershipSettings,
	MembershipReqAndor,
	MembershipReqType,
	MembershipRequirement,
	Club
} from '../../model/club/club'
import { tokenFromContractAddress } from '../../model/token/token'
import { quickTruncate } from '../../utils/truncated_wallet'
import ClubClubContext from '../Detail/ClubClubProvider'
import { useGlobalStyles } from '../Styles/GlobalStyles'
import { CreateClubModal } from './CreateClubModal'

interface IProps {
	club?: Club
}

export const ClubCreationMembershipSettings: React.FC<IProps> = ({ club }) => {
	const { classes: styles } = useGlobalStyles()

	const router = useRouter()

	const wallet = useWallet()

	const clubclub = useContext(ClubClubContext)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [isCheckingRequirement, setIsCheckingRequirement] = useState(false)

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
			otherClubName: ''
		}
	])

	const isApprovedAddressesAlreadyARequirement = (): boolean => {
		let isAdded = false
		membershipRequirements.forEach(req => {
			if (req.type === MembershipReqType.ApprovedApplicants) {
				log.debug('approved already added')
				isAdded = true
			}
		})
		return isAdded
	}

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
			otherClubName: ''
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
	// const openSecondReqTypeModal = () => {
	// 	// e.g. in addition vs alternatively
	// 	updateReqCurrentlyEditing(membershipRequirements[1])
	// 	setSecondReqTypeModalOpened(true)
	// }

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

	const [isClubCreationModalOpened, setIsClubCreationModalOpened] =
		useState(false)
	const openClubCreationModal = async () => {
		// transactions modal for club creation
		// Opening this triggers club creation
		setIsClubCreationModalOpened(true)
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
				return `join ${membershipRequirements[1].otherClubName}`
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

		if (clubAdmins.length === 0) {
			showNotification({
				radius: 'lg',
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

		// Add current user as admin
		const finalClubAdmins = Object.assign([], clubAdmins)
		finalClubAdmins.push(wallet.accounts[0])

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
					clubAdminAddresses.push(name)
				}
			})
		)

		if (!isAdminListValid) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'One or more club admin addresses are invalid. Check what you entered and try again.'
			})
			setIsSavingChanges(false)
			return
		}

		// Validate and convert all approved addresses if necessary
		let isApprovedAddressesInvalid = false
		let isTokenRequirementInvalid = false

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

				// If the requirement is a token, ensure that a token has been added
				if (req.type === MembershipReqType.TokenHolders) {
					if (
						req.tokenContractAddress.length === 0 ||
						req.tokenMinQuantity === 0
					) {
						isTokenRequirementInvalid = true
					}
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

		if (isTokenRequirementInvalid) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'It looks like you provided an invalid token address or quantity for a requirement. Check what you entered and try again.'
			})
			setIsSavingChanges(false)
			return
		}

		// Convert funds address from ENS if necessary
		let rawMembershipFundsAddress = ''
		if (membershipFundsAddress.length > 0) {
			const address = await provider.resolveName(membershipFundsAddress)
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
			clubAdminsAtClubCreation: clubAdminAddresses
		}

		setMembershipSettings(settings)

		openClubCreationModal()
	}

	useEffect(() => {
		if (wallet.isConnected && !hasAddedInitialAdmin) {
			setHasAddedInitialAdmin(true)
			setClubAdmins([wallet.accounts[0]])
			setClubAdminsString(`${wallet.accounts[0]}\n`)
		}
	}, [
		club,
		clubAdmins.length,
		hasAddedInitialAdmin,
		wallet.accounts,
		wallet.isConnected
	])

	return (
		<>
			<div>
				<Space h="lg" />

				<Text className={styles.tSectionTitle}>Club Admins</Text>

				<div>
					<Space h={36} />
					<Text className={styles.tSubtitle}>
						{club
							? `Who can manage this club’s profile and membership
						settings?`
							: `Who can manage this club’s profile, treasury and membership
						settings?`}
					</Text>
					<Space h={16} />
					<Text className={styles.tSubtitleTransparent}>
						{club
							? `Add a line break between each address. Note that at
						least one club admin is required at all times.`
							: `Add a line break between each address. Note that at
						least one club admin is required at all times, and you can update treasury addresses via your club's settings page.`}
					</Text>
					<Space h={16} />
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

				<Text className={styles.tSectionTitle}>Membership</Text>
				<Text className={styles.tBoldTransparent}>Requirements</Text>
				<Text className={styles.tMembershipSetting}>
					This club is open for{' '}
					<a
						onClick={() => {
							openMembershipReqModal(0)
						}}
					>
						<span className={styles.fOrangeSelectableSpan}>
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
										className={styles.fOrangeSelectableSpan}
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
								<span className={styles.fOrangeSelectableSpan}>
									{membershipRequirements[0].tokenMinQuantity}{' '}
									{membershipRequirements[0].tokenName}
								</span>
							</a>
							.
						</>
					)}
				</Text>
				{membershipRequirements.length > 1 && (
					<Text
						className={
							styles.tMembershipSettingAdditionalRequirement
						}
					>
						<CircleMinus
							onClick={() => {
								// Hardcoded for now as there's only one additional req in v1
								removeMembershipRequirement(1)
							}}
							style={{
								color: 'rgba(255, 102, 81, 1)',
								cursor: 'pointer',
								marginRight: 8,
								marginBottom: -4
							}}
						/>
						{/* <a onClick={openSecondReqTypeModal}>
							<span className={styles.fOrangeSelectableSpan}>
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
							<span className={styles.fOrangeSelectableSpan}>
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
							className={styles.buttonWhite}
							style={{ marginBottom: 8 }}
							size={'md'}
							leftIcon={<Plus size={14} />}
						>
							Add another requirement
						</Button>
					)}

				<Space h="lg" />

				<Text className={styles.tBoldTransparent}>Price</Text>

				<Text className={styles.tMembershipSetting}>
					Our club{' '}
					{isNaN(costToJoin) || costToJoin === 0 ? 'is' : 'costs'}{' '}
					<a onClick={openMembershipCostModal}>
						<span className={styles.fOrangeSelectableSpan}>
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
								<span className={styles.fOrangeSelectableSpan}>
									{quickTruncate(membershipFundsAddress)}
								</span>
							</a>
							.
						</>
					)}
				</Text>
				<Space h="lg" />

				<Text className={styles.tBoldTransparent}>Capacity</Text>
				<Text className={styles.tMembershipSetting}>
					There are{' '}
					<a onClick={openMembershipQuantityModal}>
						<span className={styles.fOrangeSelectableSpan}>
							{membershipQuantity === 0 ||
							isNaN(membershipQuantity)
								? 'unlimited'
								: membershipQuantity}
						</span>
					</a>{' '}
					memberships available in total.
				</Text>
				<Space h="lg" />
				<Text className={styles.tBoldTransparent}>Timing</Text>

				<Text className={styles.tMembershipSetting}>
					Memberships are available starting{' '}
					<a onClick={openMembershipStartTimingModal}>
						<span className={styles.fOrangeSelectableSpan}>
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
						<span className={styles.fOrangeSelectableSpan}>
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
					className={styles.buttonBlack}
					onClick={saveChanges}
				>
					{'Launch Club'}
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
						classNames={{ label: styles.fRadio }}
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
							disabled={isApprovedAddressesAlreadyARequirement()}
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
								? styles.visibleContainer
								: styles.invisibleContainer
						}
					>
						<Space h={8} />
						<Text className={styles.tSubtitleTransparentBold}>
							How to apply
						</Text>
						<Text className={styles.tExtraSmallTransparent}>
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
						<Text className={styles.tSubtitleTransparentBold}>
							Approved Addresses
						</Text>
						<Text className={styles.tExtraSmallTransparent}>
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
								? styles.visibleContainer
								: styles.invisibleContainer
						}
					>
						{/* <Text className={styles.tSubtitleTransparentBold}>Chain</Text>
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
						<Text className={styles.tSubtitleTransparentBold}>
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
						<Text className={styles.tSubtitleTransparentBold}>
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
								? styles.visibleContainer
								: styles.invisibleContainer
						}
					>
						<Text className={styles.tSubtitleTransparentBold}>
							Club Name
						</Text>

						<TextInput
							radius="lg"
							size="sm"
							value={reqCurrentlyEditing.otherClubName}
							onChange={event => {
								// TODO: Look up club and retrive club contract address!
								reqCurrentlyEditing.otherClubName =
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
						className={styles.buttonBlack}
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
							className={styles.buttonGrey}
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
					<Radio.Group
						classNames={{ label: styles.fRadio }}
						orientation="vertical"
						spacing={10}
						size="md"
						color="dark"
						value={
							reqCurrentlyEditing.andor === MembershipReqAndor.And
								? 'and'
								: 'or'
						}
						onChange={(value: any) => {
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
					</Radio.Group>
					<Space h={'md'} />
					<Button
						onClick={() => {
							setSecondReqTypeModalOpened(false)
						}}
						className={styles.buttonBlack}
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
					<Text className={styles.tSubtitleTransparentBold}>
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
										radius: 'lg',
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
					<Text className={styles.tSubtitleTransparentBold}>
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
										radius: 'lg',
										title: 'Oops!',
										message:
											'Please enter a valid wallet address.'
									})
									return
								}
							}
							setMembershipCostModalOpened(false)
						}}
						className={styles.buttonBlack}
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
					<Radio.Group
						classNames={{ label: styles.fRadio }}
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
						onChange={(value: any) => {
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
					</Radio.Group>
					{(membershipQuantity > 0 || isNaN(membershipQuantity)) && (
						<>
							<Text className={styles.tSubtitleTransparentBold}>
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
									radius: 'lg',
									title: 'Oops!',
									message:
										'Total memberships is too large. Choose unlimited instead.'
								})
								return
							}
							if (membershipQuantity < 0) {
								showNotification({
									radius: 'lg',
									title: 'Oops!',
									message:
										'How can you have negative total memberships?!'
								})
								return
							}
							setMembershipQuantityModalOpened(false)
						}}
						className={styles.buttonBlack}
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
					<Radio.Group
						classNames={{ label: styles.fRadio }}
						orientation="vertical"
						spacing={10}
						size="md"
						color="dark"
						value={
							membershipStartDate === undefined ? 'now' : 'later'
						}
						onChange={(value: any) => {
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
					</Radio.Group>
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
							if (
								membershipStartDate !== undefined &&
								membershipEndDate !== undefined &&
								membershipStartDate.getTime() >
									membershipEndDate.getTime()
							) {
								showNotification({
									radius: 'lg',
									title: 'Oops!',
									message:
										'Please choose a start date or time earlier than the end date.'
								})
								return
							}
							setMembershipTimingStartModalOpened(false)
						}}
						className={styles.buttonBlack}
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
					<Radio.Group
						classNames={{ label: styles.fRadio }}
						orientation="vertical"
						spacing={10}
						size="md"
						color="dark"
						value={
							membershipEndDate === undefined ? 'forever' : 'end'
						}
						onChange={(value: any) => {
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
					</Radio.Group>
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
							if (
								membershipStartDate !== undefined &&
								membershipEndDate !== undefined &&
								membershipStartDate.getTime() >
									membershipEndDate.getTime()
							) {
								showNotification({
									radius: 'lg',
									title: 'Oops!',
									message:
										'Please choose an end date or time later than the start date.'
								})
								return
							}
							setMembershipTimingEndModalOpened(false)
						}}
						className={styles.buttonBlack}
					>
						Done
					</Button>
				</Modal>
				<CreateClubModal
					membershipSettings={membershipSettings}
					isOpened={isClubCreationModalOpened}
					onModalClosed={() => {
						setIsSavingChanges(false)
						setIsClubCreationModalOpened(false)
					}}
				/>
			</div>
		</>
	)
}
