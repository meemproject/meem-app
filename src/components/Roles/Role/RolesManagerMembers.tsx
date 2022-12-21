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
	HoverCard,
	useMantineColorScheme
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { CircleMinus, Lock, Search } from 'tabler-icons-react'
import {
	Agreement,
	AgreementMember,
	AgreementRole
} from '../../../model/agreement/agreements'
import { AgreementMemberCard } from '../../Profile/Tabs/Identity/AgreementMemberCard'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { RoleAddMembersModal } from './Modals/RoleAddMembersModal'

interface IProps {
	agreement: Agreement
	role?: AgreementRole
	onSaveChanges: () => void
	onMembersUpdated: (members: AgreementMember[]) => void
}

export const RolesManagerMembers: React.FC<IProps> = ({
	agreement,
	role,
	onSaveChanges,
	onMembersUpdated
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const [currentSearchTerm, setCurrentSearchTerm] = useState('')

	const [members, setMembers] = useState<AgreementMember[]>([])

	const [filteredMembers, setFilteredMembers] = useState<AgreementMember[]>()

	useEffect(() => {
		if (!filteredMembers && agreement && role && agreement.memberRolesMap) {
			setMembers(agreement.memberRolesMap.get(role.id) ?? [])
			setFilteredMembers(agreement.memberRolesMap.get(role.id) ?? [])
		}
	}, [agreement, filteredMembers, members, role])

	const filterMembers = (
		allMembers: AgreementMember[],
		searchTerm: string
	) => {
		const search = searchTerm
		const newFiltered: AgreementMember[] = []

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

	const addMember = (member: AgreementMember) => {
		log.debug('add member')
		const newMembers = [...members]
		newMembers.push(member)
		filterMembers(newMembers, currentSearchTerm)
		setMembers(newMembers)
	}

	const removeMember = (member: AgreementMember) => {
		const newMembers = members.filter(memb => memb.wallet !== member.wallet)
		filterMembers(newMembers, currentSearchTerm)
		setMembers(newMembers)
	}

	const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)

	return (
		<>
			<div>
				<Space h={14} />
				<div className={meemTheme.centeredRow}>
					<TextInput
						radius={20}
						classNames={{
							input: meemTheme.fTextField
						}}
						icon={<Search />}
						placeholder={'Search Members'}
						className={meemTheme.fullWidth}
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

					{role?.name !== 'Agreement Member' && (
						<div className={meemTheme.row}>
							<Space w={16} />

							<Button
								className={meemTheme.buttonWhite}
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
								<div className={meemTheme.spacedRowCentered}>
									<HoverCard
										width={280}
										shadow="md"
										radius={16}
									>
										<HoverCard.Target>
											<div
												className={
													meemTheme.centeredRow
												}
											>
												<Image
													height={36}
													width={36}
													radius={18}
													fit={'cover'}
													src={
														member.profilePicture &&
														member.profilePicture
															.length > 0
															? member.profilePicture
															: isDarkTheme
															? '/member-placeholder-white.png'
															: '/member-placeholder.png'
													}
												/>
												<Space w={16} />

												<div>
													<Text
														className={
															meemTheme.tSmallBold
														}
													>
														{member.displayName
															? member.displayName
															: member.isMeemApi
															? 'Meem API'
															: member.isAgreementOwner
															? 'Community Owner'
															: member.isAgreementAdmin
															? 'Community Administrator'
															: 'Community Member'}
													</Text>
													<Text
														className={
															meemTheme.tExtraSmallFaded
														}
													>
														{member.ens
															? member.ens
															: member.wallet}
													</Text>
												</div>
											</div>
										</HoverCard.Target>
										<AgreementMemberCard member={member} />
									</HoverCard>

									{!role?.isAdminRole &&
										!member.isAgreementOwner && (
											<>
												<CircleMinus
													className={
														meemTheme.clickable
													}
													onClick={() => {
														removeMember(member)
													}}
												/>
											</>
										)}
									{(role?.name === 'Token Holder' ||
										(role?.isAdminRole &&
											member.isAgreementOwner)) && (
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
					className={meemTheme.buttonBlack}
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
				agreement={agreement}
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
