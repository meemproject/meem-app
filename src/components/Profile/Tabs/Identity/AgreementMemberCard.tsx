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
import { AgreementMember } from '../../../../model/agreement/agreements'
import { quickTruncate } from '../../../../utils/truncated_wallet'
import { colorBlue, useMeemTheme } from '../../../Styles/MeemTheme'

interface IProps {
	member: AgreementMember
}

export const AgreementMemberCard: React.FC<IProps> = ({ member }) => {
	const { classes: meemTheme } = useMeemTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<HoverCard.Dropdown>
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
							? 'Community Owner'
							: member.isAgreementAdmin
							? 'Community Administrator'
							: 'Community Member'}
					</Text>
					<Space h={4} />

					<div className={meemTheme.centeredRow}>
						<Text className={meemTheme.tSmallFaded}>
							{member.ens
								? member.ens
								: quickTruncate(member.wallet)}
						</Text>
						<Image
							className={meemTheme.copyIcon}
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
					<div className={meemTheme.centeredRow}>
						<Text className={meemTheme.tSmallBold}>Contact</Text>
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
							className={meemTheme.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={meemTheme.tSmallFaded}
								src={
									isDarkTheme
										? '/extension-twitter-white.png'
										: '/extension-twitter.png'
								}
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={meemTheme.tSmallFaded}>
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
							className={meemTheme.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={meemTheme.tSmallFaded}
								src={
									isDarkTheme
										? '/extension-discord-white.png'
										: '/extension-discord.png'
								}
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={meemTheme.tSmallFaded}>
								{member.discordUsername}
							</Text>
						</div>
					)}
					{member.emailAddress && (
						<div
							onClick={() => {
								window.open(`mailto:${member.emailAddress}`)
							}}
							className={meemTheme.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={meemTheme.tSmallFaded}
								src="/extension-email.png"
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={meemTheme.tSmallFaded}>
								{member.emailAddress}
							</Text>
						</div>
					)}
				</>
			)}
			{member.roles && member.roles.length > 0 && (
				<>
					<Space h={24} />
					<Text className={meemTheme.tSmallBold}>{'Roles'}</Text>
					<Space h={4} />
					{member.roles.map(role => (
						<div className={meemTheme.row} key={role.id}>
							<Badge
								variant="gradient"
								gradient={{
									from: colorBlue,
									to: colorBlue,
									deg: 35
								}}
								classNames={{
									inner: meemTheme.tBadgeTextWhite,
									root: meemTheme.badge
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