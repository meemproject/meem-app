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
	Grid
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMeemUser } from '@meemproject/react'
import type { UserIdentity } from '@meemproject/react'
import { updateUser } from '@meemproject/sdk'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { GetIdentityExtensionsQuery } from '../../../../../generated/graphql'
import { IDENTITY_INTEGRATIONS_QUERY } from '../../../../graphql/id'
import { useCustomApollo } from '../../../../providers/ApolloProvider'
import { colorVerified, useClubsTheme } from '../../../Styles/ClubsTheme'
import { ManageLinkedAccountModal } from './ManageLinkedAccountModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export const ManageIdentityComponent: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()

	const { loginWithRedirect } = useAuth0()
	const { user: me } = useMeemUser()
	const { anonClient } = useCustomApollo()

	// Mutable identity data
	const [displayName, setDisplayName] = useState('')
	const [profilePicture, setProfilePicture] = useState('')
	const [profilePicBase64, setProfilePicBase64] = useState<string>('')
	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

	const [userIdentityCurrentlyEditing, setUserIdentityCurrentlyEditing] =
		useState<UserIdentity>()

	// Fetch a list of available extensions.
	const { data: inteData, loading: isLoadingAvailableExtensions } =
		useQuery<GetIdentityExtensionsQuery>(IDENTITY_INTEGRATIONS_QUERY, {
			client: anonClient
		})

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

	// useEffect(() => {
	// 	if (
	// 		router.query.code &&
	// 		availableExtensions.length > 0 &&
	// 		!Cookies.get('authForDiscordRole')
	// 	) {
	// 		// We have a discord auth code

	// 		// create or update extension
	// 		// availableExtensions.forEach(inte => {
	// 		// 	if (inte.name === 'Discord') {
	// 		// 		setExtensionCurrentlyEditing(inte)
	// 		// 		setIsDiscordAuthCode(router.query.code as string)
	// 		// 		setIsDiscordModalOpen(true)
	// 		// 	}
	// 		// })
	// 	}
	// }, [availableExtensions])

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const saveChanges = async () => {
		setIsSavingChanges(true)

		// Save the change to the db
		try {
			// log.debug(`saving changes with body = ${JSON.stringify(body)}`)

			await updateUser({
				displayName,
				profilePicBase64
			})

			// await request
			// 	.post(
			// 		`${
			// 			process.env.NEXT_PUBLIC_API_URL
			// 		}${MeemAPI.v1.CreateOrUpdateMeemId.path()}`
			// 	)
			// 	.set('Authorization', `JWT ${wallet.jwt}`)
			// 	.send(body)
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

	const filteredAvilableExtensions =
		inteData?.IdentityExtensions.filter(ai => {
			const connectedExtension = me?.UserIdentities?.find(
				i => i.IdentityExtensionId === ai.id
			)

			if (connectedExtension) {
				return false
			}

			return true
		}) ?? []

	return (
		<>
			<Space h={12} />
			<Text className={clubsTheme.tLargeBold}>Manage Identity</Text>
			<Space h={32} />
			<Text className={clubsTheme.tMediumBold}>Profile Picture</Text>
			{profilePicture.length === 0 && !isLoadingImage && (
				<div className={clubsTheme.row}>
					<Button
						leftIcon={<Upload size={14} />}
						className={clubsTheme.buttonWhite}
						onClick={() => openFileSelector()}
					>
						Upload
					</Button>
					<Space w={'xs'} />
					<Button
						leftIcon={<Text>😈</Text>}
						className={clubsTheme.buttonWhite}
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
			<Text className={clubsTheme.tMediumBold}>Display Name</Text>
			<Space h={16} />
			<TextInput
				radius="lg"
				size="lg"
				style={{ maxWidth: 800 }}
				value={displayName}
				onChange={event => setDisplayName(event.currentTarget.value)}
			/>
			{/* Only show verified accounts section if the user has an existing identity */}
			{me?.id && (
				<>
					<Space h={48} />
					<Divider />
					<Space h={'xl'} />
					<Text className={clubsTheme.tMediumBold}>
						Verify Accounts
					</Text>
					<Space h={16} />

					<Text>
						Choose a Display Name or Profile Picture and save
						changes to add a verified account, such as Twitter,
						Discord or Email.
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
							<div className={clubsTheme.centeredRow}>
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
									className={clubsTheme.tMediumBold}
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
										key={`verified-extension-${userIdentity.IdentityExtension?.name}`}
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
											<div
												className={clubsTheme.gridItem}
											>
												<div
													className={
														clubsTheme.extensionGridItemHeader
													}
												>
													<Image
														src={`${userIdentity.IdentityExtension?.icon}`}
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
																	.IdentityExtension
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

					<Text className={clubsTheme.tMediumBold}>
						Verify Accounts
					</Text>
					<Space h={16} />
					{isLoadingAvailableExtensions && (
						<Loader variant="oval" color="red" />
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
											<div
												className={clubsTheme.gridItem}
											>
												<div
													className={
														clubsTheme.extensionGridItemHeader
													}
												>
													<Image
														src={`${extension.icon}`}
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
			<Space h={'xl'} />
			<Button
				className={clubsTheme.buttonBlack}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={'xl'} />
			{/* <ProfileLinkTwitterModal
				extension={extensionCurrentlyEditing}
				isOpened={isTwitterModalOpen}
				onModalClosed={() => {
					setIsTwitterModalOpen(false)
				}}
			/>
			<ProfileLinkEmailModal
				extensionId={extensionCurrentlyEditing?.id}
				identity={id.identity}
				isOpened={isEmailModalOpen}
				onModalClosed={() => {
					setIsEmailModalOpen(false)
				}}
			/>
			<ProfileLinkDiscordModal
				extensionId={extensionCurrentlyEditing?.id}
				discordAuthCode={discordAuthCode}
				isOpened={isDiscordModalOpen}
				onModalClosed={() => {
					setIsDiscordModalOpen(false)
				}}
			/> */}
			<ManageLinkedAccountModal
				userIdentity={userIdentityCurrentlyEditing}
				isOpened={isLinkedAccountModalOpen}
				onModalClosed={() => {
					setIsLinkedAccountModalOpen(false)
				}}
			/>
			<div id="emojiCanvas" className={clubsTheme.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>
			<div className={clubsTheme.emojiCanvasCover} />
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
