import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Divider,
	Image,
	Button,
	TextInput,
	Checkbox,
	Center
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import { Club, ClubMember } from '../../../../model/club/club'

const useStyles = createStyles(theme => ({
	row: { display: 'flex' },
	header: {
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	buttonConfirm: {
		paddingTop: 8,
		paddingLeft: 16,
		paddingBottom: 8,
		paddingRight: 16,
		color: 'white',
		backgroundColor: 'black',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	stepDescription: {
		fontSize: 14
	},

	isVerifiedSection: {
		paddingLeft: 8,
		paddingRight: 8
	},
	modalText: {
		fontSize: 16
	},
	modalQuestion: {
		fontSize: 14,
		fontWeight: 600
	},
	fullWidthTextInput: {
		width: '100%'
	},
	clickable: {
		cursor: 'pointer'
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
	memberItemRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	memberDataRow: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	}
}))

interface IProps {
	club: Club
	existingRoleMembers: ClubMember[]
	isOpened: boolean
	onMembersSaved: (members: ClubMember[]) => void
	onModalClosed: () => void
}

export const RoleAddMembersModal: React.FC<IProps> = ({
	club,
	existingRoleMembers,
	isOpened,
	onMembersSaved,
	onModalClosed
}) => {
	const { classes } = useStyles()

	const [members, setMembers] = useState<ClubMember[]>([])

	const [filteredMembers, setFilteredMembers] = useState<ClubMember[]>([])

	const [currentSearchTerm, setCurrentSearchTerm] = useState('')

	useEffect(() => {
		if (isOpened && members.length === 0 && club.members) {
			log.debug('filter out club members...')
			// filter out club members by whether they're already added to this role
			const filteredClubMembers: ClubMember[] = []
			club.members.forEach(member => {
				const filter = existingRoleMembers.filter(
					memb => memb.wallet === member.wallet
				)
				if (filter.length === 0) {
					filteredClubMembers.push(member)
				}
			})
			setMembers(filteredClubMembers)
			setFilteredMembers(filteredClubMembers)
		}
	}, [club.members, existingRoleMembers, filteredMembers, isOpened, members])

	const filterMembers = (allMembers: ClubMember[], searchTerm: string) => {
		const search = searchTerm
		const newFiltered: ClubMember[] = []

		if (searchTerm.length > 0) {
			allMembers.forEach(member => {
				if (
					(member.displayName &&
						member.displayName.toLowerCase().includes(search)) ||
					(member.ens && member.ens.toLowerCase().includes(search)) ||
					(member.wallet &&
						member.wallet.toLowerCase().includes(search))
				) {
					newFiltered.push(member)
				}
			})
			log.debug(
				`found ${newFiltered.length} entries matching search term ${searchTerm}`
			)
			setFilteredMembers(newFiltered)
		} else {
			log.debug('no search term, resetting to all members')
			setFilteredMembers(allMembers)
		}
	}

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={false}
				radius={16}
				overlayBlur={8}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={<Text className={classes.modalTitle}>Add Members</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />

				<TextInput
					size={'md'}
					radius={16}
					className={classes.fullWidthTextInput}
					onChange={event => {
						if (event.target.value) {
							setCurrentSearchTerm(event.target.value)
							filterMembers(members, event.target.value)
						} else {
							filterMembers(members, '')
						}
					}}
				/>
				{filteredMembers && (
					<>
						{filteredMembers.map(member => (
							<div key={member.wallet}>
								<Space h={16} />
								<div className={classes.memberItemRow}>
									<div className={classes.memberDataRow}>
										<Checkbox
											checked={member.chosen}
											onChange={event => {
												const newMembers = [...members]
												newMembers.forEach(
													newMember => {
														if (
															newMember.wallet ===
															member.wallet
														) {
															newMember.chosen =
																event.currentTarget.checked
														}
													}
												)
												setMembers(newMembers)
												filterMembers(
													newMembers,
													currentSearchTerm
												)
											}}
										/>
										<Image
											height={40}
											width={40}
											radius={20}
											src={member.profilePicture ?? ''}
										/>
										<Space w={16} />
										<div>
											<Text>
												{member.displayName ??
													'Club Member'}
											</Text>
											<Text>
												{member.ens
													? member.ens
													: member.wallet}
											</Text>
										</div>
									</div>
								</div>
								<Space h={16} />
								<Divider />
							</div>
						))}
					</>
				)}
				{members.length === 0 && (
					<>
						<Space h={24} />
						<Center>
							<Text>No members found...</Text>
						</Center>
					</>
				)}
				{members.length > 0 &&
					filteredMembers &&
					filteredMembers.length === 0 && (
						<>
							<Space h={24} />
							<Center>
								<Text>
									No members found with that search term. Try
									something else.
								</Text>
							</Center>
						</>
					)}

				<div className={classes.row}>
					<Button
						className={classes.buttonModalSave}
						onClick={async () => {
							const chosenMembers = members.filter(
								member => member.chosen
							)
							if (chosenMembers.length > 0) {
								onMembersSaved(chosenMembers)
							} else {
								showNotification({
									radius: 'lg',
									title: 'Oops!',
									message: `Please choose at least one member!`
								})
							}
						}}
					>
						{'+ Add Members'}
					</Button>
					<Space w={16} />
					<Button
						onClick={() => {
							onModalClosed()
						}}
						className={classes.buttonModalCancel}
					>
						Cancel
					</Button>
				</div>

				<Space h={24} />
			</Modal>
		</>
	)
}
