/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import { createStyles, Text, Button, Space, Textarea } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { Club } from '../../../model/club/club'
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

export const CAClubAdmins: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()

	const router = useRouter()

	const wallet = useWallet()

	const clubclub = useContext(ClubClubContext)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [hasLoadedClubData, setHasLoadedClubData] = useState(false)

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
		log.debug(`admins count = ${finalList.length + 1}`)
		setClubAdmins(finalList)
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

		const finalClubAdmins = Object.assign([], clubAdmins)

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

		// Compare to see if there's anything to change - if saving changes

		// Compare club admins
		const oldClubAdmins = club?.admins ?? []
		const newClubAdmins = clubAdmins
		const isClubAdminsSame = oldClubAdmins == newClubAdmins

		if (isClubAdminsSame) {
			log.debug('no changes, nothing to save. Tell user.')
			setIsSavingChanges(false)
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'There are no changes to save.'
			})
			return
		}

		const newClub = club
		if (newClub) {
			newClub.admins = clubAdminAddresses
			setNewClubData(newClub)
			openSaveChangesModal()
		}
	}

	useEffect(() => {
		if (club && !hasLoadedClubData) {
			setHasLoadedClubData(true)

			// Set the club admins array + string, used by the club admins textfield
			let adminsString = ''
			const admins: string[] = []
			if (club.admins) {
				club.admins.forEach(admin => {
					admins.push(admin)
					adminsString = adminsString + `${admin}\n`
				})
			}
			setClubAdmins(admins)
			setClubAdminsString(adminsString)
		}
	}, [
		club,
		clubAdmins.length,
		hasLoadedClubData,
		wallet.accounts,
		wallet.isConnected
	])

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={classes.manageClubHeader}>Club Admins</Text>

				<div>
					<Text className={classes.clubAdminsPrompt}>
						{club
							? `Who can manage this club’s profile and membership
						settings?`
							: `Who can manage this club’s profile, treasury and membership
						settings?`}
					</Text>
					<Text className={classes.clubAdminsInstructions}>
						{club
							? `Add a line break between each address. Note that at
						least one club admin is required at all times.`
							: `Add a line break between each address. Note that at
						least one club admin is required at all times, and you can update treasury addresses via your club's settings page.`}
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

				<Button
					disabled={isSavingChanges}
					loading={isSavingChanges}
					className={classes.buttonSaveChanges}
					onClick={saveChanges}
				>
					{'Save Changes'}
				</Button>
				<Space h="lg" />

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
