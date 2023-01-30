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
import React, { useState } from 'react'
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

	let members: AgreementMember[] = []
	if (agreement) {
		members = agreement.members ? agreement.members.slice(0, 10) : []
	}

	const [searchedMembers, setSearchedMembers] = useState<AgreementMember[]>(
		[]
	)

	const [hasSearched, setHasSearched] = useState(false)

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
			setSearchedMembers(newFiltered.slice(0, 10))
		} else {
			log.debug('no search term, resetting to all members')
			setSearchedMembers(allMembers.slice(0, 10))
		}
	}

	const memberItem = (member: AgreementMember) => (
		<>
			<div key={member.wallet}>
				<Space h={16} />
				<div className={meemTheme.spacedRowCentered}>
					<HoverCard width={280} shadow="md" radius={16}>
						<HoverCard.Target>
							<div className={meemTheme.centeredRow}>
								<Image
									height={36}
									width={36}
									radius={18}
									fit={'cover'}
									src={
										member.profilePicture &&
										member.profilePicture.length > 0
											? member.profilePicture
											: isDarkTheme
											? '/member-placeholder-white.png'
											: '/member-placeholder.png'
									}
								/>
								<Space w={16} />

								<div>
									<Text className={meemTheme.tSmallBold}>
										{member.displayName
											? member.displayName
											: member.isMeemApi
											? 'Meem API'
											: member.isAgreementOwner
											? 'Owner'
											: member.isAgreementAdmin
											? 'Admin'
											: 'Member'}
									</Text>
									<Text
										className={meemTheme.tExtraSmallFaded}
									>
										{member.ens
											? member.ens
											: quickTruncate(member.wallet)}
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
		</>
	)

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
							if (!hasSearched) {
								setHasSearched(true)
							}
							filterMembers(members, event.target.value)
						} else {
							filterMembers(members, '')
						}
					}}
				/>

				<Space h={16} />

				{members && !hasSearched && (
					<>
						{members.map(member => (
							<> {memberItem(member)} </>
						))}
					</>
				)}
				{members && hasSearched && (
					<>
						{searchedMembers.map(member => (
							<> {memberItem(member)} </>
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
					hasSearched &&
					searchedMembers &&
					searchedMembers.length === 0 && (
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
