import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Button,
	Space,
	Divider,
	Image,
	Modal,
	Loader,
	TextInput,
	Grid
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import router from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import request from 'superagent'
import { Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { GetIdentityIntegrationsQuery } from '../../../../../generated/graphql'
import { IDENTITY_INTEGRATIONS_QUERY } from '../../../../graphql/id'
import {
	AvailableIdentityIntegration,
	IdentityIntegration,
	identityIntegrationFromApi
} from '../../../../model/identity/identity'
import { useCustomApollo } from '../../../../providers/ApolloProvider'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'
import IdentityContext from '../../IdentityProvider'
import { ManageLinkedAccountModal } from './ManageLinkedAccountModal'
import { ProfileLinkDiscordModal } from './ProfileLinkDiscordModal'
import { ProfileLinkEmailModal } from './ProfileLinkEmailModal'
import { ProfileLinkTwitterModal } from './ProfileLinkTwitterModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export const ManageIdentityComponent: React.FC = () => {
	const { classes: design } = useGlobalStyles()

	const wallet = useWallet()
	const id = useContext(IdentityContext)

	const { anonClient } = useCustomApollo()

	// Mutable identity data
	const [displayName, setDisplayName] = useState('')
	const [profilePicture, setProfilePicture] = useState('')
	const [profilePicBase64, setProfilePicBase64] = useState<string>('')
	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

	// Available integrations
	const [availableIntegrations, setAvailableIntegrations] = useState<
		AvailableIdentityIntegration[]
	>([])

	const [integrationCurrentlyEditing, setIntegrationCurrentlyEditing] =
		useState<IdentityIntegration>()

	// Fetch a list of available integrations.
	const { data: inteData } = useQuery<GetIdentityIntegrationsQuery>(
		IDENTITY_INTEGRATIONS_QUERY,
		{
			client: anonClient
		}
	)

	// Discord-specific integration data
	const [discordAuthCode, setIsDiscordAuthCode] = useState<string>()

	// Club logo
	const [
		openFileSelector,
		{ filesContent: rawProfilePicture, loading: isLoadingImage }
	] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		limitFilesConfig: { max: 1 },
		multiple: false,
		maxFileSize: 5
	})

	const resizeFile = (file: any) =>
		new Promise(resolve => {
			Resizer.imageFileResizer(
				file,
				256,
				256,
				'PNG',
				100,
				0,
				uri => {
					resolve(uri)
				},
				'base64'
			)
		})

	useEffect(() => {
		const createResizedFile = async () => {
			log.debug('set base64')
			const profilePictureBlob = base64StringToBlob(
				rawProfilePicture[0].content.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(profilePictureBlob)
			setProfilePicBase64(file as string)
			setProfilePicture(file as string)
		}
		if (rawProfilePicture.length > 0) {
			log.debug('Found an image...')
			log.debug(rawProfilePicture[0].content)

			createResizedFile()
		} else {
			// log.debug('no current profile image')
		}
	}, [rawProfilePicture])

	useEffect(() => {
		if (id.hasFetchedIdentity) {
			setDisplayName(id.identity.displayName ?? '')
			setProfilePicture(id.identity.profilePic ?? '')
		}
	}, [id.hasFetchedIdentity, id.identity.displayName, id.identity.profilePic])

	useEffect(() => {
		if (availableIntegrations.length === 0 && inteData) {
			const integrations = identityIntegrationFromApi(inteData)
			setAvailableIntegrations(integrations)
		}
	}, [availableIntegrations.length, inteData])

	const deleteImage = () => {
		setProfilePicture('')
	}

	// Modal visibility
	const [isLinkedAccountModalOpen, setIsLinkedAccountModalOpen] =
		useState(false)

	const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
	const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false)
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
	const openEmojiPicker = () => {
		setIsEmojiPickerOpen(true)
	}

	function timeout(delay: number) {
		return new Promise(res => setTimeout(res, delay))
	}

	const onEmojiClick = async (event: any, emojiObject: any) => {
		setChosenEmoji(emojiObject)
		setIsEmojiPickerOpen(false)
		await timeout(100)
		const element = document.querySelector('#emojiCanvas')
		if (element) {
			log.debug('found emojiCanvas')

			const canvas = await html2canvas(element as HTMLElement)
			const image = canvas.toDataURL('image/png', 1.0)
			log.debug('set base64')
			setProfilePicBase64(image)
			const profilePictureBlob = base64StringToBlob(
				image.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(profilePictureBlob)
			setProfilePicture(file as string)
		} else {
			log.debug('no emojiCanvas found')
		}
	}

	useEffect(() => {
		if (
			router.query.code &&
			availableIntegrations.length > 0 &&
			!Cookies.get('authForDiscordRole')
		) {
			// We have a discord auth code

			// create or update integration
			availableIntegrations.forEach(inte => {
				if (inte.name === 'Discord') {
					setIntegrationCurrentlyEditing(inte)
					setIsDiscordAuthCode(router.query.code as string)
					setIsDiscordModalOpen(true)
				}
			})
		}
	}, [availableIntegrations])

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const saveChanges = async () => {
		setIsSavingChanges(true)

		// Save the change to the db
		try {
			const body = {
				displayName,
				profilePicBase64
			}

			log.debug(`saving changes with body = ${JSON.stringify(body)}`)

			await request
				.post(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}${MeemAPI.v1.CreateOrUpdateMeemId.path()}`
				)
				.set('Authorization', `JWT ${wallet.jwt}`)
				.send(body)
			setIsSavingChanges(false)
		} catch (e) {
			log.debug(e)
			setIsSavingChanges(false)
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'Unable to save changes to your profile. Please get in touch!'
			})
			return
		}
	}

	const openIntegrationModal = (
		integration: AvailableIdentityIntegration
	) => {
		setIntegrationCurrentlyEditing(integration)
		if (integration.name) {
			switch (integration.name) {
				case 'Twitter':
					setIsTwitterModalOpen(true)
					break
				case 'Discord':
					// Discord is a special case due to OAuth
					// eslint-disable-next-line no-case-declarations
					const redirectUri = encodeURI(
						`${window.location.origin}/profile`
					)

					window.location.replace(
						`https://discord.com/api/oauth2/authorize?response_type=code&client_id=967119580088660039&scope=identify&redirect_uri=${redirectUri}`
					)
					break
				case 'Email':
					setIsEmailModalOpen(true)
					break
			}
		}
	}

	return (
		<>
			<Space h={12} />
			<Text className={design.tMediumBold}>Manage Identity</Text>
			<Space h={32} />
			<Text className={design.tMediumBold}>Profile Picture</Text>
			{profilePicture.length === 0 && !isLoadingImage && (
				<div className={design.row}>
					<Button
						leftIcon={<Upload size={14} />}
						className={design.buttonWhite}
						onClick={() => openFileSelector()}
					>
						Upload
					</Button>
					<Space w={'xs'} />
					<Button
						leftIcon={<Text>😈</Text>}
						className={design.buttonWhite}
						onClick={() => openEmojiPicker()}
					>
						Choose emoji
					</Button>
				</div>
			)}
			{isLoadingImage && <Loader color="red" variant="oval" />}
			{!isLoadingImage && profilePicture.length > 0 && (
				<div
					style={{
						marginTop: 24,
						width: 108,
						height: 100,
						position: 'relative'
					}}
				>
					<Image
						style={{ imageRendering: 'pixelated' }}
						src={profilePicture}
						width={200}
						height={200}
						radius={128}
						fit={'cover'}
					/>
					<a onClick={deleteImage}>
						<Image
							style={{
								position: 'absolute',
								top: '0px',
								right: '-100px',
								cursor: 'pointer'
							}}
							src="/delete.png"
							width={24}
							height={24}
						/>
					</a>
				</div>
			)}
			<Space h={profilePicture.length > 0 ? 148 : 32} />
			<Text className={design.tMediumBold}>Display Name</Text>
			<Space h={16} />
			<TextInput
				radius="lg"
				size="lg"
				style={{ maxWidth: 800 }}
				value={displayName}
				onChange={event => setDisplayName(event.currentTarget.value)}
			/>
			{/* Only show verified accounts section if the user has an existing identity */}
			{!id.identity && (
				<>
					<Space h={48} />
					<Divider />
					<Space h={'xl'} />
					<Text className={design.tMediumBold}>Verify Accounts</Text>
					<Space h={16} />

					<Text>
						Choose a Display Name or Profile Picture and save
						changes to add a verified account, such as Twitter,
						Discord or Email.
					</Text>
				</>
			)}
			{id.identity.id && (
				<>
					<Space h={48} />
					<Divider />
					<Space h={'xl'} />
					{id.identity.integrations &&
						id.identity.integrations.length > 0 && (
							<>
								<div className={design.row}>
									<Image
										src="/icon-verified.png"
										width={18}
										height={18}
									/>
									<Space w={8} />

									<Text
										style={{
											color: 'rgba(62, 162, 255, 1)'
										}}
										className={design.tMediumBold}
									>
										Verified
									</Text>
								</div>
								<Space h={16} />
								<Grid>
									{id.identity.integrations.map(
										integration => (
											<Grid.Col
												xs={6}
												sm={4}
												md={4}
												lg={4}
												xl={4}
												key={integration.name}
											>
												<a
													onClick={() => {
														setIntegrationCurrentlyEditing(
															integration
														)
														setIsLinkedAccountModalOpen(
															true
														)
													}}
												>
													<div
														className={
															design.integrationGridItem
														}
													>
														<div
															className={
																design.integrationGridItemHeader
															}
														>
															<Image
																src={`${integration.icon}`}
																width={16}
																height={16}
																fit={'contain'}
															/>
															<Space w={8} />
															{integration
																.metadata
																.twitterUsername && (
																<Text>
																	{`@${integration.metadata.twitterUsername}`}
																</Text>
															)}
															{integration
																.metadata
																.discordUsername && (
																<Text>
																	{`${integration.metadata.discordUsername}`}
																</Text>
															)}
															{integration
																.metadata
																.email && (
																<Text>
																	{`${integration.metadata.email}`}
																</Text>
															)}
														</div>
													</div>
												</a>
											</Grid.Col>
										)
									)}
								</Grid>
								<Space h={'xl'} />
							</>
						)}

					<Text className={design.tMediumBold}>Verify Accounts</Text>
					<Space h={16} />
					{availableIntegrations.length === 0 && (
						<Loader variant="oval" color="red" />
					)}
					{availableIntegrations.length > 0 && (
						<>
							<Grid>
								{availableIntegrations.map(integration => (
									<Grid.Col
										xs={6}
										sm={4}
										md={4}
										lg={4}
										xl={4}
										key={integration.name}
									>
										<a
											onClick={() => {
												openIntegrationModal(
													integration
												)
											}}
										>
											<div
												className={
													design.integrationGridItem
												}
											>
												<div
													className={
														design.integrationGridItemHeader
													}
												>
													<Image
														src={`${integration.icon}`}
														width={16}
														height={16}
														fit={'contain'}
													/>
													<Space w={8} />
													<Text>
														{integration.name}
													</Text>
												</div>
											</div>
										</a>
									</Grid.Col>
								))}
							</Grid>
						</>
					)}
				</>
			)}
			<Space h={'xl'} />
			<Button
				className={design.buttonBlack}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={'xl'} />
			<ProfileLinkTwitterModal
				integration={integrationCurrentlyEditing}
				isOpened={isTwitterModalOpen}
				onModalClosed={() => {
					setIsTwitterModalOpen(false)
				}}
			/>
			<ProfileLinkEmailModal
				integrationId={integrationCurrentlyEditing?.id}
				identity={id.identity}
				isOpened={isEmailModalOpen}
				onModalClosed={() => {
					setIsEmailModalOpen(false)
				}}
			/>
			<ProfileLinkDiscordModal
				integrationId={integrationCurrentlyEditing?.id}
				discordAuthCode={discordAuthCode}
				isOpened={isDiscordModalOpen}
				onModalClosed={() => {
					setIsDiscordModalOpen(false)
				}}
			/>
			<ManageLinkedAccountModal
				integration={integrationCurrentlyEditing}
				isOpened={isLinkedAccountModalOpen}
				onModalClosed={() => {
					setIsLinkedAccountModalOpen(false)
				}}
			/>
			<div id="emojiCanvas" className={design.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>
			<div className={design.emojiCanvasCover} />
			<Modal
				withCloseButton={false}
				padding={8}
				overlayBlur={8}
				size={296}
				opened={isEmojiPickerOpen}
				onClose={() => {
					setIsEmojiPickerOpen(false)
				}}
			>
				<EmojiPicker onEmojiClick={onEmojiClick} />
			</Modal>
		</>
	)
}
