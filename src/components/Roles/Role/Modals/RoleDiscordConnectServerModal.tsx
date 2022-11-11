/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// Disabled unused vars for dev purposes
import log from '@kengoldfarb/log'
import {
	Text,
	Space,
	Modal,
	Button,
	Center,
	Loader,
	Image
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useState } from 'react'
import { AlertCircle } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../../model/club/club'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	club: Club
	role: ClubRole
	isOpened: boolean
	existingServerId: string
	onModalClosed: () => void
	onServerChosen: (server: MeemAPI.IDiscordServer) => void
}

export const RoleDiscordConnectServerModal: React.FC<IProps> = ({
	club,
	role,
	isOpened,
	existingServerId,
	onModalClosed,
	onServerChosen
}) => {
	const { classes: design } = useGlobalStyles()

	const [availableDiscordServers, setAvailableDiscordServers] =
		useState<MeemAPI.IDiscordServer[]>()

	const [isFetchingDiscordServers, setIsFetchingDiscordServers] =
		useState(false)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const fetch = useCallback(async () => {
		setIsFetchingDiscordServers(true)
		// Send request
		try {
			const getDiscordServersFetcher = makeFetcher<
				MeemAPI.v1.GetDiscordServers.IQueryParams,
				MeemAPI.v1.GetDiscordServers.IRequestBody,
				MeemAPI.v1.GetDiscordServers.IResponseBody
			>({
				method: MeemAPI.v1.GetDiscordServers.method
			})

			const servers = await getDiscordServersFetcher(
				MeemAPI.v1.GetDiscordServers.path({}),
				{ accessToken: Cookies.get('discordAccessToken') ?? '' }
			)

			const dServers: MeemAPI.IDiscordServer[] = []
			servers.discordServers.forEach(server => {
				dServers.push(server)
			})

			setAvailableDiscordServers(dServers)

			// This club already has a discord role, so we'll use this discord server info instead of offering a selection
			if (existingServerId) {
				dServers.forEach(server => {
					if (server.id === existingServerId) {
						onServerChosen(server)
						onModalClosed()
					}
				})
			}
			setIsFetchingDiscordServers(false)
		} catch (e) {
			log.debug(e)
			showNotification({
				title: 'Error',
				autoClose: 5000,
				color: 'red',
				icon: <AlertCircle />,
				message: `Unable to fetch Discord servers. Please try again later.`
			})
			setIsFetchingDiscordServers(false)
			onModalClosed()
			return
		}
	}, [existingServerId, onModalClosed, onServerChosen])

	useEffect(() => {
		async function fetchDiscordServers() {
			if (!isFetchingDiscordServers) {
				await fetch()
			}
		}

		if (isOpened && !availableDiscordServers) {
			fetchDiscordServers()
		}

		if (isOpened && existingServerId && availableDiscordServers) {
			// This club already has a discord role, so we'll use this discord server info instead of offering a selection
			// availableDiscordServers.forEach(server => {
			// 	if (server.id === existingServerId) {
			// 		onServerChosen(server)
			// 		onModalClosed()
			// 	}
			// })
		}
	}, [
		availableDiscordServers,
		club.id,
		existingServerId,
		fetch,
		isFetchingDiscordServers,
		isOpened,
		onModalClosed,
		onServerChosen,
		role.id
	])

	const connectServer = async (server: MeemAPI.IDiscordServer) => {
		if (server.guildData.isAdmin) {
			// Continue and close modal
			onServerChosen(server)
			onModalClosed()
		} else {
			setIsSavingChanges(true)
			const scope = encodeURIComponent(`bot applications.commands`)
			const discordAuth = window.open(
				`https://discord.com/api/oauth2/authorize?client_id=868172385000509460&guild_id=${server.id}&permissions=268782673&scope=${scope}`
			)

			// This is a neat hack to see if the auth window has been closed!
			const timer = setInterval(function () {
				if (discordAuth && discordAuth.closed) {
					clearInterval(timer)

					// Refetch servers
					setAvailableDiscordServers(undefined)
					setIsSavingChanges(false)
					fetch()
				}
			}, 500)
		}
	}

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={false}
				radius={16}
				overlayBlur={8}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={design.tMediumBold}>
						{isSavingChanges
							? ``
							: `Which Discord server would you like to connect?`}
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{((!availableDiscordServers && isFetchingDiscordServers) ||
					isSavingChanges) && (
					<>
						<Center>
							<div>
								{isSavingChanges && (
									<div>
										<Text>Connecting server...</Text>
										<Space h={16} />
									</div>
								)}
								<Center>
									<Loader variant="oval" color={'red'} />
								</Center>

								<Space h={16} />
							</div>
						</Center>
					</>
				)}
				{!availableDiscordServers && !isFetchingDiscordServers && (
					<>
						<Center>
							<Text>
								Sorry - unable to load Discord servers. Try
								again later.
							</Text>
							<Space h={16} />
							<Button
								onClick={() => {
									onModalClosed()
								}}
								className={design.buttonGrey}
							>
								Close
							</Button>
						</Center>
					</>
				)}
				{availableDiscordServers &&
					!isFetchingDiscordServers &&
					!isSavingChanges && (
						<>
							{availableDiscordServers.map(server => (
								<div
									key={server.id}
									style={{
										backgroundColor: '#FAFAFA',
										borderRadius: 16,
										padding: 16,
										marginBottom: 16
									}}
								>
									<div className={design.spacedRowCentered}>
										<div className={design.centeredRow}>
											<Image
												radius={24}
												height={48}
												width={48}
												src={
													server.guildData.serverIcon
														.length > 0
														? server.guildData
																.serverIcon
														: '/apple-touch-icon.png'
												}
											/>
											<Space w={16} />
											<div>
												<Text
													className={
														design.tSmallBold
													}
												>
													{server.name}
												</Text>

												<Space h={4} />
												<Text>
													{server.guildData.isAdmin
														? 'Admin'
														: 'Requires Guild Bot'}
												</Text>
											</div>
										</div>
										<Button
											disabled={
												server.guildData
													.connectedGuildId !== null
											}
											onClick={() => {
												connectServer(server)
											}}
											className={design.buttonBlack}
										>
											{server.guildData.connectedGuildId
												? 'Connected to another Guild'
												: server.guildData.isAdmin
												? 'Connect'
												: 'Add Guild Bot'}
										</Button>
									</div>
								</div>
							))}

							{!isSavingChanges && (
								<div>
									<Space h={16} />

									<Button
										onClick={() => {
											onModalClosed()
										}}
										className={design.buttonGrey}
									>
										Cancel
									</Button>
								</div>
							)}
						</>
					)}
			</Modal>
		</>
	)
}
