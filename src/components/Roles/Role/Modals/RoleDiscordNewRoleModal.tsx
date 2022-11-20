// Disabled unused vars for dev purposes
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Button,
	Center,
	Loader,
	Select,
	// Bug in mantine imports here
	// eslint-disable-next-line import/named
	SelectItemProps,
	Radio,
	TextInput,
	Checkbox
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/sdk'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { forwardRef, useEffect, useState } from 'react'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../../model/club/club'
import { colorPink, useClubsTheme } from '../../../Styles/ClubsTheme'

interface IProps {
	club: Club
	role: ClubRole
	server?: MeemAPI.IDiscordServer
	isOpened: boolean
	onModalClosed: () => void
}

export const RoleDiscordNewRoleModal: React.FC<IProps> = ({
	club,
	role,
	server,
	isOpened,
	onModalClosed
}) => {
	const { classes: clubsTheme } = useClubsTheme()

	const router = useRouter()

	const [discordRoleName, setDiscordRoleName] = useState('')

	const [selectedDiscordCategories, setSelectedDiscordCategories] =
		useState<string[]>()

	const [selectedDiscordChannels, setSelectedDiscordChannels] =
		useState<string[]>()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const saveChanges = async () => {
		setIsSavingChanges(true)

		const accessToken = Cookies.get('discordAccessToken')

		if (server && accessToken) {
			try {
				const createDiscordRoleFetcher = makeFetcher<
					MeemAPI.v1.UpdateAgreementRole.IQueryParams,
					MeemAPI.v1.UpdateAgreementRole.IRequestBody,
					MeemAPI.v1.UpdateAgreementRole.IResponseBody
				>({
					method: MeemAPI.v1.UpdateAgreementRole.method
				})

				await createDiscordRoleFetcher(
					MeemAPI.v1.UpdateAgreementRole.path({
						agreementId: club.id ?? '',
						agreementRoleId: role.id ?? ''
					}),
					undefined,
					{
						roleIntegrationsData: [
							{
								discordServerId: server.id,
								discordGatedChannels: selectedDiscordChannels,
								discordAccessToken: accessToken
							}
						]
					}
				)

				showNotification({
					title: 'Success!',
					autoClose: 5000,
					color: 'green',
					icon: <CircleCheck />,
					message: `Discord role created. Just a moment...`
				})

				router.reload()
			} catch (e) {
				log.debug(e)
				showNotification({
					title: 'Error',
					autoClose: 5000,
					color: colorPink,
					icon: <AlertCircle />,
					message: `Unable to create this role on Discord. Please let us know!`
				})
				setIsSavingChanges(false)
				return
			}
		}

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
					<Text className={clubsTheme.tMediumBold}>
						Create New Discord Role
					</Text>
				}
				onClose={() => {
					onModalClosed()
					setSelectedDiscordCategories([])
				}}
			>
				{isOpened && isSavingChanges && (
					<>
						<Center>
							<div>
								<Loader color={'red'} variant={'oval'} />
								<Space h={24} />
							</div>
						</Center>
					</>
				)}
				{server &&
					!isSavingChanges &&
					server.guildData.channels.length === 0 && (
						<>
							<Center>
								<Text>
									Sorry - unable to load Discord channels. Try
									again later, or make sure the server you
									selected has at least one channel.
								</Text>
								<Space h={16} />
								<Button
									onClick={() => {
										onModalClosed()
									}}
									className={clubsTheme.buttonGrey}
								>
									Close
								</Button>
							</Center>
						</>
					)}
				{server &&
					!isSavingChanges &&
					server.guildData.channels.length > 0 && (
						<>
							<Space h={8} />
							<div className={clubsTheme.row}>
								<Text className={clubsTheme.tExtraSmallLabel}>
									DISCORD ROLE NAME
								</Text>
							</div>
							<Space h={8} />
							<TextInput
								size={'lg'}
								radius={20}
								disabled
								classNames={{
									input: clubsTheme.fTextField
								}}
								value={role.name}
								onChange={event => {
									if (event) {
										setDiscordRoleName(event.target.value)
									}
								}}
							/>

							<Space h={32} />

							<div className={clubsTheme.row}>
								<Button
									disabled={isSavingChanges}
									loading={isSavingChanges}
									className={clubsTheme.buttonBlack}
									onClick={async () => {
										saveChanges()
									}}
								>
									{'Save Changes'}
								</Button>
								<Space w={8} />
								{!isSavingChanges && (
									<Button
										onClick={() => {
											setSelectedDiscordChannels([])
											setSelectedDiscordCategories([])
											setDiscordRoleName('')
											onModalClosed()
										}}
										className={clubsTheme.buttonGrey}
									>
										Cancel
									</Button>
								)}
							</div>
						</>
					)}
			</Modal>

			{/* Original modal with channel selection  */}
			{/* <Modal
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
					<Text className={clubsTheme.tMediumBold}>
						Create New Discord Role
					</Text>
				}
				onClose={() => {
					onModalClosed()
					setSelectedDiscordCategories([])
				}}
			>
				{isOpened && isSavingChanges && (
					<>
						<Center>
							<div>
								<Loader color={'red'} variant={'oval'} />
								<Space h={24} />
							</div>
						</Center>
					</>
				)}
				{server &&
					!isSavingChanges &&
					server.guildData.channels.length === 0 && (
						<>
							<Center>
								<Text>
									Sorry - unable to load Discord channels. Try
									again later, or make sure the server you
									selected has at least one channel.
								</Text>
								<Space h={16} />
								<Button
									onClick={() => {
										onModalClosed()
									}}
									className={clubsTheme.buttonGrey}
								>
									Close
								</Button>
							</Center>
						</>
					)}
				{server &&
					!isSavingChanges &&
					server.guildData.channels.length > 0 && (
						<>
							<Space h={8} />
							<div className={clubsTheme.row}>
								<Text className={clubsTheme.tSmallLabel}>
									DISCORD ROLE NAME
								</Text>
								<Space w={2} />
								<Text color={'red'}>*</Text>
							</div>
							<Space h={16} />
							<TextInput
								size={'lg'}
								radius={20}
								disabled
								classNames={{
									input: clubsTheme.fTextField
								}}
								value={role.name}
								onChange={event => {
									if (event) {
										setDiscordRoleName(event.target.value)
									}
								}}
							/>
							<Space h={32} />

							<Text className={clubsTheme.tSmallBold}>
								Channels to Gate
							</Text>
							<Space h={8} />

							<Checkbox.Group
								orientation="vertical"
								spacing={'xs'}
								value={selectedDiscordCategories}
								onChange={categories => {
									// Logic to select / de-select all the channels in a category when a category is selected
									setSelectedDiscordCategories(categories)
									const channels: string[] = []
									categories.forEach(category => {
										let matchingCategory: any
										server.guildData.categories.forEach(
											originalCategory => {
												if (
													category ===
													originalCategory.id
												) {
													matchingCategory =
														originalCategory
												}
											}
										)
										matchingCategory.channels.forEach(
											(channel: any) => {
												channels.push(channel.id)
											}
										)
									})
									setSelectedDiscordChannels(channels)
								}}
							>
								{server.guildData.categories.map(category => (
									<div key={category.id}>
										<Checkbox
											value={category.id}
											label={category.name}
										/>
										<div style={{ marginLeft: 32 }}>
											<Checkbox.Group
												orientation="vertical"
												spacing={'xs'}
												value={selectedDiscordChannels}
												onChange={
													setSelectedDiscordChannels
												}
											>
												{category.channels.map(
													channel => (
														<Checkbox
															key={channel.id}
															value={channel.id}
															label={channel.name}
														/>
													)
												)}
											</Checkbox.Group>
										</div>
									</div>
								))}
							</Checkbox.Group>

							<Space h={32} />

							<div className={clubsTheme.row}>
								<Button
									disabled={isSavingChanges}
									loading={isSavingChanges}
									className={clubsTheme.buttonBlack}
									onClick={async () => {
										saveChanges()
									}}
								>
									{'Save Changes'}
								</Button>
								<Space w={8} />
								{!isSavingChanges && (
									<Button
										onClick={() => {
											setSelectedDiscordChannels([])
											setSelectedDiscordCategories([])
											setDiscordRoleName('')
											onModalClosed()
										}}
										className={clubsTheme.buttonGrey}
									>
										Cancel
									</Button>
								)}
							</div>
						</>
					)}
			</Modal> */}
		</>
	)
}
