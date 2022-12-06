/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Image,
	Space,
	TextInput,
	Grid,
	Modal,
	Divider,
	Loader,
	Button,
	Switch,
	Alert,
	useMantineColorScheme
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { QuestionMarkCircle } from 'iconoir-react'
import React, { useEffect, useState } from 'react'
import { ExternalLink, Settings } from 'tabler-icons-react'
import { GetExtensionsQuery } from '../../../../generated/graphql'
import { GET_INTEGRATIONS } from '../../../graphql/clubs'
import { Club, Extension } from '../../../model/club/club'
import { colorGrey, useClubsTheme } from '../../Styles/ClubsTheme'
import { ClubAdminGatherTownModal } from '../ExtensionModals/ClubAdminGatherTownModal'
import { ClubAdminParagraphExtensionModal } from '../ExtensionModals/ClubAdminParagraphIntegrationModal'
import { ClubAdminVerifyTwitterModal } from '../ExtensionModals/ClubAdminVerifyTwitterModal'
interface IProps {
	club: Club
}

export const CAClubApps: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()
	//const wallet = useWallet()

	// Fetch a list of available extensions.
	const {
		loading,
		error,
		data: inteData
	} = useQuery<GetExtensionsQuery>(GET_INTEGRATIONS)

	// Lists of extensions
	const [existingExtensions, setExistingExtensions] = useState<Extension[]>(
		[]
	)
	const [availableExtensions, setAvailableExtensions] = useState<Extension[]>(
		[]
	)
	const [allExtensions, setAllExtensions] = useState<Extension[]>([])
	const [searchedExtensions, setSearchedExtensions] = useState<Extension[]>(
		[]
	)

	// Current search term
	const [currentSearchTerm, setCurrentSearchTerm] = useState('')

	const [hasSetupEnabledExtensions, setHasSetUpExtensions] = useState(false)

	// Used to populate existing extensions when changes are made
	const [extensionBeingEdited, setExtensionBeingEdited] =
		useState<Extension>()

	// Properties that can be edited by the user
	const [currentExtensionUrl, setCurrentExtensionUrl] = useState('')
	const [isCurrentExtensionEnabled, setCurrentExtensionEnabled] =
		useState(true)
	const [isCurrentExtensionPublic, setCurrentExtensionPublic] =
		useState(false)

	// Other properties of the extension being currently edited
	const [currentExtensionId, setCurrentExtensionId] = useState('')

	// Properties tied to simple, url-based extensions
	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isExtensionModalOpened, setExtensionModalOpened] = useState(false)

	// Modals for deeper extensions
	const [isVerifyTwitterModalOpened, setVerifyTwitterModalOpened] =
		useState(false)
	const [isParagraphModalOpened, setParagraphModalOpened] = useState(false)
	const [isGatherTownModalOpened, setGatherTownModalOpened] = useState(false)

	const filterExtensions = (available: Extension[]) => {
		const search = currentSearchTerm
		const filteredExtensions: Extension[] = []

		if (currentSearchTerm.length > 0) {
			available.forEach(inte => {
				if (inte.name.toLowerCase().includes(search)) {
					filteredExtensions.push(inte)
				}
			})
			setSearchedExtensions(filteredExtensions)
		} else {
			setSearchedExtensions(available)
		}
	}

	// Update the extension locally so that changes are reflected immediately.
	const updateExtensionLocally = (extraData: any) => {
		const updatedInte = extensionBeingEdited

		if (updatedInte && extensionBeingEdited) {
			updatedInte.url = currentExtensionUrl
			updatedInte.isEnabled = isCurrentExtensionEnabled
			updatedInte.isPublic = isCurrentExtensionPublic

			// If there was extra extension metadata, update it on the extension here.
			if (extraData) {
				updatedInte.isEnabled =
					extraData.isEnabled ?? isCurrentExtensionEnabled
				updatedInte.isVerified = extraData.isVerified ?? false
				updatedInte.isPublic =
					extraData.isPublic ?? isCurrentExtensionPublic

				// Twitter
				updatedInte.verifiedTwitterUser =
					extraData.twitterUsername ?? ''

				// Paragraph
				updatedInte.publicationSlug = extraData.publicationSlug ?? ''
				if (extraData.publicationSlug) {
					updatedInte.url = `https://paragraph.xyz/@${extraData.publicationSlug}`
				}
				updatedInte.publicationName = extraData.publicatioName ?? ''

				// Gather Town
				if (extraData.spaceName) {
					updatedInte.url = extraData.spaceName
					updatedInte.isEnabled = true
					updatedInte.isPublic = extraData.isPublic
				}
				updatedInte.gatherTownSpacePw =
					extraData.gatherTownSpacePw ?? ''
			}
			setExtensionBeingEdited(updatedInte)

			// Check to see if this extension is an existing extension

			if (!extensionBeingEdited.isExistingExtension) {
				// If not an existing extension, push this into existing extensions
				const newExisting = existingExtensions
				extensionBeingEdited.isExistingExtension = true
				newExisting.push(extensionBeingEdited)
				setExistingExtensions(newExisting)

				availableExtensions.forEach(inte => {
					if (inte.extensionId === currentExtensionId) {
						const newAvailable = availableExtensions.filter(
							integ => integ.extensionId !== currentExtensionId
						)
						setAvailableExtensions(newAvailable)
						filterExtensions(newAvailable)
						return
					}
				})
			} else {
				// If already enabled, modify the existing extension
				const newExtensions = [...existingExtensions]
				// TODO: Is there a better way of updating an array item in typescript than a C loop?
				for (let i = 0; i < newExtensions.length; i++) {
					if (newExtensions[i].extensionId === currentExtensionId) {
						newExtensions[i] = extensionBeingEdited
						break
					}
				}

				setExistingExtensions(newExtensions)
			}
		}
	}

	// Used by simple extensions, i.e. ones that just require a URL.
	const saveSimpleExtensionChanges = async () => {
		if (extensionBeingEdited) {
			// Validate URL

			if (
				extensionBeingEdited.name === 'Phone Number' ||
				extensionBeingEdited.name === 'Email Address'
			) {
				// Ignore / skip validation (we may want to add custom validation here in future)
			} else {
				try {
					new URL(currentExtensionUrl)
				} catch (_) {
					showNotification({
						radius: 'lg',
						title: 'Oops!',
						message: 'Please enter a valid URL for this extension.'
					})
					return
				}
			}

			// Mark as saving changes
			setIsSavingChanges(true)

			log.debug(`public: ${isCurrentExtensionPublic}`)

			// Save the change to the db
			// try {
			// 	const { body } = await request
			// 		.post(
			// 			`${
			// 				process.env.NEXT_PUBLIC_API_URL
			// 			}${MeemAPI.v1.CreateOrUpdateAgreementExtension.path({
			// 				agreementId: club.id ?? '',
			// 				extensionId: currentExtensionId
			// 			})}`
			// 		)
			// 		.set('Authorization', `JWT ${wallet.jwt}`)
			// 		.send({
			// 			isEnabled: isCurrentExtensionEnabled,
			// 			isPublic: isCurrentExtensionPublic,
			// 			metadata: {
			// 				externalUrl: currentExtensionUrl
			// 			}
			// 		})
			// 	log.debug(body)

			// 	updateExtensionLocally(false)
			// } catch (e) {
			// 	log.debug(e)
			// 	setIsSavingChanges(false)
			// 	showNotification({
			// 		radius: 'lg',
			// 		title: 'Oops!',
			// 		message:
			// 			'Unable to save this extension. Please get in touch!'
			// 	})
			// 	return
			// }
		}
		setIsSavingChanges(false)
		setExtensionModalOpened(false)
	}

	// Setup available extensions
	useEffect(() => {
		if (!loading && inteData && availableExtensions.length === 0) {
			// Set up available extensions
			const available: Extension[] = []
			inteData.Extensions.forEach(inte => {
				const extension: Extension = {
					isExistingExtension: false,
					extensionId: inte.id,
					name: inte.name,
					description: inte.description,
					guideUrl: inte.guideUrl,
					icon: inte.icon
				}
				available.push(extension)
			})
			setAllExtensions(available)
		}

		if (
			allExtensions.length > 0 &&
			availableExtensions.length === 0 &&
			hasSetupEnabledExtensions
		) {
			// Filter out available extensions based on enabled...
			const finalExtensions: Extension[] = []

			allExtensions.forEach(inte => {
				let doesAlreadyExist = false
				existingExtensions.forEach(existing => {
					if (inte.name === existing.name) {
						doesAlreadyExist = true
						return
					}
				})
				if (!doesAlreadyExist) {
					finalExtensions.push(inte)
				}
			})
			setSearchedExtensions(finalExtensions)
			setAvailableExtensions(finalExtensions)
		}
	}, [
		availableExtensions,
		allExtensions,
		hasSetupEnabledExtensions,
		inteData,
		loading,
		existingExtensions
	])

	// Setup enabled extensions
	useEffect(() => {
		if (!hasSetupEnabledExtensions) {
			// Set up enabled extensions
			setExistingExtensions(club.allExtensions ?? [])
			setHasSetUpExtensions(true)
		}
	}, [club.allExtensions, hasSetupEnabledExtensions])

	const editExtension = (extension: Extension) => {
		log.debug(extension.name)

		setExtensionBeingEdited(extension)
		setCurrentExtensionUrl(extension.url ?? '')
		setCurrentExtensionEnabled(extension.isEnabled ?? true)
		setCurrentExtensionId(extension.extensionId ?? '')
		setCurrentExtensionPublic(
			extension.isPublic ?? extension.name === 'Discord'
		)

		if (extension.name === 'Twitter') {
			// Open twitter extension modal
			setVerifyTwitterModalOpened(true)
		} else if (extension.name === 'Paragraph') {
			// Open paragraph extension modal
			setParagraphModalOpened(true)
		} else if (extension.name === 'Gather Town') {
			// Open paragraph extension modal
			setGatherTownModalOpened(true)
		} else {
			setExtensionModalOpened(true)
		}
	}

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={clubsTheme.tLargeBold}>Club Apps</Text>
				<Space h={32} />

				{existingExtensions && existingExtensions.length > 0 && (
					<>
						<Text
							className={clubsTheme.tMediumBold}
						>{`Added apps (${existingExtensions?.length})`}</Text>
						<Space h={12} />
						<Grid>
							{existingExtensions.map(extension => (
								<Grid.Col
									xs={8}
									sm={8}
									md={4}
									lg={4}
									xl={4}
									key={extension.name}
								>
									<div
										className={
											clubsTheme.extensionGridItemEnabled
										}
									>
										<div
											className={
												clubsTheme.extensionGridItemEnabledHeaderBackground
											}
										/>
										<div
											className={
												clubsTheme.extensionGridItemHeader
											}
										>
											<Image
												src={`/${
													isDarkTheme
														? `${extension.icon?.replace(
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
											<Text>{`${extension.name}`}</Text>
											{extension.isVerified && (
												<>
													<Space w={12} />
													<Image
														src="/icon-verified.png"
														width={16}
														height={16}
													/>
													<Space w={4} />
													<Text
														color={'#3EA2FF'}
														size={'sm'}
													>
														Verified
													</Text>
												</>
											)}
										</div>
										<div
											style={{
												width: '100%'
											}}
										>
											<Space h={16} />
											<Divider color={colorGrey} />
										</div>
										<div
											className={clubsTheme.row}
											style={{
												height: 46
											}}
										>
											<a
												onClick={() => {
													if (
														extension.name ===
														'Phone Number'
													) {
														window.open(
															`tel:${extension.url}`
														)
													} else if (
														extension.name ===
														'Email Address'
													) {
														window.open(
															`mailto:${extension.url}`
														)
													} else {
														window.open(
															extension.url
														)
													}
												}}
											>
												<div
													className={clubsTheme.row}
													style={{
														cursor: 'pointer',
														padding: 12
													}}
												>
													<ExternalLink size={20} />
													<Space w={4} />
													<Text
														className={
															clubsTheme.tExtraSmall
														}
													>
														Launch App
													</Text>
												</div>
											</a>
											<Space w={4} />
											<Divider orientation="vertical" />
											<Space w={4} />

											<a
												onClick={() => {
													editExtension(extension)
												}}
											>
												<div
													className={clubsTheme.row}
													style={{
														cursor: 'pointer',
														padding: 12
													}}
												>
													<Settings size={20} />
													<Space w={4} />
													<Text
														className={
															clubsTheme.tExtraSmall
														}
													>
														Settings
													</Text>
												</div>
											</a>
										</div>
									</div>
								</Grid.Col>
							))}
						</Grid>
						<Space h={32} />
					</>
				)}
				{!loading && inteData && (
					<>
						<Text
							className={clubsTheme.tMediumBold}
						>{`Available apps (${searchedExtensions?.length})`}</Text>
						<Space h={8} />

						<TextInput
							radius={16}
							size={'md'}
							onChange={event => {
								if (event.target.value) {
									setCurrentSearchTerm(event.target.value)
									filterExtensions(availableExtensions)
								} else {
									setSearchedExtensions(availableExtensions)
								}
							}}
							placeholder="Search Apps"
						/>
						<Space h={24} />
						<Grid>
							{searchedExtensions.map(extension => (
								<Grid.Col
									xs={8}
									sm={8}
									md={4}
									lg={4}
									xl={4}
									key={extension.name}
								>
									<a
										onClick={() => {
											editExtension(extension)
										}}
									>
										<div
											className={
												clubsTheme.extensionGridItem
											}
										>
											<div
												className={
													clubsTheme.extensionGridItemHeader
												}
											>
												<Image
													src={`/${
														isDarkTheme
															? `${extension.icon?.replace(
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
												<Text>{`${extension.name}`}</Text>
											</div>
											<Text
												className={
													clubsTheme.tExtraSmall
												}
												style={{ marginTop: 6 }}
											>
												{extension.description}
											</Text>
										</div>
									</a>
								</Grid.Col>
							))}
						</Grid>
					</>
				)}
				{loading && !inteData && (
					<>
						<Loader color="red" variant="oval" />
					</>
				)}
				{!loading && error && (
					<>
						<Text>Unable to load available apps :(</Text>
					</>
				)}

				<Space h="xl" />
				<ClubAdminVerifyTwitterModal
					club={club}
					extension={extensionBeingEdited}
					isOpened={isVerifyTwitterModalOpened}
					onSuccessfulVerification={twitterUsername => {
						updateExtensionLocally({
							isVerified: true,
							twitterUsername
						})
					}}
					onModalClosed={() => {
						setVerifyTwitterModalOpened(false)
					}}
				/>
				<ClubAdminParagraphExtensionModal
					club={club}
					extension={extensionBeingEdited}
					isOpened={isParagraphModalOpened}
					onComplete={(slug, name, isEnabled) => {
						updateExtensionLocally({
							publicationSlug: slug,
							publicationName: name,
							isEnabled
						})
					}}
					onModalClosed={() => {
						setParagraphModalOpened(false)
					}}
				/>
				<ClubAdminGatherTownModal
					club={club}
					extension={extensionBeingEdited}
					isOpened={isGatherTownModalOpened}
					onSpaceSaved={(
						spaceName,
						isEnabled,
						isPublic,
						spacePassword
					) => {
						setGatherTownModalOpened(false)
						updateExtensionLocally({
							spaceName,
							isEnabled,
							isPublic,
							gatherTownSpacePw: spacePassword
						})
					}}
					onModalClosed={() => {
						setGatherTownModalOpened(false)
					}}
				/>
				<Modal
					centered
					overlayBlur={8}
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					size={'lg'}
					padding={'sm'}
					opened={isExtensionModalOpened}
					title={
						<Text
							className={clubsTheme.tMediumBold}
						>{`Add ${extensionBeingEdited?.name}`}</Text>
					}
					onClose={() => {
						setExtensionModalOpened(false)
					}}
				>
					<Divider />
					<Space h={24} />
					{extensionBeingEdited && (
						<>
							{extensionBeingEdited.guideUrl &&
								!extensionBeingEdited.isExistingExtension && (
									<>
										<Alert
											icon={<QuestionMarkCircle />}
											title="Need help?"
											radius={'lg'}
											color="red"
											variant="light"
										>
											<Text>{`We've written a handy short guide in case you're not familiar with ${extensionBeingEdited.name}.`}</Text>
											<Space h={4} />
											<a
												target="_blank"
												className={clubsTheme.tLink}
												href={
													extensionBeingEdited.guideUrl
												}
												rel="noreferrer"
											>
												{`${extensionBeingEdited.name} setup instructions`}
											</a>
										</Alert>
										<Space h={24} />
									</>
								)}

							<Text
								className={clubsTheme.tSmallBold}
							>{`Enter your club's ${extensionBeingEdited.name}${
								extensionBeingEdited.name === 'Phone Number' ||
								extensionBeingEdited.name === 'Email Address'
									? ''
									: ' URL'
							} here:`}</Text>
							<Space h={8} />
							<TextInput
								radius="lg"
								size="md"
								value={currentExtensionUrl}
								onChange={event => {
									setCurrentExtensionUrl(event.target.value)
								}}
							/>
							<Space h={24} />
						</>
					)}

					{extensionBeingEdited && (
						<>
							<Switch
								checked={isCurrentExtensionPublic}
								onChange={event =>
									setCurrentExtensionPublic(
										event.currentTarget.checked
									)
								}
								label="Visible to non-members"
							/>

							{extensionBeingEdited?.isExistingExtension && (
								<>
									<Space h={16} />
									<Switch
										checked={isCurrentExtensionEnabled}
										onChange={event =>
											setCurrentExtensionEnabled(
												event.currentTarget.checked
											)
										}
										label="Enable app"
									/>
								</>
							)}
							<Space h={24} />
						</>
					)}

					{extensionBeingEdited && (
						<div className={clubsTheme.rowEndAlign}>
							<Button
								loading={isSavingChanges}
								disabled={isSavingChanges}
								onClick={async () => {
									saveSimpleExtensionChanges()
								}}
								className={clubsTheme.buttonBlack}
							>
								Save
							</Button>
						</div>
					)}
				</Modal>
			</div>
		</>
	)
}
