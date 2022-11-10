import { Badge, HoverCard, Image, Space, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React from 'react'
import { Check } from 'tabler-icons-react'
import { ClubMember } from '../../../../model/club/club'
import { quickTruncate } from '../../../../utils/truncated_wallet'
import { colorPink, useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	member: ClubMember
}

export const ClubMemberCard: React.FC<IProps> = ({ member }) => {
	const { classes: design } = useGlobalStyles()

	return (
		<HoverCard.Dropdown>
			<div className={design.centeredRow}>
				{member.profilePicture && (
					<>
						<Image
							src={member.profilePicture}
							radius={24}
							height={48}
							width={48}
						/>
						<Space w={16} />
					</>
				)}
				<div>
					<Text className={design.tSmallBold}>
						{member.displayName && member.displayName.length > 0
							? member.displayName
							: 'Club Member'}
					</Text>
					<Space h={4} />

					<div className={design.centeredRow}>
						<Text className={design.tSmallFaded}>
							{member.ens
								? member.ens
								: quickTruncate(member.wallet)}
						</Text>
						<Image
							className={design.copyIcon}
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
					<div className={design.centeredRow}>
						<Text className={design.tSmallBold}>Contact</Text>
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
							className={design.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={design.tSmallFaded}
								src="/integration-twitter.png"
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={design.tSmallFaded}>
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
							className={design.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={design.tSmallFaded}
								src="/integration-discord.png"
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={design.tSmallFaded}>
								{member.discordUsername}
							</Text>
						</div>
					)}
					{member.emailAddress && (
						<div
							onClick={() => {
								window.open(`mailto:${member.emailAddress}`)
							}}
							className={design.centeredRowClickable}
							style={{ paddingBottom: 4 }}
						>
							<Image
								className={design.tSmallFaded}
								src="/integration-email.png"
								width={16}
								height={12}
							/>
							<Space w={6} />
							<Text className={design.tSmallFaded}>
								{member.emailAddress}
							</Text>
						</div>
					)}
				</>
			)}
			{member.roles && member.roles.length > 0 && (
				<>
					<Space h={24} />
					<Text className={design.tSmallBold}>{'Roles'}</Text>
					<Space h={4} />
					{member.roles.map(role => (
						<div className={design.row} key={role.id}>
							<Badge
								variant="gradient"
								gradient={{
									from: colorPink,
									to: colorPink,
									deg: 35
								}}
								classNames={{
									inner: design.tBadgeText,
									root: design.badge
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
