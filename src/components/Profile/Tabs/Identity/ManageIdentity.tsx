import { useQuery } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'
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
	Grid,
	useMantineColorScheme
} from '@mantine/core'
import {
	useMeemUser,
	useMeemApollo,
	useSDK,
	IDENTITY_PROVIDERS_QUERY
} from '@meemproject/react'
import type { UserIdentity } from '@meemproject/react'
import { normalizeImageUrl } from '@meemproject/sdk'
import { base64StringToBlob } from 'blob-util'
import type { EmojiClickData } from 'emoji-picker-react'
import html2canvas from 'html2canvas'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { GetIdentityProvidersQuery } from '../../../../../generated/graphql'
import { showErrorNotification } from '../../../../utils/notifications'
import { DeveloperPortalButton } from '../../../Developer/DeveloperPortalButton'
import { colorVerified, useMeemTheme } from '../../../Styles/MeemTheme'
import { ManageLinkedAccountModal } from './ManageLinkedAccountModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export const ManageIdentityComponent: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()

	const { loginWithRedirect } = useAuth0()
	const { sdk } = useSDK()
	const { user: me } = useMeemUser()
	const { anonClient } = useMeemApollo()

	// Mutable identity data
	const [displayName, setDisplayName] = useState('')
	const [profilePicture, setProfilePicture] = useState('')
	const [profilePicBase64, setProfilePicBase64] = useState<string>('')
	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

	const [userIdentityCurrentlyEditing, setUserIdentityCurrentlyEditing] =
		useState<UserIdentity>()

	// Fetch a list of available extensions.
	const { data: inteData, loading: isLoadingAvailableExtensions } =
		useQuery<GetIdentityProvidersQuery>(IDENTITY_PROVIDERS_QUERY, {
			client: anonClient
		})

	// Agreement logo
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
				512,
				512,
				'JPEG',
				95,
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
		if (me?.id) {
			setDisplayName(me.displayName ?? '')
			setProfilePicture(me.profilePicUrl ?? '')
		}
	}, [me])

	const deleteImage = () => {
		setProfilePicture('')
	}

	// Modal visibility
	const [isLinkedAccountModalOpen, setIsLinkedAccountModalOpen] =
		useState(false)

	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
	const openEmojiPicker = () => {
		setIsEmojiPickerOpen(true)
	}

	function timeout(delay: number) {
		return new Promise(res => setTimeout(res, delay))
	}

	const onEmojiClick = async (emojiObject: EmojiClickData) => {
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

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const { colorScheme } = useMantineColorScheme()

	const isDarkTheme = colorScheme === 'dark'

	const saveChanges = async () => {
		setIsSavingChanges(true)

		// Save the change to the db
		try {
			await sdk.id.updateUser({
				displayName,
				profilePicBase64
			})

			setIsSavingChanges(false)
		} catch (e) {
			log.debug(e)
			setIsSavingChanges(false)
			showErrorNotification(
				'Oops!',
				'Unable to save changes to your profile. Please get in touch!'
			)
			return
		}
	}

	const filteredAvilableExtensions =
		inteData?.IdentityProviders.filter(ai => {
			const connectedExtension = me?.UserIdentities?.find(
				i => i.IdentityProviderId === ai.id
			)

			if (connectedExtension) {
				return false
			}

			return true
		}) ?? []

	return (
		<>
			<Space h={12} />
			<Text className={meemTheme.tLargeBold}>Manage Identity</Text>
			<Space h={32} />
			<Text className={meemTheme.tMediumBold}>Profile Picture</Text>
			{profilePicture.length === 0 && !isLoadingImage && (
				<div>
					<Space h={16} />
					<div className={meemTheme.row}>
						<Button
							leftIcon={<Upload size={14} />}
							className={meemTheme.buttonWhite}
							onClick={() => openFileSelector()}
						>
							Upload
						</Button>
						<Space w={'xs'} />
						<Button
							leftIcon={<Text>😈</Text>}
							className={meemTheme.buttonWhite}
							onClick={() => openEmojiPicker()}
						>
							Choose emoji
						</Button>
					</div>
				</div>
			)}
			{isLoadingImage && <Loader color="cyan" variant="oval" />}
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
						src={normalizeImageUrl(profilePicture)}
						width={200}
						height={200}
						radius={24}
						fit={'cover'}
					/>
					<a onClick={deleteImage}>
						<Image
							style={{
								position: 'absolute',
								top: '10px',
								right: '-85px',
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
			<Text className={meemTheme.tMediumBold}>Display Name</Text>
			<Space h={16} />
			<TextInput
				radius="lg"
				size="lg"
				style={{ maxWidth: 800 }}
				value={displayName}
				onChange={event => setDisplayName(event.currentTarget.value)}
			/>
			{/* Only show verified accounts section if the user has an existing identity */}
			{!me?.id && (
				<>
					<Space h={48} />
					<Divider />
					<Space h={'xl'} />
					<Text className={meemTheme.tMediumBold}>
						Verify Accounts
					</Text>
					<Space h={16} />

					<Text>
						Choose a Display Name or Profile Picture and save
						changes to add a verified account, such as Twitter,
						Discord, Google or Email.
					</Text>
				</>
			)}
			{me?.id && (
				<>
					<Space h={48} />
					<Divider />
					<Space h={'xl'} />
					{me?.UserIdentities && me.UserIdentities.length > 0 && (
						<>
							<div className={meemTheme.centeredRow}>
								<Image
									src="/icon-verified.png"
									width={18}
									height={18}
								/>
								<Space w={8} />

								<Text
									style={{
										color: colorVerified
									}}
									className={meemTheme.tMediumBold}
								>
									Verified
								</Text>
							</div>
							<Space h={16} />
							<Grid style={{ maxWidth: 800 }}>
								{me.UserIdentities.map(userIdentity => (
									<Grid.Col
										xs={6}
										sm={4}
										md={4}
										lg={4}
										xl={4}
										key={`verified-extension-${userIdentity.IdentityProvider?.name}`}
									>
										<a
											onClick={() => {
												setUserIdentityCurrentlyEditing(
													userIdentity
												)
												setIsLinkedAccountModalOpen(
													true
												)
											}}
										>
											<div className={meemTheme.gridItem}>
												<div
													className={
														meemTheme.extensionGridItemHeader
													}
												>
													<Image
														src={`${
															isDarkTheme
																? `${(
																		userIdentity
																			.IdentityProvider
																			?.icon ??
																		''
																  ).replace(
																		'.png',
																		'-white.png'
																  )}`
																: userIdentity
																		.IdentityProvider
																		?.icon
														}`}
														width={16}
														height={16}
														fit={'contain'}
													/>
													<Space w={8} />
													<Text>
														{userIdentity?.metadata
															.username
															? `@${userIdentity?.metadata.username}`
															: userIdentity
																	.IdentityProvider
																	?.name}
													</Text>
												</div>
											</div>
										</a>
									</Grid.Col>
								))}
							</Grid>
							<Space h={'xl'} />
						</>
					)}

					<Text className={meemTheme.tMediumBold}>
						Verify Accounts
					</Text>

					<Space h={16} />
					{isLoadingAvailableExtensions && (
						<Loader variant="oval" color="cyan" />
					)}
					{filteredAvilableExtensions.length > 0 && (
						<>
							<Grid style={{ maxWidth: 800 }}>
								{filteredAvilableExtensions.map(extension => (
									<Grid.Col
										xs={6}
										sm={4}
										md={4}
										lg={4}
										xl={4}
										key={extension.name}
									>
										<a
											onClick={() => {
												loginWithRedirect({
													connection:
														extension.connectionName,
													redirectUri:
														window.location.href
												})
											}}
										>
											<div className={meemTheme.gridItem}>
												<div
													className={
														meemTheme.extensionGridItemHeader
													}
												>
													<Image
														src={`${
															isDarkTheme
																? `${(
																		extension.icon ??
																		''
																  ).replace(
																		'.png',
																		'-white.png'
																  )}`
																: extension.icon
														}`}
														width={16}
														height={16}
														fit={'contain'}
													/>
													<Space w={8} />
													<Text>
														{extension.name}
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
			<Space h={24} />
			<DeveloperPortalButton
				portalButtonText={'Add more accounts'}
				modalTitle={'Help us add more verified accounts!'}
				modalText={
					'We use Auth0 to manage 3rd party account verification. Let us know if you would like to add support for more accounts.'
				}
				devDocsLink={`https://auth0.com/docs/authenticate/identity-providers`}
			/>
			<Space h={'xl'} />
			<Button
				className={meemTheme.buttonBlack}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={'xl'} />

			<ManageLinkedAccountModal
				userIdentity={userIdentityCurrentlyEditing}
				isOpened={isLinkedAccountModalOpen}
				onModalClosed={() => {
					setIsLinkedAccountModalOpen(false)
				}}
			/>
			<div id="emojiCanvas" className={meemTheme.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>
			<div className={meemTheme.emojiCanvasCover} />
			<Modal
				withCloseButton={false}
				padding={8}
				overlayBlur={8}
				size={366}
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
