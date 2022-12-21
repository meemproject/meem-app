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
import React, { useEffect, useState } from 'react'
import { CircleMinus, Plus, Clock } from 'tabler-icons-react'
import {
	MembershipSettings,
	MembershipReqAndor,
	MembershipReqType,
	MembershipRequirement,
	Agreement
} from '../../model/agreement/agreements'
import { tokenFromContractAddress } from '../../model/token/token'
import { quickTruncate } from '../../utils/truncated_wallet'
import { colorWhite, useMeemTheme } from '../Styles/MeemTheme'
import { CreateAgreementModal } from './CreateAgreementModal'

interface IProps {
	agreement?: Agreement
}

export const AgreementCreationMembershipSettings: React.FC<IProps> = ({
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [isCheckingRequirement, setIsCheckingRequirement] = useState(false)

	// Membership
	const [membershipSettings, setMediums] = useState<MembershipSettings>()

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
			agreementContractAddress: '',
			otherAgreementName: ''
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

	// Agreement admins
	const [agreementAdminsString, setAgreementAdminsString] = useState('')
	const [agreementAdmins, setAgreementAdmins] = useState<string[]>([])
	const [hasAddedInitialAdmin, setHasAddedInitialAdmin] = useState(false)

	const parseAgreementAdmins = (rawString: string) => {
		setAgreementAdminsString(rawString)
		const adminsList = rawString.split('\n')
		const finalList: string[] = []
		adminsList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		log.debug(`admins count = ${finalList.length + 1}`)
		setAgreementAdmins(finalList)
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
			agreementContractAddress: '',
			otherAgreementName: ''
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

	const [isAgreementCreationModalOpened, setIsAgreementCreationModalOpened] =
		useState(false)
	const openAgreementCreationModal = async () => {
		// transactions modal for agreement creation
		// Opening this triggers agreement creation
		setIsAgreementCreationModalOpened(true)
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
			case MembershipReqType.OtherAgreementMember:
				return 'join another community' // Note: currently not an option for v1
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
			case MembershipReqType.OtherAgreementMember:
				return `join ${membershipRequirements[1].otherAgreementName}`
		}
	}

	// Is the req we're currently editing the first requirement or not? This affects language and modal options
	const isEditedReqFirstReq: boolean = reqCurrentlyEditing.index === 0

	const saveChanges = async () => {
		if (agreementAdmins.length === 0) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'At least one community administrator is required.'
			})
			return
		}

		// Validate / convert agreement admins
		let isAdminListValid = true
		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

		// Add current user as admin
		const finalAgreementAdmins = Object.assign([], agreementAdmins)
		finalAgreementAdmins.push(wallet.accounts[0])

		// Start saving changes on UI
		setIsSavingChanges(true)

		// Validate and convert agreement admins
		const agreementAdminAddresses: string[] = []
		await Promise.all(
			finalAgreementAdmins.map(async function (admin) {
				const name = await provider.resolveName(admin)
				if (!name) {
					isAdminListValid = false
					return
				} else {
					agreementAdminAddresses.push(name)
				}
			})
		)

		if (!isAdminListValid) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'One or more community administrator addresses are invalid. Check what you entered and try again.'
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
			agreementAdminsAtAgreementCreation: agreementAdminAddresses
		}

		setMediums(settings)

		openAgreementCreationModal()
	}

	useEffect(() => {
		if (wallet.isConnected && !hasAddedInitialAdmin) {
			setHasAddedInitialAdmin(true)
			setAgreementAdmins([wallet.accounts[0]])
			setAgreementAdminsString(`${wallet.accounts[0]}\n`)
		}
	}, [
		agreement,
		agreementAdmins.length,
		hasAddedInitialAdmin,
		wallet.accounts,
		wallet.isConnected
	])

	return (
		<>
			<div>
				<Space h={48} />

				<Text className={meemTheme.tLargeBold}>
					Community administrators
				</Text>

				<div>
					<Space h={32} />
					<Text className={meemTheme.tMediumBold}>
						{`Who can manage this community’s profile and membership
						settings?`}
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tMediumFaded}>
						{`Add a line break between each address. Note that at
						least one community administrator is required at all times.`}
					</Text>
					<Space h={16} />
					<Textarea
						radius="lg"
						size="sm"
						value={agreementAdminsString}
						minRows={10}
						onChange={event =>
							parseAgreementAdmins(event.currentTarget.value)
						}
					/>
				</div>
				<Space h={64} />

				<Divider />
				<Space h={64} />

				<Text className={meemTheme.tLargeBold}>Membership</Text>
				<Space h={32} />

				<Text className={meemTheme.tSmallBoldFaded}>Requirements</Text>
				<Text
					className={meemTheme.tMedium}
					style={{ marginBottom: 8, lineHeight: 2 }}
				>
					This community is open for{' '}
					<a
						onClick={() => {
							openMembershipReqModal(0)
						}}
					>
						<span className={meemTheme.fBlueSelectableSpan}>
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
										className={
											meemTheme.fBlueSelectableSpan
										}
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
								<span className={meemTheme.fBlueSelectableSpan}>
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
						className={meemTheme.tMedium}
						style={{
							marginBottom: 16,
							marginTop: 16,
							lineHeight: 2
						}}
					>
						<CircleMinus
							onClick={() => {
								// Hardcoded for now as there's only one additional req in v1
								removeMembershipRequirement(1)
							}}
							style={{
								color: colorWhite,
								cursor: 'pointer',
								marginRight: 8,
								marginBottom: -4
							}}
						/>
						{/* <a onClick={openSecondReqTypeModal}>
							<span className={meemTheme.fBlueSelectableSpan}>
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
							<span className={meemTheme.fBlueSelectableSpan}>
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
							className={meemTheme.buttonWhite}
							style={{ marginBottom: 8 }}
							size={'md'}
							leftIcon={<Plus size={14} />}
						>
							Add another requirement
						</Button>
					)}

				<Space h="lg" />

				<Text className={meemTheme.tSmallBoldFaded}>Price</Text>

				<Text
					className={meemTheme.tMedium}
					style={{ marginBottom: 8, lineHeight: 2 }}
				>
					Our community{' '}
					{isNaN(costToJoin) || costToJoin === 0 ? 'is' : 'costs'}{' '}
					<a onClick={openMembershipCostModal}>
						<span className={meemTheme.fBlueSelectableSpan}>
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
								<span className={meemTheme.fBlueSelectableSpan}>
									{quickTruncate(membershipFundsAddress)}
								</span>
							</a>
							.
						</>
					)}
				</Text>
				<Space h="lg" />

				<Text className={meemTheme.tSmallBoldFaded}>Capacity</Text>
				<Text
					className={meemTheme.tMedium}
					style={{ marginBottom: 8, lineHeight: 2 }}
				>
					There are{' '}
					<a onClick={openMembershipQuantityModal}>
						<span className={meemTheme.fBlueSelectableSpan}>
							{membershipQuantity === 0 ||
							isNaN(membershipQuantity)
								? 'unlimited'
								: membershipQuantity}
						</span>
					</a>{' '}
					memberships available in total.
				</Text>
				<Space h="lg" />
				<Text className={meemTheme.tSmallBoldFaded}>Timing</Text>

				<Text
					className={meemTheme.tMedium}
					style={{ marginBottom: 8, lineHeight: 2 }}
				>
					Memberships are available starting{' '}
					<a onClick={openMembershipStartTimingModal}>
						<span className={meemTheme.fBlueSelectableSpan}>
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
						<span className={meemTheme.fBlueSelectableSpan}>
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
				<Button
					disabled={isSavingChanges}
					loading={isSavingChanges}
					className={meemTheme.buttonBlack}
					onClick={saveChanges}
				>
					{'Launch Community'}
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
						classNames={{ label: meemTheme.fRadio }}
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
								: 'other-agreement-member'
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
								case 'other-agreement-member':
									reqCurrentlyEditing.type =
										MembershipReqType.OtherAgreementMember
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
								value="other-agreement-member"
								label="join another community"
								disabled
							/>
						)}
					</Radio.Group>
					<div
						className={
							reqCurrentlyEditing.type ==
							MembershipReqType.ApprovedApplicants
								? meemTheme.visibleContainer
								: meemTheme.invisibleContainer
						}
					>
						<Space h={24} />
						<Text className={meemTheme.tMediumBold}>
							How to apply
						</Text>
						<Text className={meemTheme.tExtraSmall}>
							Leave blank if you do not have an application
							process.
						</Text>
						<Space h={12} />

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
						<Space h={24} />
						<Text className={meemTheme.tMediumBold}>
							Approved Addresses
						</Text>
						<Text className={meemTheme.tExtraSmall}>
							Enter one wallet address or ENS name per line.
							Admins should not be included here, and should be
							managed separately in the Roles tab. New approved
							addresses can be added manually anytime.
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
								? meemTheme.visibleContainer
								: meemTheme.invisibleContainer
						}
					>
						{/* <Text className={meemTheme.tMediumBoldFaded}>Chain</Text>
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
						<Space h={24} />
						<Text className={meemTheme.tMediumBold}>
							Token Address
						</Text>
						<Space h={4} />
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
						<Space h={16} />
						<Text className={meemTheme.tMediumBold}>
							Minimum Quantity
						</Text>
						<Space h={4} />
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
							MembershipReqType.OtherAgreementMember
								? meemTheme.visibleContainer
								: meemTheme.invisibleContainer
						}
					>
						<Text className={meemTheme.tMediumBoldFaded}>
							Community Name
						</Text>

						<TextInput
							radius="lg"
							size="sm"
							value={reqCurrentlyEditing.otherAgreementName}
							onChange={event => {
								// TODO: Look up agreement and retrive agreement contract address!
								reqCurrentlyEditing.otherAgreementName =
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
									agreementAdmins.forEach(admin => {
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
												'You cannot add a community administrator as an approved address.'
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
						className={meemTheme.buttonBlack}
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
							className={meemTheme.buttonGrey}
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
						classNames={{ label: meemTheme.fRadio }}
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
						className={meemTheme.buttonBlack}
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
					<Space h={16} />
					<Text className={meemTheme.tMediumBold}>
						Enter cost to join
					</Text>
					<Space h={4} />
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
					<Text className={meemTheme.tMediumBold}>
						Send funds to this address
					</Text>
					<Space h={4} />
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
						className={meemTheme.buttonBlack}
					>
						Done
					</Button>
					<Space h={16} />
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
						classNames={{ label: meemTheme.fRadio }}
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
							<Space h={24} />
							<Text className={meemTheme.tMediumBold}>
								Enter total memberships
							</Text>
							<Space h={4} />

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
						className={meemTheme.buttonBlack}
					>
						Done
					</Button>
					<Space h={16} />
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
						classNames={{ label: meemTheme.fRadio }}
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
						className={meemTheme.buttonBlack}
					>
						Done
					</Button>
					<Space h={16} />
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
						classNames={{ label: meemTheme.fRadio }}
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
						className={meemTheme.buttonBlack}
					>
						Done
					</Button>
				</Modal>
				<CreateAgreementModal
					membershipSettings={membershipSettings}
					isOpened={isAgreementCreationModalOpened}
					// isOpened={true}
					onModalClosed={() => {
						setIsSavingChanges(false)
						setIsAgreementCreationModalOpened(false)
					}}
				/>
			</div>
		</>
	)
}
