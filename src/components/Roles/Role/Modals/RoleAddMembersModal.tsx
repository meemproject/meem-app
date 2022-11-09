import log from '@kengoldfarb/log'
import {
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
import { Search } from 'tabler-icons-react'
import { Club, ClubMember } from '../../../../model/club/club'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

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
	const { classes: styles } = useGlobalStyles()

	const [members, setMembers] = useState<ClubMember[]>([])

	const [filteredMembers, setFilteredMembers] = useState<ClubMember[]>([])

	const [currentSearchTerm, setCurrentSearchTerm] = useState('')

	const [hasFilteredMembers, setHasFilteredMembers] = useState(false)

	useEffect(() => {
		if (
			isOpened &&
			members.length === 0 &&
			!hasFilteredMembers &&
			club.members
		) {
			log.debug('filter out club members...')
			// filter out club members by whether they're already added to this role
			const filteredClubMembers: ClubMember[] = []
			club.members.forEach(member => {
				const filter = existingRoleMembers.filter(
					memb => memb.wallet === member.wallet
				)
				if (filter.length === 0) {
					member.chosen = false
					filteredClubMembers.push(member)
				}
			})
			setMembers(filteredClubMembers)
			setFilteredMembers(filteredClubMembers)
			setHasFilteredMembers(true)
		}

		if (!isOpened && hasFilteredMembers) {
			setHasFilteredMembers(false)
			setMembers([])
		}
	}, [
		club.members,
		existingRoleMembers,
		filteredMembers,
		hasFilteredMembers,
		isOpened,
		members
	])

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
				title={<Text className={styles.tModalTitle}>Add Members</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				<TextInput
					radius={20}
					classNames={{
						input: styles.fTextField
					}}
					icon={<Search />}
					placeholder={'Search Members'}
					className={styles.fullWidth}
					size={'lg'}
					onChange={event => {
						if (event.target.value) {
							setCurrentSearchTerm(event.target.value)
							filterMembers(members, event.target.value)
						} else {
							setCurrentSearchTerm('')
							filterMembers(members, '')
						}
					}}
				/>
				<Space h={16} />

				{filteredMembers && (
					<>
						{filteredMembers.map(member => (
							<div key={member.wallet}>
								<Space h={16} />
								<div className={styles.tListItemTitle}>
									<div className={styles.centeredRow}>
										<Checkbox
											checked={member.chosen}
											onChange={event => {
												if (event.target.value) {
													const newMembers = [
														...members
													]
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
												}
											}}
										/>
										<Space w={16} />
										<Image
											height={40}
											width={40}
											radius={20}
											src={member.profilePicture ?? ''}
										/>
										<Space w={16} />
										<div>
											<Text
												className={
													styles.tListItemTitle
												}
											>
												{member.displayName ??
													'Club Member'}
											</Text>
											<Text
												className={
													styles.tExtraSmallFaded
												}
											>
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
							<Text>
								All members of this club already have this role.
							</Text>
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
				<Space h={24} />

				<div className={styles.row}>
					<Button
						className={styles.buttonBlack}
						onClick={async () => {
							const chosenMembers = members.filter(
								member => member.chosen
							)
							if (chosenMembers.length > 0) {
								onMembersSaved(chosenMembers)
								onModalClosed()
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
					<Space w={8} />
					<Button
						onClick={() => {
							onModalClosed()
						}}
						className={styles.buttonGrey}
					>
						Cancel
					</Button>
				</div>
			</Modal>
		</>
	)
}
