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
	Center
} from '@mantine/core'
import { Calendar, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { Clock } from 'tabler-icons-react'
import { MembershipSettings, Club } from '../../../model/club/club'
import { quickTruncate } from '../../../utils/truncated_wallet'
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
	club?: Club
}

export const CAMembershipSettings: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()

	const router = useRouter()

	const wallet = useWallet()

	const clubclub = useContext(ClubClubContext)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [hasLoadedClubData, setHasLoadedClubData] = useState(false)

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

	const [isCheckingRequirement, setIsCheckingRequirement] = useState(false)

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

	const [newClubData, setNewClubData] = useState<Club>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = async () => {
		// 'save changes' modal for execution club settings updates
		setSaveChangesModalOpened(true)
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

		// Validate / convert club admins
		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

		// Start saving changes on UI
		setIsSavingChanges(true)

		// Convert funds address from ENS if necessary
		let rawMembershipFundsAddress = ''
		if (membershipFundsAddress.length > 0) {
			const address = await provider.resolveName(membershipFundsAddress)
			rawMembershipFundsAddress = address ?? membershipFundsAddress
		}

		if (club?.membershipSettings?.requirements) {
			// If all good, build Membership Settings
			const settings: MembershipSettings = {
				requirements: club.membershipSettings.requirements,
				costToJoin,
				membershipFundsAddress: rawMembershipFundsAddress,
				membershipQuantity,
				membershipStartDate,
				membershipEndDate
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

			setCostToJoin(originalSettings.costToJoin)
			setMembershipQuantity(originalSettings.membershipQuantity ?? 0)

			if (originalSettings?.membershipStartDate) {
				setMembershipStartDate(
					new Date(originalSettings.membershipStartDate)
				)
			}
			if (originalSettings?.membershipEndDate) {
				setMembershipEndDate(
					new Date(originalSettings.membershipEndDate)
				)
			}

			setMembershipFundsAddress(
				originalSettings.membershipFundsAddress ?? ''
			)
		}
	}, [club, hasLoadedClubData, wallet.accounts, wallet.isConnected])

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={classes.manageClubHeader}>
					Membership Settings
				</Text>

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
					<Radio.Group
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
					<Radio.Group
						classNames={{ label: classes.radio }}
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
					<Radio.Group
						classNames={{ label: classes.radio }}
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
						className={classes.buttonModalSave}
					>
						Done
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
