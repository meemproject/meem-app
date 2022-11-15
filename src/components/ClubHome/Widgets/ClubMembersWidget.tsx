import log from '@kengoldfarb/log'
import {
	Text,
	Button,
	Space,
	Image,
	TextInput,
	HoverCard,
	Divider,
	Center
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Search } from 'tabler-icons-react'
import { Club, ClubMember } from '../../../model/club/club'
import { ClubMemberCard } from '../../Profile/Tabs/Identity/ClubMemberCard'
import {
	colorDarkGrey,
	colorLightGrey,
	useClubsTheme
} from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const ClubMembersWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const [members, setMembers] = useState<ClubMember[]>([])

	const [filteredMembers, setFilteredMembers] = useState<ClubMember[]>()

	useEffect(() => {
		if (!filteredMembers && club) {
			setMembers(club.members ? club.members.slice(0, 10) : [])
			setFilteredMembers(club.members ? club.members.slice(0, 10) : [])
		}
	}, [club, filteredMembers, members])

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
			setFilteredMembers(newFiltered.slice(0, 10))
		} else {
			log.debug('no search term, resetting to all members')
			setFilteredMembers(allMembers.slice(0, 10))
		}
	}

	return (
		<>
			<div className={clubsTheme.widgetLight}>
				<div className={clubsTheme.spacedRowCentered}>
					<div className={clubsTheme.centeredRow}>
						<Text className={clubsTheme.tLargeBold}>Members</Text>
						<Space w={8} />
						<Text
							className={clubsTheme.tLarge}
							style={{ color: colorDarkGrey }}
						>{`(${club.members?.length ?? 0})`}</Text>
					</div>
					<Button className={clubsTheme.buttonRed}>View All</Button>
				</div>
				<Space h={24} />

				<TextInput
					radius={20}
					classNames={{
						input: clubsTheme.fTextField
					}}
					icon={<Search />}
					placeholder={'Search Members'}
					className={clubsTheme.fullWidth}
					size={'lg'}
					onChange={event => {
						if (event.target.value) {
							filterMembers(members, event.target.value)
						} else {
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
								<div className={clubsTheme.spacedRowCentered}>
									<HoverCard
										width={280}
										shadow="md"
										radius={16}
									>
										<HoverCard.Target>
											<div
												className={
													clubsTheme.centeredRow
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
															: '/member-placeholder.png'
													}
												/>
												<Space w={16} />

												<div>
													<Text
														className={
															clubsTheme.tSmallBold
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
															clubsTheme.tExtraSmallFaded
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
								</div>
								<Space h={16} />
								<Divider color={colorLightGrey} />
							</div>
						))}
					</>
				)}
				{members.length === 0 && (
					<>
						<Space h={24} />
						<Center>
							<Text>
								{`This club somehow has no members. This may or may not be a rip in the space-time continuum.`}
							</Text>
						</Center>
						<Space h={24} />
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
							<Space h={24} />
						</>
					)}
			</div>
		</>
	)
}
