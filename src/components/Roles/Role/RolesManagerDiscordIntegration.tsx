/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import { Text, Space, Divider, Button, Image, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import { Discord } from 'iconoir-react'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { ExternalLink, Settings } from 'tabler-icons-react'
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

	const [isFetchingGuildInfo, setIsFetchingGuildInfo] = useState(false)

	const [hasFetchedGuildInfo, setHasFetchedGuildInfo] = useState(false)

	const [guildPlatform, setGuildPlatform] = useState<any>()

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
		async function fetchGuildInfo() {
			try {
				if (!club?.id) {
					return
				}
				setIsFetchingGuildInfo(true)
				const guildInfoFetcher = makeFetcher<
					MeemAPI.v1.GetMeemContractGuild.IQueryParams,
					MeemAPI.v1.GetMeemContractGuild.IRequestBody,
					MeemAPI.v1.GetMeemContractGuild.IResponseBody
				>({
					method: MeemAPI.v1.GetMeemContractGuild.method
				})

				const data = await guildInfoFetcher(
					MeemAPI.v1.GetMeemContractGuild.path({
						meemContractId: club.id
					})
				)
				log.debug(JSON.stringify(data))
				if (data && data.guild) {
					data.guild.guildPlatforms.forEach(platform => {
						// Discord server
						if (platform.platformId === 1) {
							setGuildPlatform(platform)
						}
					})
				}
				setHasFetchedGuildInfo(true)
				setIsFetchingGuildInfo(false)
			} catch (e) {
				log.crit(e)
				setHasFetchedGuildInfo(true)
				setIsFetchingGuildInfo(false)
			}
		}

		if (Cookies.get('discordAccessToken')) {
			setDiscordAccessToken(Cookies.get('discordAccessToken') ?? '')
		}

		if (
			!isFetchingGuildInfo &&
			!hasFetchedGuildInfo &&
			role?.id !== 'addRole'
		) {
			fetchGuildInfo()
		} else {
			setHasFetchedGuildInfo(true)
			setIsFetchingGuildInfo(false)
		}
	}, [club?.id, hasFetchedGuildInfo, isFetchingGuildInfo, role?.id])

	// States:
	// 1. Not authenticated with discord
	// 2. Authed and no server linked
	// 3. Authed and server linked with this role
	// 4. Authed and server linked with another role on this club
	// 5. This role is in the 'addRole' state
	// 6. Fetching guild data

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

				{isFetchingGuildInfo && (
					<div>
						<Loader variant={'oval'} color={'red'} />
						<Space h={24} />
					</div>
				)}

				{!isFetchingGuildInfo && (
					<div>
						{/* If role already exists, show Discord settings */}
						{role?.id !== 'addRole' && (
							<div>
								{!guildPlatform && discordAccessToken && (
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

								{guildPlatform &&
									!role?.guildDiscordServerId &&
									discordAccessToken && (
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
												{`Add to ${guildPlatform.platformGuildName}`}
											</Button>
											<Space h={40} />
										</div>
									)}

								{guildPlatform && role?.guildDiscordServerId && (
									<div>
										<div className={styles.centeredRow}>
											<Image
												src={
													guildPlatform
														.platformGuildData
														.serverIcon
												}
												height={48}
												width={48}
												radius={24}
											/>
											<Space w={16} />
											<div>
												<Text className={styles.tTitle}>
													{
														guildPlatform.platformGuildName
													}
												</Text>
												<Text
													className={styles.tLink}
													onClick={() => {
														if (
															chosenDiscordServer
														) {
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
												className={
													styles.enabledIntHeaderBg
												}
											/>
											<div
												className={styles.intItemHeader}
											>
												<Image
													src={`/integration-discord.png`}
													width={16}
													height={16}
													fit={'contain'}
												/>
												<Space w={8} />
												<Text>{`${role?.name} in ${guildPlatform.platformGuildName}`}</Text>
											</div>
											<div
												style={{
													width: '100%'
												}}
											>
												<Space h={12} />
												<Divider />
											</div>
											<div
												className={
													styles.integrationActions
												}
											>
												<a
													onClick={() => {
														window.open(
															guildPlatform.invite
														)
													}}
												>
													<div
														className={
															styles.integrationAction
														}
													>
														<ExternalLink
															size={20}
														/>
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
															message: `For now, manage this role's gated channels within Discord.`
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

						{role && club && (
							<>
								<RoleDiscordConnectServerModal
									existingServerId={
										guildPlatform
											? guildPlatform.platformGuildId
											: undefined
									}
									isOpened={isRoleDiscordConnectModalOpened}
									onModalClosed={() => {
										setIsRoleDiscordConnectModalOpened(
											false
										)
									}}
									onServerChosen={server => {
										setChosenDiscordServer(server)
										setIsRoleDiscordCreateModalOpened(true)
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
					</div>
				)}
			</div>
		</>
	)
}
