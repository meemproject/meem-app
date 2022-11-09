/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import {
	Text,
	Space,
	Divider,
	Button,
	Image,
	TextInput,
	Center,
	HoverCard
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { CircleMinus, Lock, Search } from 'tabler-icons-react'
import { Club, ClubMember, ClubRole } from '../../../model/club/club'
import { ClubMemberCard } from '../../Profile/Tabs/Identity/ClubMemberCard'
import { useGlobalStyles } from '../../Styles/GlobalStyles'
import { RoleAddMembersModal } from './Modals/RoleAddMembersModal'

interface IProps {
	club: Club
	role?: ClubRole
	onSaveChanges: () => void
	onMembersUpdated: (members: ClubMember[]) => void
}

export const RolesManagerMembers: React.FC<IProps> = ({
	club,
	role,
	onSaveChanges,
	onMembersUpdated
}) => {
	const { classes: design } = useGlobalStyles()

	const [currentSearchTerm, setCurrentSearchTerm] = useState('')

	const [members, setMembers] = useState<ClubMember[]>([])

	const [filteredMembers, setFilteredMembers] = useState<ClubMember[]>()

	useEffect(() => {
		if (!filteredMembers && club && role && club.memberRolesMap) {
			setMembers(club.memberRolesMap.get(role.id) ?? [])
			setFilteredMembers(club.memberRolesMap.get(role.id) ?? [])
		}
	}, [club, filteredMembers, members, role])

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

	const addMember = (member: ClubMember) => {
		log.debug('add member')
		const newMembers = [...members]
		newMembers.push(member)
		filterMembers(newMembers, currentSearchTerm)
		setMembers(newMembers)
	}

	const removeMember = (member: ClubMember) => {
		const newMembers = members.filter(memb => memb.wallet !== member.wallet)
		filterMembers(newMembers, currentSearchTerm)
		setMembers(newMembers)
	}

	const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)

	return (
		<>
			<div>
				<Space h={14} />
				<div className={design.centeredRow}>
					<TextInput
						radius={20}
						classNames={{
							input: design.fTextField
						}}
						icon={<Search />}
						placeholder={'Search Members'}
						className={design.fullWidth}
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

					{!role?.isDefaultRole && role?.name !== 'Club Member' && (
						<div className={design.row}>
							<Space w={16} />

							<Button
								className={design.buttonWhite}
								onClick={() => {
									setIsMembersModalOpen(true)
								}}
							>
								+ Add Members
							</Button>
						</div>
					)}
				</div>
				<Space h={16} />

				{filteredMembers && (
					<>
						{filteredMembers.map(member => (
							<div key={member.wallet}>
								<Space h={16} />
								<div className={design.spacedRowCentered}>
									<HoverCard
										width={280}
										shadow="md"
										radius={16}
									>
										<HoverCard.Target>
											<div className={design.centeredRow}>
												{member.profilePicture && (
													<>
														<Image
															height={36}
															width={36}
															radius={18}
															src={
																member.profilePicture ??
																''
															}
														/>
														<Space w={16} />
													</>
												)}

												<div>
													<Text
														className={
															design.tListItemTitle
														}
													>
														{member.displayName
															? member.displayName
															: member.isClubOwner
															? 'Club Owner'
															: member.isClubAdmin
															? 'Club Admin'
															: 'Club Member'}
													</Text>
													<Text
														className={
															design.tExtraSmallFaded
														}
													>
														{member.ens
															? member.ens
															: member.wallet}
													</Text>
												</div>
											</div>
										</HoverCard.Target>
										<ClubMemberCard member={member} />
									</HoverCard>

									{(!role?.isDefaultRole ||
										(role.isAdminRole &&
											!member.isClubOwner)) && (
										<>
											<CircleMinus
												className={design.clickable}
												onClick={() => {
													removeMember(member)
												}}
											/>
										</>
									)}
									{(role?.name === 'Token Holder' ||
										(role?.isAdminRole &&
											member.isClubOwner)) && (
										<>
											<Lock />
										</>
									)}
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
								{`This role hasn’t been assigned to any members
								yet.`}
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
				<Space h={32} />

				<Space h={24} />
				<Button
					className={design.buttonBlack}
					onClick={() => {
						onSaveChanges()
					}}
				>
					Save Changes
				</Button>
			</div>

			<Space h={64} />
			<RoleAddMembersModal
				existingRoleMembers={members}
				club={club}
				onModalClosed={() => {
					setIsMembersModalOpen(false)
				}}
				isOpened={isMembersModalOpen}
				onMembersSaved={newMembers => {
					newMembers.forEach(member => {
						addMember(member)
					})
					onMembersUpdated(newMembers)
				}}
			/>
		</>
	)
}
