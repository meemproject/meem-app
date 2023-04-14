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
	Divider
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import { MinusCircle } from 'iconoir-react'
import React, { useEffect, useState } from 'react'
import {
	MembershipSettings,
	MembershipReqAndor,
	MembershipReqType,
	MembershipRequirement,
	Agreement
} from '../../../model/agreement/agreements'
import { tokenFromContractAddress } from '../../../model/token/token'
import { showErrorNotification } from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { DeveloperPortalButton } from '../../Developer/DeveloperPortalButton'
import { colorBlue, colorWhite, useMeemTheme } from '../../Styles/MeemTheme'
import { AgreementAdminChangesComponent } from '../ChangesComponents/AgreementAdminChangesModal'

interface IProps {
	agreement?: Agreement
}

export const AdminMembershipRequirements: React.FC<IProps> = ({
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const [isCheckingRequirement, setIsCheckingRequirement] = useState(false)

	const [hasLoadedAgreementData, setHasLoadedAgreementData] = useState(false)

	const [isAgreementOpenForAnyone, setIsAgreementOpenForAnyone] =
		useState(true)

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

	const [newAgreementData, setNewAgreementData] = useState<Agreement>()
	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const { isTransactionInProgress } = useAgreement()

	const membershipTypeString = (req: MembershipRequirement): string => {
		switch (req.type) {
			case MembershipReqType.None:
				return 'anyone'
			case MembershipReqType.ApprovedApplicants:
				return 'approved addresses'
			case MembershipReqType.TokenHolders:
				return 'token holders'
			case MembershipReqType.OtherAgreementMember:
				return 'other agreement members' // Note: currently not an option for v1
		}
	}

	const saveChanges = async () => {
		// Validate / convert agreement admins
		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

		// Validate and convert all approved addresses if necessary
		let isApprovedAddressesInvalid = false
		let isTokenRequirementInvalid = false

		const sanitizedRequirements: MembershipRequirement[] = []

		if (isAgreementOpenForAnyone || membershipRequirements.length === 0) {
			// Default requirement for 'anyone can join'
			log.debug(
				'agreement is open to anyone, or no reqs found. Adding base requirement...'
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
				agreementContractAddress: '',
				otherAgreementName: ''
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
			showErrorNotification(
				'Oops!',
				'One or more approved wallet addresses are invalid. Check what you entered and try again.'
			)
			return
		}

		if (isTokenRequirementInvalid) {
			showErrorNotification(
				'Oops!',
				'It looks like you provided an invalid token address or quantity. Check what you entered and try again.'
			)
			return
		}

		if (agreement?.membershipSettings) {
			// If all good, build Membership Settings
			const settings: MembershipSettings = {
				requirements: sanitizedRequirements,
				costToJoin: agreement.membershipSettings.costToJoin,
				membershipFundsAddress:
					agreement.membershipSettings.membershipFundsAddress,
				membershipQuantity:
					agreement.membershipSettings.membershipQuantity,
				membershipStartDate:
					agreement.membershipSettings.membershipStartDate,
				membershipEndDate:
					agreement.membershipSettings.membershipEndDate
			}

			// Show the appropriate modal (create vs edit)
			const oldAgreement = JSON.stringify(agreement)
			const newAgreement = JSON.parse(oldAgreement)
			if (newAgreement) {
				newAgreement.membershipSettings = settings
				setNewAgreementData(newAgreement)
				setIsSavingChanges(true)
			}
		}
	}

	useEffect(() => {
		if (agreement && !hasLoadedAgreementData) {
			setHasLoadedAgreementData(true)

			// Create a deep copy of original settings which we can use later to compare
			const originalSettings: MembershipSettings = JSON.parse(
				JSON.stringify(agreement.membershipSettings)
			)

			setMembershipRequirements(originalSettings.requirements)

			setIsAgreementOpenForAnyone(
				originalSettings.requirements.length === 1 &&
					originalSettings.requirements[0].type ===
						MembershipReqType.None
			)
		}
	}, [agreement, hasLoadedAgreementData, wallet.accounts, wallet.isConnected])

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={meemTheme.tLargeBold}>
					Membership Requirements
				</Text>

				<Space h={24} />

				<Radio.Group
					classNames={{ label: meemTheme.fRadio }}
					orientation="vertical"
					spacing={10}
					size="md"
					color="dark"
					value={
						isAgreementOpenForAnyone
							? 'open-for-anyone'
							: 'has-requirements'
					}
					onChange={(value: any) => {
						setIsAgreementOpenForAnyone(value === 'open-for-anyone')
					}}
					required
				>
					<Radio
						value="open-for-anyone"
						label={'This community is open for anyone to join.'}
					/>
					<Radio
						value="has-requirements"
						label={'There are requirements to join this community.'}
					/>
				</Radio.Group>

				{!isAgreementOpenForAnyone && (
					<>
						<Space h={24} />

						{membershipRequirements.map(requirement => (
							<div key={requirement.index}>
								<div
									className={meemTheme.centeredRow}
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
												meemTheme.fBlueSelectableSpan
											}
										>
											{membershipTypeString(requirement)}
										</span>
									</a>
									<MinusCircle
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
											color: colorBlue
										}}
									/>
								</div>
								<div
									className={meemTheme.centeredRow}
									style={{
										width: 200,
										height: 80,
										justifyContent: 'center',
										marginTop: 8,
										marginBottom: 8
									}}
								>
									<div
										className={meemTheme.centeredRow}
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
						<div className={meemTheme.row}>
							<Space
								w={membershipRequirements.length === 0 ? 0 : 14}
							/>
							<Button
								className={meemTheme.buttonWhite}
								onClick={addMembershipRequirement}
							>
								{'+ Add Requirement'}
							</Button>
						</div>
					</>
				)}

				<Space h={40} />

				<Button
					disabled={isSavingChanges || isTransactionInProgress}
					loading={isSavingChanges || isTransactionInProgress}
					className={meemTheme.buttonBlack}
					onClick={saveChanges}
				>
					{'Save Changes'}
				</Button>
				<Space h={32} />
				<Divider />
				<Space h={32} />
				<Text className={meemTheme.tExtraSmallLabel}>
					DEVELOPER PORTAL
				</Text>
				<Space h={20} />
				<DeveloperPortalButton
					portalButtonText={`Create new requirement types`}
					modalTitle={'Create new requirements'}
					modalText={`Communities may need additional gating requirements in the future. You can contribute by building on the meem app source code. Look for AdminMembershipRequirements.tsx and get coding! Pull Requests are always welcome.`}
					githubLink={`https://github.com/meemproject/meem-app`}
				/>
				<Space h={64} />
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
							currentRequirement?.type === MembershipReqType.None
								? 'anyone'
								: currentRequirement?.type ===
								  MembershipReqType.ApprovedApplicants
								? 'approved-applicants'
								: currentRequirement?.type ===
								  MembershipReqType.TokenHolders
								? 'token-holders'
								: 'other-agreement-member'
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
								case 'other-agreement-member':
									if (currentRequirement) {
										currentRequirement.type =
											MembershipReqType.OtherAgreementMember
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
								value="other-agreement-member"
								label="join another agreement"
								disabled
							/> */}
					</Radio.Group>
					<Space h={24} />
					<div
						className={
							currentRequirement?.type ==
							MembershipReqType.ApprovedApplicants
								? meemTheme.visibleContainer
								: meemTheme.invisibleContainer
						}
					>
						<Text className={meemTheme.tMediumBold}>
							How to apply
						</Text>
						<Space h={4} />
						<Text className={meemTheme.tExtraSmall}>
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
						<Text className={meemTheme.tMediumBold}>
							Approved Addresses
						</Text>
						<Space h={4} />

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
								reqCurrentlyEditing?.tokenChain = value ?? 'eth'
								updateMembershipRequirement(reqCurrentlyEditing)
							}}
							value={reqCurrentlyEditing?.tokenChain}
						/> */}
						<Text className={meemTheme.tSmallBoldFaded}>
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

						<Text className={meemTheme.tSmallBoldFaded}>
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
							MembershipReqType.OtherAgreementMember
								? meemTheme.visibleContainer
								: meemTheme.invisibleContainer
						}
					>
						<Text className={meemTheme.tMediumBoldFaded}>
							Agreement Name
						</Text>

						<TextInput
							radius="lg"
							size="sm"
							value={currentRequirement?.otherAgreementName}
							onChange={event => {
								// TODO: Look up agreement and retrive agreement contract address!
								if (currentRequirement) {
									currentRequirement.otherAgreementName =
										event.target.value
									updateMembershipRequirement(
										currentRequirement
									)
								}
							}}
						/>
					</div>
					<Space h={32} />
					<div className={meemTheme.row}>
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

									if (
										currentRequirement?.tokenMinQuantity <=
										0
									) {
										showErrorNotification(
											'Oops!',
											'Please enter a quantity greater than 0.'
										)
										setIsCheckingRequirement(false)

										return
									}

									setIsCheckingRequirement(false)

									const token =
										await tokenFromContractAddress(
											currentRequirement?.tokenContractAddress,
											wallet
										)

									if (!token) {
										showErrorNotification(
											'Oops!',
											'That token is not valid. Check the contract address and try again.'
										)
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
										if (
											agreement &&
											agreement.adminAddresses
										) {
											agreement?.adminAddresses.forEach(
												admin => {
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
												}
											)
										}
										if (doesApplicantsListContainAdmin) {
											showErrorNotification(
												'Oops!',
												'You cannot add an administrator as an approved address. Manage admins in the Roles tab instead.'
											)
											return
										}

										break
									case MembershipReqType.TokenHolders:
										if (
											currentRequirement?.tokenMinQuantity ===
											0
										) {
											showErrorNotification(
												'Oops!',
												'Please enter a minimum token quantity.'
											)
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
						<Space w={8} />
						<Button
							onClick={() => {
								setMembershipReqModalOpened(false)
							}}
							className={meemTheme.buttonGrey}
						>
							Cancel
						</Button>
					</div>
				</Modal>

				<AgreementAdminChangesComponent
					agreement={newAgreementData}
					isRequestInProgress={isSavingChanges}
					onRequestComplete={() => {
						setIsSavingChanges(false)
					}}
				/>
			</div>
		</>
	)
}
