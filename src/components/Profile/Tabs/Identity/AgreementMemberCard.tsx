import {
	Badge,
	Button,
	HoverCard,
	Image,
	Space,
	Text,
	useMantineColorScheme
} from '@mantine/core'
import { Copy } from 'iconoir-react'
import React, { useState } from 'react'
import {
	Agreement,
	AgreementMember
} from '../../../../model/agreement/agreements'
import { showSuccessNotification } from '../../../../utils/notifications'
import { RemoveMemberComponent } from '../../../Dashboard/ChangesComponents/RemoveMemberComponent'
import { RemoveMemberConfirmationModal } from '../../../Dashboard/Modals/RemoveMemberConfirmationModal'
import {
	colorBlack,
	colorBlue,
	colorDarkBlue,
	colorWhite,
	useMeemTheme
} from '../../../Styles/MeemTheme'

interface IProps {
	agreement?: Agreement
	member: AgreementMember
}

export const AgreementMemberCard: React.FC<IProps> = ({
	agreement,
	member
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

	const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false)

	return (
		<>
			<HoverCard.Dropdown
				style={{
					backgroundColor: isDarkTheme ? colorBlack : colorWhite
				}}
			>
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
					<Space w={12} />
					<div>
						<div className={meemTheme.centeredRow}>
							<Text className={meemTheme.tSmallBold}>
								{member.identity}
							</Text>
							<Space w={2} />
							<Copy
								className={meemTheme.copyIcon}
								height={18}
								width={18}
								color={colorBlue}
								onClick={() => {
									navigator.clipboard.writeText(
										member.ens ? member.ens : member.wallet
									)
									showSuccessNotification(
										'Address copied',
										`This member's address was copied to your clipboard.`
									)
								}}
							/>
						</div>
						{member.isAgreementOwner && (
							<Text className={meemTheme.tExtraSmallFaded}>
								Owner
							</Text>
						)}
					</div>
				</div>
				{(member.emailAddress ||
					member.twitterUsername ||
					member.discordUsername) && (
					<>
						<Space h={24} />
						<div className={meemTheme.centeredRow}>
							<Text className={meemTheme.tSmallBold}>
								Contact
							</Text>
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
										from: colorDarkBlue,
										to: colorDarkBlue,
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
				{agreement?.isCurrentUserAgreementAdmin &&
					!member.isAgreementOwner && (
						<>
							<Space h={16} />
							<Button
								onClick={() => {
									setIsConfirmModalOpen(true)
								}}
								className={meemTheme.buttonOrangeRedBordered}
							>
								Remove
							</Button>
						</>
					)}
			</HoverCard.Dropdown>
			<RemoveMemberConfirmationModal
				isOpened={isConfirmModalOpen}
				onOptionChosen={function (confirmed: boolean): void {
					if (confirmed) {
						setIsDeletionModalOpen(true)
					}
				}}
				onModalClosed={function (): void {
					setIsConfirmModalOpen(false)
				}}
			/>
			<RemoveMemberComponent
				agreement={agreement}
				member={member}
				isRequestInProgress={isDeletionModalOpen}
				onRequestComplete={function (): void {
					setIsDeletionModalOpen(false)
				}}
			/>
		</>
	)
}
