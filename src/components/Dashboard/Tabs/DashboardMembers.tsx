/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import {
	Text,
	Image,
	Space,
	Center,
	Container,
	Grid,
	HoverCard,
	Loader,
	TextInput,
	Button
} from '@mantine/core'
import { Star, Search } from 'iconoir-react'
import React, { useState } from 'react'
import { AgreementMember } from '../../../model/agreement/agreements'
import { useAgreement } from '../../Providers/AgreementProvider'
import { AgreementMemberCard } from '../../Roles/Role/AgreementMemberCard'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { AddMembersModal } from '../Modals/AddMembersModal'

export const DashboardMembers: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()

	const { agreement, isLoadingAgreement, error } = useAgreement()

	let members: AgreementMember[] = []
	if (agreement) {
		members = agreement.members ?? []
	}

	const [searchedMembers, setSearchedMembers] = useState<AgreementMember[]>(
		[]
	)

	const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false)

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
						member.displayName
							.toLowerCase()
							.includes(search.toLowerCase())) ||
					(member.ens &&
						member.ens
							.toLowerCase()
							.includes(search.toLowerCase())) ||
					(member.wallet &&
						member.wallet
							.toLowerCase()
							.includes(search.toLowerCase()))
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
			<Grid.Col xs={6} sm={6} md={6} lg={6} xl={6} key={member.wallet}>
				<HoverCard width={280} shadow="md" radius={16}>
					<HoverCard.Target>
						<div
							className={meemTheme.gridItemFlowTemplate}
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
					<div>
						<Space h={24} />

						<Text className={meemTheme.tLargeBold}>{`Members (${
							(hasSearched ? searchedMembers : members)?.length
						})`}</Text>

						<Space h={32} />
					</div>

					<div className={meemTheme.centeredRow}>
						<TextInput
							radius={8}
							icon={<Search height={16} width={16} />}
							placeholder={'Search'}
							className={meemTheme.fullWidth}
							size={'sm'}
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
						<Space w={16} />
						<Button
							className={meemTheme.buttonBlack}
							onClick={() => {
								setIsAddMembersModalOpen(true)
							}}
						>
							Add Members
						</Button>
					</div>
					<Space h={24} />
					{hasSearched && searchedMembers?.length === 0 && (
						<Text className={meemTheme.tSmall}>
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
				</>
			)}
			<AddMembersModal
				isOpened={isAddMembersModalOpen}
				onModalClosed={() => {
					setIsAddMembersModalOpen(false)
				}}
			/>
		</>
	)
}
