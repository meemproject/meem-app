import {
	Badge,
	HoverCard,
	Image,
	Space,
	Text,
	useMantineColorScheme
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React from 'react'
import { Check } from 'tabler-icons-react'
import { ClubMember } from '../../../../model/club/club'
import { quickTruncate } from '../../../../utils/truncated_wallet'
import { colorPink, useClubsTheme } from '../../../Styles/ClubsTheme'

interface IProps {
	member: ClubMember
}

export const ClubMemberCard: React.FC<IProps> = ({ member }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<HoverCard.Dropdown>
			<div className={clubsTheme.centeredRow}>
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
					<Text className={clubsTheme.tSmallBold}>
						{member.displayName
							? member.displayName
							: member.isClubOwner
							? 'Club Owner'
							: member.isClubAdmin
							? 'Club Admin'
							: 'Club Member'}
					</Text>
					<Space h={4} />

					<div className={clubsTheme.centeredRow}>
						<Text className={clubsTheme.tSmallFaded}>
							{member.ens
								? member.ens
								: quickTruncate(member.wallet)}
						</Text>
						<Image
							className={clubsTheme.copyIcon}
							src="/copy.png"
							height={18}
							width={18}
							onClick={() => {
								navigator.clipboard.writeText(
									member.ens ? member.ens : member.wallet
								)
								showNotification({
									radius: 'lg',
									title: 'Address copied',
									autoClose: 2000,
									color: 'green',
									icon: <Check />,

									message: `This member's address was copied to your clipboard.`
								})
							}}
						/>
					</div>
				</div>
			</div>
			{(member.emailAddress ||
				member.twitterUsername ||
				member.discordUsername) && (
				<>
					<Space h={24} />
					<div className={clubsTheme.centeredRow}>
						<Text className={clubsTheme.tSmallBold}>Contact</Text>
						<Space w={6} />
						<Image
							src="/icon-verified.png"
							width={16}
							height={16}
						/>
					</div>
					<Space h={4} />
					{member.twitterUsername && (
						<div
							onClick={() => {
								window.open(
									`https://twitter.com/${member.twitterUsername}`
								)
							}}
							className={clubsTheme.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={clubsTheme.tSmallFaded}
								src={
									isDarkTheme
										? '/integration-twitter-white.png'
										: '/integration-twitter.png'
								}
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={clubsTheme.tSmallFaded}>
								{member.twitterUsername}
							</Text>
						</div>
					)}
					{member.discordUsername && (
						<div
							onClick={() => {
								window.open(
									`https://discordapp.com/users/${member.discordUserId}`
								)
							}}
							className={clubsTheme.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={clubsTheme.tSmallFaded}
								src={
									isDarkTheme
										? '/integration-discord-white.png'
										: '/integration-discord.png'
								}
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={clubsTheme.tSmallFaded}>
								{member.discordUsername}
							</Text>
						</div>
					)}
					{member.emailAddress && (
						<div
							onClick={() => {
								window.open(`mailto:${member.emailAddress}`)
							}}
							className={clubsTheme.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={clubsTheme.tSmallFaded}
								src="/integration-email.png"
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={clubsTheme.tSmallFaded}>
								{member.emailAddress}
							</Text>
						</div>
					)}
				</>
			)}
			{member.roles && member.roles.length > 0 && (
				<>
					<Space h={24} />
					<Text className={clubsTheme.tSmallBold}>{'Roles'}</Text>
					<Space h={4} />
					{member.roles.map(role => (
						<div className={clubsTheme.row} key={role.id}>
							<Badge
								variant="gradient"
								gradient={{
									from: colorPink,
									to: colorPink,
									deg: 35
								}}
								classNames={{
									inner: clubsTheme.tBadgeTextWhite,
									root: clubsTheme.badge
								}}
								style={{ marginBottom: 4 }}
							>
								{role.name}
							</Badge>
						</div>
					))}
				</>
			)}
		</HoverCard.Dropdown>
	)
}
