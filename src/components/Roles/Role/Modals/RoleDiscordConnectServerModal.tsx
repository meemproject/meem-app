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
import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../../model/club/club'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	club: Club
	role: ClubRole
	isOpened: boolean
	onModalClosed: () => void
	onServerChosen: (server: DiscordServer) => void
}

export interface DiscordServer {
	id: string
	name: string
	icon: string
}

export const RoleDiscordConnectServerModal: React.FC<IProps> = ({
	club,
	role,
	isOpened,
	onModalClosed,
	onServerChosen
}) => {
	const { classes: styles } = useGlobalStyles()

	const [availableDiscordServers, setAvailableDiscordServers] =
		useState<DiscordServer[]>()

	const [isFetchingDiscordServers, setIsFetchingDiscordServers] =
		useState(false)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	useEffect(() => {
		async function fetchDiscordServers() {
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
					MeemAPI.v1.GetDiscordServers.path({
						meemContractId: club.id ?? '',
						meemContractRoleId: role.id
					}),
					undefined,
					{}
				)

				// TODO: parse servers and set them

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

			setAvailableDiscordServers([
				{
					id: 'general',
					name: 'MEEM',
					icon: '/exampleclub.png'
				},
				{
					id: 'random',
					name: 'Guild',
					icon: '/exampleclub.png'
				},
				{
					id: 'members',
					name: 'Paragraph',
					icon: '/exampleclub.png'
				}
			])
			setIsFetchingDiscordServers(false)
		}

		if (isOpened && !availableDiscordServers) {
			fetchDiscordServers()
		}
	}, [availableDiscordServers, isFetchingDiscordServers, isOpened])

	const connectServer = (server: DiscordServer) => {
		setIsSavingChanges(true)
		onServerChosen(server)
		onModalClosed()
		setIsSavingChanges(false)

		log.debug(isSavingChanges)
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
					<Text className={styles.tModalTitle}>
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
								className={styles.buttonGrey}
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
									<div className={styles.spacedRowCentered}>
										<div className={styles.centeredRow}>
											<Image
												radius={24}
												height={48}
												width={48}
												src={server.icon}
											/>
											<Space w={16} />
											<div>
												<Text className={styles.tBold}>
													{server.name}
												</Text>
												<Space h={4} />
												<Text>Admin</Text>
											</div>
										</div>
										<Button
											onClick={() => {
												connectServer(server)
											}}
											className={styles.buttonBlack}
										>
											Connect
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
										className={styles.buttonGrey}
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
