import log from '@kengoldfarb/log'
import {
	Text,
	Button,
	Space,
	Image,
	TextInput,
	HoverCard,
	Divider,
	Center,
	useMantineColorScheme
} from '@mantine/core'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Search } from 'tabler-icons-react'
import { Agreement, AgreementMember } from '../../../model/agreement/agreements'
import { quickTruncate } from '../../../utils/truncated_wallet'
import { AgreementMemberCard } from '../../Profile/Tabs/Identity/AgreementMemberCard'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementMembersWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const [members, setMembers] = useState<AgreementMember[]>([])

	const [filteredMembers, setFilteredMembers] = useState<AgreementMember[]>()

	useEffect(() => {
		if (!filteredMembers && agreement) {
			setMembers(agreement.members ? agreement.members.slice(0, 10) : [])
			setFilteredMembers(
				agreement.members ? agreement.members.slice(0, 10) : []
			)
		}
	}, [agreement, filteredMembers, members])

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
			setFilteredMembers(newFiltered.slice(0, 10))
		} else {
			log.debug('no search term, resetting to all members')
			setFilteredMembers(allMembers.slice(0, 10))
		}
	}

	return (
		<>
			<div className={meemTheme.widgetAsh}>
				<div className={meemTheme.spacedRowCentered}>
					<div className={meemTheme.centeredRow}>
						<Text className={meemTheme.tMediumBold}>Members</Text>
						<Space w={6} />
						<Text className={meemTheme.tMedium}>{`(${
							agreement.members?.length ?? 0
						})`}</Text>
					</div>

					{agreement.isLaunched && (
						<Link href={`/${agreement.slug}/members`}>
							<Button className={meemTheme.buttonBlack}>
								View All
							</Button>
						</Link>
					)}
				</div>
				<Space h={24} />

				<TextInput
					radius={16}
					classNames={{
						input: meemTheme.fTextField
					}}
					icon={<Search />}
					placeholder={'Search Members'}
					className={meemTheme.fullWidth}
					size={'md'}
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
															: quickTruncate(
																	member.wallet
															  )}
													</Text>
												</div>
											</div>
										</HoverCard.Target>
										<AgreementMemberCard member={member} />
									</HoverCard>
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
							<Text className={meemTheme.tSmall}>
								{`Members are being set up. Come back later!`}
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
				{members.length > 0 && !agreement.isLaunched && (
					<>
						<Space h={24} />
						<Center>
							<Link
								href={`/${agreement.slug}/admin?tab=airdrops`}
							>
								<Button className={meemTheme.buttonAsh}>
									Invite members
								</Button>
							</Link>
						</Center>
					</>
				)}
			</div>
		</>
	)
}
