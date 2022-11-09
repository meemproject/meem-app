import { Badge, HoverCard, Image, Space, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React from 'react'
import { Check } from 'tabler-icons-react'
import { ClubMember } from '../../../../model/club/club'
import { quickTruncate } from '../../../../utils/truncated_wallet'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	member: ClubMember
}

export const ClubMemberCard: React.FC<IProps> = ({ member }) => {
	const { classes: styles } = useGlobalStyles()

	return (
		<HoverCard.Dropdown>
			<div className={styles.row}>
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
					<Text className={styles.tBold}>
						{member.displayName && member.displayName.length > 0
							? member.displayName
							: 'Club Member'}
					</Text>

					<div className={styles.centeredRow}>
						<Text className={styles.tFaded}>
							{member.ens
								? member.ens
								: quickTruncate(member.wallet)}
						</Text>
						<Space h={4} />
						<Image
							className={styles.copyIcon}
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
					<div className={styles.centeredRow}>
						<Text className={styles.tBold}>Contact</Text>
						<Space w={4} />
						<Image
							src="/icon-verified.png"
							width={16}
							height={16}
						/>
					</div>
					{member.twitterUsername && (
						<div
							onClick={() => {
								window.open(
									`https://twitter.com/${member.twitterUsername}`
								)
							}}
							className={styles.centeredRowClickable}
						>
							<Image
								className={styles.tFaded}
								src="/integration-twitter.png"
								width={12}
								height={12}
							/>
							<Space w={4} />
							<Text className={styles.tFaded}>
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
							className={styles.centeredRowClickable}
						>
							<Image
								className={styles.tFaded}
								src="/integration-discord.png"
								width={12}
								height={12}
							/>
							<Space w={4} />
							<Text className={styles.tFaded}>
								{member.discordUsername}
							</Text>
						</div>
					)}
					{member.emailAddress && (
						<div
							onClick={() => {
								window.open(`mailto:${member.emailAddress}`)
							}}
							className={styles.centeredRowClickable}
						>
							<Image
								className={styles.tFaded}
								src="/integration-email.png"
								width={12}
								height={12}
							/>
							<Space w={4} />
							<Text className={styles.tFaded}>
								{member.emailAddress}
							</Text>
						</div>
					)}
				</>
			)}
			{member.roles && member.roles.length > 0 && (
				<>
					<Space h={24} />
					<Text className={styles.tBold}>{'Roles'}</Text>
					<Space h={4} />
					{member.roles.map(role => (
						<div className={styles.row} key={role.id}>
							<Badge
								variant="gradient"
								gradient={{
									from: 'rgba(255, 102, 81, 0.1)',
									to: 'rgba(255, 102, 81, 0.1)',
									deg: 35
								}}
								classNames={{
									inner: styles.tBadge,
									root: styles.badge
								}}
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
