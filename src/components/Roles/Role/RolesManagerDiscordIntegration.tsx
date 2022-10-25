/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text, Space, Divider, Button, Image } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { Discord } from 'iconoir-react'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { CirclePlus, ExternalLink, Settings } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'
import { RoleDiscordConnectServerModal } from './Modals/RoleDiscordConnectServerModal'
import { RoleDiscordLaunchingModal } from './Modals/RoleDiscordLaunchingModal'
import { RoleDiscordNewRoleModal } from './Modals/RoleDiscordNewRoleModal'
import { RoleDiscordSyncModal } from './Modals/RoleDiscordSyncModal'

interface IProps {
	role?: ClubRole
	club?: Club
}

export const RolesManagerDiscordIntegration: React.FC<IProps> = ({
	role,
	club
}) => {
	const { classes: styles } = useGlobalStyles()

	const [
		isRoleDiscordConnectModalOpened,
		setIsRoleDiscordConnectModalOpened
	] = useState(false)

	const [isRoleDiscordSyncModalOpened, setIsRoleDiscordSyncModalOpened] =
		useState(false)

	const [isRoleDiscordCreateModalOpened, setIsRoleDiscordCreateModalOpened] =
		useState(false)

	const [chosenDiscordServer, setChosenDiscordServer] =
		useState<MeemAPI.IDiscordServer>()

	const [
		isRoleDiscordCloseTabModalOpened,
		setIsRoleDiscordCloseTabModalOpened
	] = useState(false)

	const [discordAccessToken, setDiscordAccessToken] = useState('')

	const startDiscordAuth = () => {
		const uri = encodeURIComponent(`${window.location.origin}/profile`)
		const scope = encodeURIComponent(`identify guilds`)
		Cookies.set('authForDiscordRole', 'true')
		Cookies.set('roleId', role ? role.id : '')
		Cookies.set('clubSlug', club && club.slug ? club.slug : '')
		setIsRoleDiscordCloseTabModalOpened(true)
		window.open(
			`https://discord.com/api/oauth2/authorize?client_id=967119580088660039&redirect_uri=${uri}&response_type=code&scope=${scope}`,
			'_self'
		)
	}
	useEffect(() => {
		if (Cookies.get('discordAccessToken')) {
			setDiscordAccessToken(Cookies.get('discordAccessToken') ?? '')
		}
	}, [role?.guildDiscordServerId])

	return (
		<>
			<div>
				<Text className={styles.tSectionTitle}>Discord Role</Text>
				{role?.id === 'addRole' && (
					<div>
						<Space h={8} />
						<Text>
							Save this role first to connect it to Discord
						</Text>
						<Space h={16} />
					</div>
				)}
				<Space h={24} />

				{/* If role already exists, show Discord settings */}
				{role?.id !== 'addRole' && (
					<div>
						{discordAccessToken && chosenDiscordServer && (
							<div>
								<div className={styles.centeredRow}>
									<Image
										src={chosenDiscordServer.icon}
										height={48}
										width={48}
										radius={24}
									/>
									<Space w={16} />
									<div>
										<Text className={styles.tTitle}>
											{chosenDiscordServer.name}
										</Text>
										<Text
											className={styles.tLink}
											onClick={() => {
												if (chosenDiscordServer) {
													// Just clear chosen discord server
													setChosenDiscordServer(
														undefined
													)
												}
											}}
										>
											Disconnect
										</Text>
									</div>
								</div>
								<Space h={24} />
								{discordAccessToken && (
									<div>
										<Button
											className={styles.buttonWhite}
											leftIcon={<CirclePlus />}
											onClick={() => {
												setIsRoleDiscordCreateModalOpened(
													true
												)
											}}
										>
											Create New Discord Role
										</Button>
										{/* <Space h={8} />
										<Button
											className={styles.buttonWhite}
											leftIcon={<Link />}
											onClick={() => {
												setIsRoleDiscordSyncModalOpened(
													true
												)
											}}
										>
											Sync Existing Discord Role
										</Button> */}
										<Space h={40} />
									</div>
								)}
							</div>
						)}

						{!role?.guildRoleId &&
							discordAccessToken &&
							!chosenDiscordServer && (
								<div>
									<Button
										className={styles.buttonWhite}
										leftIcon={<Discord />}
										onClick={() => {
											setIsRoleDiscordConnectModalOpened(
												true
											)
										}}
									>
										Choose a Discord Server
									</Button>
									<Space h={40} />
								</div>
							)}

						{role?.guildRoleId && !chosenDiscordServer && (
							<div>
								<div className={styles.centeredRow}>
									<Image
										src={role.guildDiscordServerIcon}
										height={48}
										width={48}
										radius={24}
									/>
									<Space w={16} />
									<div>
										<Text className={styles.tTitle}>
											{role.guildDiscordServerName}
										</Text>
										<Text
											className={styles.tLink}
											onClick={() => {
												if (chosenDiscordServer) {
													// Just clear chosen discord server
													setChosenDiscordServer(
														undefined
													)
												}
											}}
										>
											Disconnect
										</Text>
									</div>
								</div>
								<Space h={24} />
								<div
									className={
										styles.enabledClubIntegrationItem
									}
									style={{ width: 400 }}
								>
									<div
										className={styles.enabledIntHeaderBg}
									/>
									<div className={styles.intItemHeader}>
										<Image
											src={`/integration-discord.png`}
											width={16}
											height={16}
											fit={'contain'}
										/>
										<Space w={8} />
										<Text>{`${role.guildRoleName} in ${role.guildDiscordServerName}`}</Text>
									</div>
									<div
										style={{
											width: '100%'
										}}
									>
										<Space h={12} />
										<Divider />
									</div>
									<div className={styles.integrationActions}>
										<a onClick={() => {}}>
											<div
												className={
													styles.integrationAction
												}
											>
												<ExternalLink size={20} />
												<Space w={4} />
												<Text
													className={
														styles.tExtraSmall
													}
												>
													Launch Discord
												</Text>
											</div>
										</a>
										<Space w={4} />
										<Divider orientation="vertical" />
										<Space w={4} />

										<a
											onClick={() => {
												showNotification({
													title: 'Coming soon!',
													autoClose: 5000,
													message: `For now, disconnect and reconnect to this server to edit this Discord Role.`
												})
											}}
										>
											<div
												className={
													styles.integrationAction
												}
											>
												<Settings size={20} />
												<Space w={4} />
												<Text
													className={
														styles.tExtraSmall
													}
												>
													Settings
												</Text>
											</div>
										</a>
									</div>
								</div>
								<Space h={40} />
							</div>
						)}

						{!discordAccessToken && (
							<div>
								<Button
									className={styles.buttonWhite}
									leftIcon={<Discord />}
									onClick={() => {
										startDiscordAuth()
									}}
								>
									Connect Discord
								</Button>
								<Space h={32} />
							</div>
						)}
					</div>
				)}
			</div>

			{role && club && (
				<>
					<RoleDiscordConnectServerModal
						isOpened={isRoleDiscordConnectModalOpened}
						onModalClosed={() => {
							setIsRoleDiscordConnectModalOpened(false)
						}}
						onServerChosen={server => {
							setChosenDiscordServer(server)
						}}
						role={role}
						club={club}
					/>
					<RoleDiscordSyncModal
						isOpened={isRoleDiscordSyncModalOpened}
						onModalClosed={() => {
							setIsRoleDiscordSyncModalOpened(false)
						}}
						role={role}
						club={club}
					/>
					<RoleDiscordNewRoleModal
						isOpened={isRoleDiscordCreateModalOpened}
						onModalClosed={() => {
							setIsRoleDiscordCreateModalOpened(false)
						}}
						server={chosenDiscordServer}
						role={role}
						club={club}
					/>
				</>
			)}

			<RoleDiscordLaunchingModal
				isOpened={isRoleDiscordCloseTabModalOpened}
				onModalClosed={() => {
					setIsRoleDiscordCloseTabModalOpened(false)
				}}
			/>
		</>
	)
}
