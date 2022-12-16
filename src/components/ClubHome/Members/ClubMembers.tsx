/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	TextInput,
	Image,
	Space,
	Grid,
	Loader,
	Center,
	HoverCard
} from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Search, Star } from 'tabler-icons-react'
import { ClubMember } from '../../../model/club/club'
import { quickTruncate } from '../../../utils/truncated_wallet'
import { ClubMemberCard } from '../../Profile/Tabs/Identity/ClubMemberCard'
import { useClubsTheme } from '../../Styles/ClubsTheme'
import { useClub } from '../ClubProvider'

interface IProps {
	slug: string
}

export const ClubMembersComponent: React.FC<IProps> = ({ slug }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const { club, isLoadingClub, error } = useClub()

	const navigateToClubDetail = () => {
		router.push({ pathname: `/${slug}` })
	}

	const memberIsAdmin = (member: string): boolean => {
		if (club) {
			let isAdmin = false
			club.adminAddresses?.forEach(admin => {
				if (admin === member) {
					isAdmin = true
				}
			})

			return isAdmin
		} else {
			return false
		}
	}

	const [members, setMembers] = useState<ClubMember[]>([])

	const [filteredMembers, setFilteredMembers] = useState<ClubMember[]>()

	useEffect(() => {
		if (!filteredMembers && club) {
			setMembers(club.members ?? [])
			setFilteredMembers(club.members ?? [])
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
			setFilteredMembers(newFiltered)
		} else {
			log.debug('no search term, resetting to all members')
			setFilteredMembers(allMembers)
		}
	}

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="red" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingClub && !error && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this club. Please let us
							know!
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && club?.name && (
				<>
					<div className={clubsTheme.pageHeader}>
						<div className={clubsTheme.row}>
							<Image
								width={80}
								height={80}
								radius={16}
								fit="cover"
								className={clubsTheme.imageClubLogo}
								src={club.image}
							/>
							<Space w={24} />
							<div>
								<Text
									className={clubsTheme.tLargeBold}
									style={{ marginTop: -4 }}
								>
									{club.name}
								</Text>
								<Space h={4} />
								<Text
									className={clubsTheme.tSmallFaded}
									style={{
										wordBreak: 'break-word',
										marginTop: 4,
										marginRight: 16
									}}
								>
									{club.description}
								</Text>
							</div>
						</div>
						<a
							className={clubsTheme.pageHeaderExitButton}
							onClick={navigateToClubDetail}
						>
							<Image src="/delete.png" width={24} height={24} />
						</a>
					</div>

					<Container>
						<Text
							className={clubsTheme.tMediumBoldFaded}
							style={{
								marginBottom: 16,
								marginTop: 40
							}}
						>{`Members (${filteredMembers?.length})`}</Text>
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
						<Space h={24} />
						{filterMembers?.length === 0 && (
							<Text className={clubsTheme.tMedium}>
								No members were found matching your search term.
							</Text>
						)}
						{filteredMembers && filterMembers?.length > 0 && (
							<Grid>
								{filteredMembers.map(member => (
									<Grid.Col
										xs={6}
										sm={4}
										md={4}
										lg={4}
										xl={4}
										key={member.wallet}
									>
										<HoverCard
											width={280}
											shadow="md"
											radius={16}
										>
											<HoverCard.Target>
												<div
													className={
														clubsTheme.gridItemCentered
													}
													style={{ minHeight: 70 }}
												>
													{member.profilePicture && (
														<Image
															style={{
																marginRight: 10
															}}
															src={
																member.profilePicture
															}
															radius={16}
															height={32}
															width={32}
														/>
													)}

													<Text
														styles={{
															marginLeft: 6
														}}
													>
														{member.displayName
															? member.displayName
															: member.ens
															? member.ens
															: member.wallet.toLowerCase() ===
															  process.env
																	.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
															? 'meem.eth'
															: quickTruncate(
																	member.wallet
															  )}
													</Text>
													{memberIsAdmin(
														member.wallet
													) && (
														<Star
															style={{
																marginLeft: 6,
																height: 16,
																width: 16
															}}
														/>
													)}
												</div>
											</HoverCard.Target>
											<ClubMemberCard member={member} />
										</HoverCard>
									</Grid.Col>
								))}
							</Grid>
						)}
					</Container>
				</>
			)}
		</>
	)
}
