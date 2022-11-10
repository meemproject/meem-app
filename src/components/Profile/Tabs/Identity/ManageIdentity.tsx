import { useQuery } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'
import log from '@kengoldfarb/log'
import {
	createStyles,
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
import IdentityContext from '../../IdentityProvider'
import { ManageLinkedAccountModal } from './ManageLinkedAccountModal'
import { ProfileLinkDiscordModal } from './ProfileLinkDiscordModal'
import { ProfileLinkEmailModal } from './ProfileLinkEmailModal'
import { ProfileLinkTwitterModal } from './ProfileLinkTwitterModal'

const useStyles = createStyles(theme => ({
	row: { display: 'flex', alignItems: 'center' },
	header: {
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 8,
			paddingTop: 16
		}
	},
	headerLeftItems: {
		display: 'flex',
		alignItems: 'center'
	},
	headerArrow: {
		marginRight: 32,
		marginTop: 6,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 16,
			marginLeft: 16
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 20
		}
	},
	buttonSaveChanges: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		marginRight: 32
	},
	buttonUpload: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	createClubLink: {
		marginTop: 24,
		a: {
			color: 'rgba(255, 102, 81, 1)',
			textDecoration: 'underline',
			fontWeight: 'bold'
		}
	},
	profileItem: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 24,
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	profileIntegrationsHeader: {
		fontSize: 16,
		color: 'rgba(0, 0, 0, 0.5)',
		fontWeight: 600,
		marginTop: 32,
		marginBottom: 12,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			fontWeight: 400
		}
	},
	profileIntegrationItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		marginBottom: 12,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 24
	},
	enabledClubIntegrationItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		marginBottom: 12,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	profilePictureImage: {
		imageRendering: 'pixelated'
	},
	profilePictureImageContainer: {
		marginTop: 24,
		width: 108,
		height: 100,
		position: 'relative'
	},
	profilePictureDeleteButton: {
		position: 'absolute',
		top: '0px',
		right: '-100px',
		cursor: 'pointer'
	},
	uploadOptions: { display: 'flex' },
	emojiCanvas: {
		position: 'absolute',
		top: 0,
		left: 0,
		marginTop: -12,
		marginBottom: -12,
		lineHeight: 1,
		fontSize: 160,
		zIndex: -1000
	},
	emojiCanvasCover: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 256,
		height: 256,
		marginTop: -12,
		marginBottom: -12,
		backgroundColor: 'white',
		zIndex: -1
	},
	intItemHeader: {
		display: 'flex',
		alignItems: 'center'
	},
	profileNameEllipsis: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},
	verifiedSectionTitle: {
		fontSize: 18,
		fontWeight: 600,
		color: 'rgba(62, 162, 255, 1)',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	identitySectionTitle: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginBottom: 8
		}
	},
	myClubsPrompt: { fontSize: 18, marginBottom: 16 },
	profileHeaderText: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	},
	textField: {
		maxWidth: 800
	}
}))

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export const ManageIdentityComponent: React.FC = () => {
	const { classes } = useStyles()

	const { loginWithRedirect, loginWithPopup } = useAuth0()

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

	const filteredAvilableIntegrations = availableIntegrations.filter(ai => {
		const connectedIntegration = id.identity.integrations?.find(
			i => i.id === ai.id
		)

		if (connectedIntegration) {
			return false
		}

		return true
	})

	console.log({ filteredAvilableIntegrations, availableIntegrations })

	return (
		<>
			<Space h={12} />
			<Text className={classes.profileHeaderText}>
				Manage Identity
			</Text>{' '}
			<Text className={classes.identitySectionTitle}>
				Profile Picture
			</Text>
			{profilePicture.length === 0 && !isLoadingImage && (
				<div className={classes.uploadOptions}>
					<Button
						leftIcon={<Upload size={14} />}
						className={classes.buttonUpload}
						onClick={() => openFileSelector()}
					>
						Upload
					</Button>
					<Space w={'xs'} />
					<Button
						leftIcon={<Text>😈</Text>}
						className={classes.buttonUpload}
						onClick={() => openEmojiPicker()}
					>
						Choose emoji
					</Button>
				</div>
			)}
			{isLoadingImage && <Loader color="red" variant="oval" />}
			{!isLoadingImage && profilePicture.length > 0 && (
				<div className={classes.profilePictureImageContainer}>
					<Image
						className={classes.profilePictureImage}
						src={profilePicture}
						width={200}
						height={200}
						radius={128}
						fit={'cover'}
					/>
					<a onClick={deleteImage}>
						<Image
							className={classes.profilePictureDeleteButton}
							src="/delete.png"
							width={24}
							height={24}
						/>
					</a>
				</div>
			)}
			<Space h={profilePicture.length > 0 ? 148 : 32} />
			<Text className={classes.identitySectionTitle}>Display Name</Text>
			<TextInput
				radius="lg"
				size="lg"
				className={classes.textField}
				value={displayName}
				onChange={event => setDisplayName(event.currentTarget.value)}
			/>
			{/* Only show verified accounts section if the user has an existing identity */}
			{!id.identity && (
				<>
					<Space h={48} />
					<Divider />
					<Space h={'xl'} />
					<Text className={classes.identitySectionTitle}>
						Verify Accounts
					</Text>

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
								<div className={classes.row}>
									<Image
										src="/icon-verified.png"
										width={18}
										height={18}
									/>
									<Space w={8} />

									<Text
										className={classes.verifiedSectionTitle}
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
												key={`verified-integration-${integration.name}`}
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
															classes.profileIntegrationItem
														}
													>
														<div
															className={
																classes.intItemHeader
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
																{integration
																	.metadata
																	.username
																	? `@${integration.metadata.username}`
																	: integration.name}
															</Text>
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

					<Text className={classes.identitySectionTitle}>
						Verify Accounts
					</Text>
					{availableIntegrations.length === 0 && (
						<Loader variant="oval" color="red" />
					)}
					{filteredAvilableIntegrations.length > 0 && (
						<>
							<Grid>
								{filteredAvilableIntegrations.map(
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
													// loginWithPopup({
													loginWithRedirect({
														display: 'popup',
														screen_hint: 'signup',
														redirectUri:
															window.location.toString(),
														connection:
															integration.connectionName &&
															integration
																.connectionName
																.length > 0
																? integration.connectionName
																: undefined
													})
												}}
											>
												<div
													className={
														classes.profileIntegrationItem
													}
												>
													<div
														className={
															classes.intItemHeader
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
									)
								)}
							</Grid>
						</>
					)}
				</>
			)}
			<Space h={'xl'} />
			<Button
				className={classes.buttonSaveChanges}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={'xl'} />
			{/* <ProfileLinkTwitterModal
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
			/> */}
			<ManageLinkedAccountModal
				integration={integrationCurrentlyEditing}
				isOpened={isLinkedAccountModalOpen}
				onModalClosed={() => {
					setIsLinkedAccountModalOpen(false)
				}}
			/>
			<div id="emojiCanvas" className={classes.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>
			<div className={classes.emojiCanvasCover} />
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
