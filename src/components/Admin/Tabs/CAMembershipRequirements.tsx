/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
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
import { CircleMinus } from 'tabler-icons-react'
import {
	MembershipSettings,
	MembershipReqAndor,
	MembershipReqType,
	MembershipRequirement,
	Club
} from '../../../model/club/club'
import { tokenFromContractAddress } from '../../../model/token/token'
import ClubClubContext from '../../ClubHome/ClubClubProvider'
import { colorPink, colorWhite, useClubsTheme } from '../../Styles/ClubsTheme'
import { ClubAdminChangesModal } from '../ClubAdminChangesModal'

interface IProps {
	club?: Club
}

export const CAMembershipRequirements: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const router = useRouter()

	const wallet = useWallet()

	const clubclub = useContext(ClubClubContext)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [isCheckingRequirement, setIsCheckingRequirement] = useState(false)

	const [hasLoadedClubData, setHasLoadedClubData] = useState(false)

	const [isClubOpenForAnyone, setIsClubOpenForAnyone] = useState(true)

	// Membership
	const [membershipRequirements, setMembershipRequirements] = useState<
		MembershipRequirement[]
	>([])
	const [currentRequirement, updateReqCurrentlyEditing] =
		useState<MembershipRequirement>()

	const updateMembershipRequirement = (updatedReq: MembershipRequirement) => {
		const newReqs = [...membershipRequirements]
		newReqs.forEach(currentReq => {
			if (currentReq.index == updatedReq.index) {
				newReqs[currentReq.index] = updatedReq
			}
		})
		setMembershipRequirements(newReqs)
	}

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

	const addMembershipRequirement = () => {
		const newReqs = [...membershipRequirements]

		const hasApprovedAddresses = isApprovedAddressesAlreadyARequirement()

		newReqs.push({
			index: membershipRequirements.length,
			andor: MembershipReqAndor.Or,
			type: hasApprovedAddresses
				? MembershipReqType.TokenHolders
				: MembershipReqType.ApprovedApplicants,
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
	const openMembershipReqModal = (current: MembershipRequirement) => {
		updateReqCurrentlyEditing(current)
		setMembershipReqModalOpened(true)
	}

	const [newClubData, setNewClubData] = useState<Club>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = async () => {
		// 'save changes' modal for execution club settings updates
		setSaveChangesModalOpened(true)
	}

	const membershipTypeString = (req: MembershipRequirement): string => {
		switch (req.type) {
			case MembershipReqType.None:
				return 'anyone'
			case MembershipReqType.ApprovedApplicants:
				return 'approved addresses'
			case MembershipReqType.TokenHolders:
				return 'token holders'
			case MembershipReqType.OtherClubMember:
				return 'other club members' // Note: currently not an option for v1
		}
	}

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

		// Start saving changes on UI
		setIsSavingChanges(true)

		// Validate / convert club admins
		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

		// Validate and convert all approved addresses if necessary
		let isApprovedAddressesInvalid = false
		let isTokenRequirementInvalid = false

		const sanitizedRequirements: MembershipRequirement[] = []

		if (isClubOpenForAnyone || membershipRequirements.length === 0) {
			// Default requirement for 'anyone can join'
			log.debug(
				'club is open to anyone, or no reqs found. Adding base requirement...'
			)
			sanitizedRequirements.push({
				index: 0,
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
		} else {
			await Promise.all(
				membershipRequirements.map(async function (req) {
					const newReq = { ...req }

					// Check approved addresses
					if (req.approvedAddresses.length > 0) {
						const rawAddresses: string[] = []
						await Promise.all(
							// Make sure all addresses resolve correctly.

							req.approvedAddresses.map(async function (address) {
								if (!isApprovedAddressesInvalid) {
									const name = await provider.resolveName(
										address
									)
									if (!name) {
										isApprovedAddressesInvalid = true

										return
									} else {
										rawAddresses.push(name)
									}
								}
							})
						)
						newReq.approvedAddresses = rawAddresses
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
		}

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
					'It looks like you provided an invalid token address or quantity. Check what you entered and try again.'
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
			const oldClub = JSON.stringify(club)
			const newClub = JSON.parse(oldClub)
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

			setIsClubOpenForAnyone(
				originalSettings.requirements.length === 1 &&
					originalSettings.requirements[0].type ===
						MembershipReqType.None
			)
		}
	}, [club, hasLoadedClubData, wallet.accounts, wallet.isConnected])

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={clubsTheme.tLargeBold}>
					Membership Requirements
				</Text>

				<Space h={24} />

				<Radio.Group
					classNames={{ label: clubsTheme.fRadio }}
					orientation="vertical"
					spacing={16}
					size="md"
					color="dark"
					value={
						isClubOpenForAnyone
							? 'open-for-anyone'
							: 'has-requirements'
					}
					onChange={(value: any) => {
						setIsClubOpenForAnyone(value === 'open-for-anyone')
					}}
					required
				>
					<Radio
						value="open-for-anyone"
						label={'This club is open for anyone to join.'}
					/>
					<Radio
						value="has-requirements"
						label={'There are requirements to join this club.'}
					/>
				</Radio.Group>

				{!isClubOpenForAnyone && (
					<>
						<Space h={24} />

						{membershipRequirements.map(requirement => (
							<div key={requirement.index}>
								<div
									className={clubsTheme.centeredRow}
									style={{
										width: 200,
										height: 150,
										justifyContent: 'center',
										border: '1px solid rgba(0, 0, 0, 1)',
										borderRadius: 16,
										position: 'relative'
									}}
								>
									<a
										onClick={() => {
											openMembershipReqModal(requirement)
										}}
									>
										<span
											className={
												clubsTheme.fOrangeSelectableSpan
											}
										>
											{membershipTypeString(requirement)}
										</span>
									</a>
									<CircleMinus
										onClick={() => {
											removeMembershipRequirement(
												requirement.index
											)
										}}
										style={{
											position: 'absolute',
											top: 8,
											left: 8,
											width: 18,
											height: 18,
											cursor: 'pointer',
											color: colorPink
										}}
									/>
								</div>
								<div
									className={clubsTheme.centeredRow}
									style={{
										width: 200,
										height: 80,
										justifyContent: 'center',
										marginTop: 8,
										marginBottom: 8
									}}
								>
									<div
										className={clubsTheme.centeredRow}
										style={{
											position: 'absolute',
											justifyContent: 'center',
											width: 30,
											height: 80
										}}
									>
										<div
											style={{
												width: 1,
												height: 80,
												border: '1px dashed rgba(0, 0, 0, 1)'
											}}
										/>
										<div
											style={{
												backgroundColor: colorWhite,
												padding: 4,
												position: 'absolute',
												top: 25
											}}
										>
											<Text>OR</Text>
										</div>
									</div>
								</div>
							</div>
						))}
						<div className={clubsTheme.row}>
							<Space
								w={membershipRequirements.length === 0 ? 0 : 14}
							/>
							<Button
								className={clubsTheme.buttonWhite}
								onClick={addMembershipRequirement}
							>
								{'+ Add Requirement'}
							</Button>
						</div>
					</>
				)}

				<Space h={40} />

				<Button
					disabled={isSavingChanges}
					loading={isSavingChanges}
					className={clubsTheme.buttonBlack}
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
						classNames={{ label: clubsTheme.fRadio }}
						orientation="vertical"
						spacing={10}
						size="md"
						color="dark"
						value={
							currentRequirement?.type === MembershipReqType.None
								? 'anyone'
								: currentRequirement?.type ===
								  MembershipReqType.ApprovedApplicants
								? 'approved-applicants'
								: currentRequirement?.type ===
								  MembershipReqType.TokenHolders
								? 'token-holders'
								: 'other-club-member'
						}
						onChange={(value: any) => {
							switch (value) {
								case 'anyone':
									if (currentRequirement) {
										currentRequirement.type =
											MembershipReqType.None
										updateMembershipRequirement(
											currentRequirement
										)
									}
									break
								case 'approved-applicants':
									if (currentRequirement) {
										currentRequirement.type =
											MembershipReqType.ApprovedApplicants
										updateMembershipRequirement(
											currentRequirement
										)
									}
									break
								case 'token-holders':
									if (currentRequirement) {
										currentRequirement.type =
											MembershipReqType.TokenHolders
										updateMembershipRequirement(
											currentRequirement
										)
									}
									break
								case 'other-club-member':
									if (currentRequirement) {
										currentRequirement.type =
											MembershipReqType.OtherClubMember
										updateMembershipRequirement(
											currentRequirement
										)
									}
									break
							}
						}}
						required
					>
						<Radio
							value="approved-applicants"
							disabled={isApprovedAddressesAlreadyARequirement()}
							label={'approved addresses'}
						/>

						<Radio value="token-holders" label={'token holders'} />
						{/* <Radio
								value="other-club-member"
								label="join another club"
								disabled
							/> */}
					</Radio.Group>
					<Space h={24} />
					<div
						className={
							currentRequirement?.type ==
							MembershipReqType.ApprovedApplicants
								? clubsTheme.visibleContainer
								: clubsTheme.invisibleContainer
						}
					>
						<Text className={clubsTheme.tMediumBold}>
							How to apply
						</Text>
						<Space h={4} />
						<Text className={clubsTheme.tExtraSmall}>
							Leave blank if you do not have an application
							process.
						</Text>
						<Space h={'xs'} />
						<Textarea
							radius="lg"
							size="sm"
							minRows={3}
							maxLength={280}
							autosize
							value={currentRequirement?.applicationInstructions}
							onChange={event => {
								if (currentRequirement) {
									currentRequirement.applicationInstructions =
										event.target.value
									updateMembershipRequirement(
										currentRequirement
									)
								}
							}}
						/>
						<Space h={16} />
						<Text className={clubsTheme.tMediumBold}>
							Approved Addresses
						</Text>
						<Space h={4} />

						<Text className={clubsTheme.tExtraSmall}>
							Enter one wallet address or ENS name per line.
							Admins should not be included here, and should be
							added separately in the Club Admins panel. New
							approved addresses can be added manually anytime.
						</Text>
						<Space h={'xs'} />
						<Textarea
							radius="lg"
							size="sm"
							value={currentRequirement?.approvedAddressesString}
							minRows={5}
							onChange={event => {
								if (currentRequirement) {
									currentRequirement.approvedAddressesString =
										event.currentTarget.value
									currentRequirement.approvedAddresses =
										parseApprovedAddresses(
											event.currentTarget.value
										)
									updateMembershipRequirement(
										currentRequirement
									)
								}
							}}
						/>
					</div>

					<div
						className={
							currentRequirement?.type ==
							MembershipReqType.TokenHolders
								? clubsTheme.visibleContainer
								: clubsTheme.invisibleContainer
						}
					>
						{/* <Text className={clubsTheme.tMediumBoldFaded}>Chain</Text>
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
								reqCurrentlyEditing?.tokenChain = value ?? 'eth'
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
							value={reqCurrentlyEditing?.tokenChain}
						/> */}
						<Text className={clubsTheme.tSmallBoldFaded}>
							Token Address
						</Text>
						<Space h={4} />
						<TextInput
							radius="lg"
							size="sm"
							value={currentRequirement?.tokenContractAddress}
							onChange={event => {
								if (currentRequirement) {
									currentRequirement.tokenContractAddress =
										event.target.value
									updateMembershipRequirement(
										currentRequirement
									)
								}
							}}
						/>
						<Space h={16} />

						<Text className={clubsTheme.tSmallBoldFaded}>
							Minimum Quantity
						</Text>
						<Space h={4} />

						<TextInput
							radius="lg"
							size="sm"
							type="number"
							value={currentRequirement?.tokenMinQuantity}
							onChange={event => {
								if (currentRequirement) {
									currentRequirement.tokenMinQuantity =
										parseInt(event.target.value)
									updateMembershipRequirement(
										currentRequirement
									)
								}
							}}
						/>
					</div>
					<div
						className={
							currentRequirement?.type ==
							MembershipReqType.OtherClubMember
								? clubsTheme.visibleContainer
								: clubsTheme.invisibleContainer
						}
					>
						<Text className={clubsTheme.tMediumBoldFaded}>
							Club Name
						</Text>

						<TextInput
							radius="lg"
							size="sm"
							value={currentRequirement?.otherClubName}
							onChange={event => {
								// TODO: Look up club and retrive club contract address!
								if (currentRequirement) {
									currentRequirement.otherClubName =
										event.target.value
									updateMembershipRequirement(
										currentRequirement
									)
								}
							}}
						/>
					</div>
					<Space h={32} />
					<Button
						disabled={isCheckingRequirement}
						loading={isCheckingRequirement}
						onClick={async () => {
							if (
								currentRequirement?.type ===
								MembershipReqType.TokenHolders
							) {
								// Validate token
								setIsCheckingRequirement(true)

								if (currentRequirement?.tokenMinQuantity <= 0) {
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
									currentRequirement?.tokenContractAddress,
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
									if (currentRequirement) {
										currentRequirement.tokenName =
											token.name
										updateMembershipRequirement(
											currentRequirement
										)
									}
								}
							}
							let doesApplicantsListContainAdmin = false

							switch (currentRequirement?.type) {
								case MembershipReqType.ApprovedApplicants:
									// Make sure there's no admin addresses in here
									if (club && club.adminAddresses) {
										club?.adminAddresses.forEach(admin => {
											if (
												currentRequirement?.approvedAddressesString
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
										currentRequirement?.tokenMinQuantity ===
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
						className={clubsTheme.buttonBlack}
					>
						Done
					</Button>
					<Button
						onClick={() => {
							setMembershipReqModalOpened(false)
						}}
						className={clubsTheme.buttonGrey}
					>
						Cancel
					</Button>
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
