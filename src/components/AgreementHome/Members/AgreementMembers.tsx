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
import { DeleteCircle, Search, Star } from 'iconoir-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { AgreementMember } from '../../../model/agreement/agreements'
import { AgreementMemberCard } from '../../Profile/Tabs/Identity/AgreementMemberCard'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { useAgreement } from '../AgreementProvider'

export const AgreementMembersComponent: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement, error } = useAgreement()

	let members: AgreementMember[] = []
	if (agreement) {
		members = agreement.members ?? []
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
			setSearchedMembers(newFiltered)
		} else {
			log.debug('no search term, resetting to all members')
			setSearchedMembers(allMembers)
		}
	}

	const memberGridItem = (member: AgreementMember) => (
		<>
			<Grid.Col xs={6} sm={4} md={4} lg={4} xl={4} key={member.wallet}>
				<HoverCard width={280} shadow="md" radius={16}>
					<HoverCard.Target>
						<div
							className={meemTheme.gridItem}
							style={{
								minHeight: 60,
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<Image
								style={{
									marginRight: 10
								}}
								src={
									member.profilePicture &&
									member.profilePicture.length > 0
										? member.profilePicture
										: '/member-placeholder.png'
								}
								radius={16}
								height={32}
								width={32}
							/>

							<Text
								styles={{
									marginLeft: 6
								}}
							>
								{member.identity}
							</Text>
							{(member.isAgreementAdmin ||
								member.isAgreementOwner) && (
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
					<AgreementMemberCard
						agreement={agreement}
						member={member}
					/>
				</HoverCard>
			</Grid.Col>
		</>
	)

	return (
		<>
			{isLoadingAgreement && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="cyan" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && !error && !agreement?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, this community does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this community. Contact
							us using the top-right link on this page.
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && agreement?.name && (
				<>
					<div className={meemTheme.pageHeader}>
						<div className={meemTheme.row}>
							{agreement.image && (
								<div
									className={meemTheme.pageHeaderImage}
									style={{ cursor: 'pointer' }}
								>
									<Link href={`/${agreement.slug}`}>
										<Image
											width={80}
											height={80}
											radius={8}
											className={
												meemTheme.imageAgreementLogo
											}
											src={agreement.image}
										/>
									</Link>
								</div>
							)}
							<div>
								<Text
									className={meemTheme.tLargeBold}
									style={{ marginTop: -4 }}
								>
									{agreement.name}
								</Text>
								<Space h={4} />
								<Text
									className={meemTheme.tSmallFaded}
									style={{
										wordBreak: 'break-word',
										marginTop: 4,
										marginRight: 16
									}}
								>
									{agreement.description &&
									agreement.description.length > 0
										? agreement.description
										: 'A Meem community'}
								</Text>
							</div>
						</div>
						<div className={meemTheme.pageHeaderExitButton}>
							<Link href={`/${agreement.slug}`}>
								<DeleteCircle width={24} height={24} />
							</Link>
						</div>
					</div>

					<Container>
						<Text
							className={meemTheme.tMediumBoldFaded}
							style={{
								marginBottom: 16,
								marginTop: 40
							}}
						>{`Members (${
							(hasSearched ? searchedMembers : members)?.length
						})`}</Text>
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
									if (!hasSearched) {
										setHasSearched(true)
									}
									filterMembers(members, event.target.value)
								} else {
									filterMembers(members, '')
								}
							}}
						/>
						<Space h={24} />
						{hasSearched && searchedMembers?.length === 0 && (
							<Text className={meemTheme.tMedium}>
								No members were found matching your search term.
							</Text>
						)}
						{members && !hasSearched && (
							<Grid>
								{members.map(member => (
									<>{memberGridItem(member)}</>
								))}
							</Grid>
						)}
						{members && hasSearched && (
							<Grid>
								{searchedMembers.map(member => (
									<>{memberGridItem(member)}</>
								))}
							</Grid>
						)}
					</Container>
				</>
			)}
		</>
	)
}
