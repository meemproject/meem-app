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
	Alert
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import { QuestionMarkCircle } from 'iconoir-react'
import React, { useEffect, useState } from 'react'
import request from 'superagent'
import { ExternalLink, Settings } from 'tabler-icons-react'
import { GetIntegrationsQuery } from '../../../../generated/graphql'
import { GET_INTEGRATIONS } from '../../../graphql/clubs'
import { Club, Integration } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'
import { ClubAdminGatherTownModal } from '../IntegrationModals/ClubAdminGatherTownModal'
import { ClubAdminParagraphIntegrationModal } from '../IntegrationModals/ClubAdminParagraphIntegrationModal'
import { ClubAdminVerifyTwitterModal } from '../IntegrationModals/ClubAdminVerifyTwitterModal'
interface IProps {
	club: Club
}

export const CAClubApps: React.FC<IProps> = ({ club }) => {
	const { classes: styles } = useGlobalStyles()
	const wallet = useWallet()

	// Fetch a list of available integrations.
	const {
		loading,
		error,
		data: inteData
	} = useQuery<GetIntegrationsQuery>(GET_INTEGRATIONS)

	// Lists of integrations
	const [existingIntegrations, setExistingIntegrations] = useState<
		Integration[]
	>([])
	const [availableIntegrations, setAvailableIntegrations] = useState<
		Integration[]
	>([])
	const [allIntegrations, setAllIntegrations] = useState<Integration[]>([])
	const [searchedIntegrations, setSearchedIntegrations] = useState<
		Integration[]
	>([])

	// Current search term
	const [currentSearchTerm, setCurrentSearchTerm] = useState('')

	const [hasSetupEnabledIntegrations, setHasSetUpIntegrations] =
		useState(false)

	// Used to populate existing integrations when changes are made
	const [integrationBeingEdited, setIntegrationBeingEdited] =
		useState<Integration>()

	// Properties that can be edited by the user
	const [currentIntegrationUrl, setCurrentIntegrationUrl] = useState('')
	const [isCurrentIntegrationEnabled, setCurrentIntegrationEnabled] =
		useState(true)
	const [isCurrentIntegrationPublic, setCurrentIntegrationPublic] =
		useState(false)

	// Other properties of the integration being currently edited
	const [currentIntegrationId, setCurrentIntegrationId] = useState('')

	// Properties tied to simple, url-based integrations
	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isIntegrationModalOpened, setIntegrationModalOpened] =
		useState(false)

	// Modals for deeper integrations
	const [isVerifyTwitterModalOpened, setVerifyTwitterModalOpened] =
		useState(false)
	const [isParagraphModalOpened, setParagraphModalOpened] = useState(false)
	const [isGatherTownModalOpened, setGatherTownModalOpened] = useState(false)

	const filterIntegrations = (available: Integration[]) => {
		const search = currentSearchTerm
		const filteredIntegrations: Integration[] = []

		if (currentSearchTerm.length > 0) {
			available.forEach(inte => {
				if (inte.name.toLowerCase().includes(search)) {
					filteredIntegrations.push(inte)
				}
			})
			setSearchedIntegrations(filteredIntegrations)
		} else {
			setSearchedIntegrations(available)
		}
	}

	// Update the integration locally so that changes are reflected immediately.
	const updateIntegrationLocally = (extraData: any) => {
		const updatedInte = integrationBeingEdited

		if (updatedInte && integrationBeingEdited) {
			updatedInte.url = currentIntegrationUrl
			updatedInte.isEnabled = isCurrentIntegrationEnabled
			updatedInte.isPublic = isCurrentIntegrationPublic

			// If there was extra integration metadata, update it on the integration here.
			if (extraData) {
				updatedInte.isEnabled =
					extraData.isEnabled ?? isCurrentIntegrationEnabled
				updatedInte.isVerified = extraData.isVerified ?? false
				updatedInte.isPublic =
					extraData.isPublic ?? isCurrentIntegrationPublic

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
			setIntegrationBeingEdited(updatedInte)

			// Check to see if this integration is an existing integration

			if (!integrationBeingEdited.isExistingIntegration) {
				// If not an existing integration, push this into existing integrations
				const newExisting = existingIntegrations
				integrationBeingEdited.isExistingIntegration = true
				newExisting.push(integrationBeingEdited)
				setExistingIntegrations(newExisting)

				availableIntegrations.forEach(inte => {
					if (inte.integrationId === currentIntegrationId) {
						const newAvailable = availableIntegrations.filter(
							integ =>
								integ.integrationId !== currentIntegrationId
						)
						setAvailableIntegrations(newAvailable)
						filterIntegrations(newAvailable)
						return
					}
				})
			} else {
				// If already enabled, modify the existing integration
				const newIntegrations = [...existingIntegrations]
				// TODO: Is there a better way of updating an array item in typescript than a C loop?
				for (let i = 0; i < newIntegrations.length; i++) {
					if (
						newIntegrations[i].integrationId ===
						currentIntegrationId
					) {
						newIntegrations[i] = integrationBeingEdited
						break
					}
				}

				setExistingIntegrations(newIntegrations)
			}
		}
	}

	// Used by simple integrations, i.e. ones that just require a URL.
	const saveSimpleIntegrationChanges = async () => {
		if (integrationBeingEdited) {
			// Validate URL

			if (
				integrationBeingEdited.name === 'Phone Number' ||
				integrationBeingEdited.name === 'Email Address'
			) {
				// Ignore / skip validation (we may want to add custom validation here in future)
			} else {
				try {
					new URL(currentIntegrationUrl)
				} catch (_) {
					showNotification({
						radius: 'lg',
						title: 'Oops!',
						message:
							'Please enter a valid URL for this integration.'
					})
					return
				}
			}

			// Mark as saving changes
			setIsSavingChanges(true)

			log.debug(`public: ${isCurrentIntegrationPublic}`)

			// Save the change to the db
			try {
				const { body } = await request
					.post(
						`${
							process.env.NEXT_PUBLIC_API_URL
						}${MeemAPI.v1.CreateOrUpdateMeemContractIntegration.path(
							{
								meemContractId: club.id ?? '',
								integrationId: currentIntegrationId
							}
						)}`
					)
					.set('Authorization', `JWT ${wallet.jwt}`)
					.send({
						isEnabled: isCurrentIntegrationEnabled,
						isPublic: isCurrentIntegrationPublic,
						metadata: {
							externalUrl: currentIntegrationUrl
						}
					})
				log.debug(body)

				updateIntegrationLocally(false)
			} catch (e) {
				log.debug(e)
				setIsSavingChanges(false)
				showNotification({
					radius: 'lg',
					title: 'Oops!',
					message:
						'Unable to save this integration. Please get in touch!'
				})
				return
			}
		}
		setIsSavingChanges(false)
		setIntegrationModalOpened(false)
	}

	// Setup available integrations
	useEffect(() => {
		if (!loading && inteData && availableIntegrations.length === 0) {
			// Set up available integrations
			const available: Integration[] = []
			inteData.Integrations.forEach(inte => {
				const integration: Integration = {
					isExistingIntegration: false,
					integrationId: inte.id,
					name: inte.name,
					description: inte.description,
					guideUrl: inte.guideUrl,
					icon: inte.icon
				}
				available.push(integration)
			})
			setAllIntegrations(available)
		}

		if (
			allIntegrations.length > 0 &&
			availableIntegrations.length === 0 &&
			hasSetupEnabledIntegrations
		) {
			// Filter out available integrations based on enabled...
			const finalIntegrations: Integration[] = []

			allIntegrations.forEach(inte => {
				let doesAlreadyExist = false
				existingIntegrations.forEach(existing => {
					if (inte.name === existing.name) {
						doesAlreadyExist = true
						return
					}
				})
				if (!doesAlreadyExist) {
					finalIntegrations.push(inte)
				}
			})
			setSearchedIntegrations(finalIntegrations)
			setAvailableIntegrations(finalIntegrations)
		}
	}, [
		availableIntegrations,
		allIntegrations,
		hasSetupEnabledIntegrations,
		inteData,
		loading,
		existingIntegrations
	])

	// Setup enabled integrations
	useEffect(() => {
		if (!hasSetupEnabledIntegrations) {
			// Set up enabled integrations
			setExistingIntegrations(club.allIntegrations ?? [])
			setHasSetUpIntegrations(true)
		}
	}, [club.allIntegrations, hasSetupEnabledIntegrations])

	const editIntegration = (integration: Integration) => {
		log.debug(integration.name)

		setIntegrationBeingEdited(integration)
		setCurrentIntegrationUrl(integration.url ?? '')
		setCurrentIntegrationEnabled(integration.isEnabled ?? true)
		setCurrentIntegrationId(integration.integrationId ?? '')
		setCurrentIntegrationPublic(
			integration.isPublic ?? integration.name === 'Discord'
		)

		if (integration.name === 'Twitter') {
			// Open twitter integration modal
			setVerifyTwitterModalOpened(true)
		} else if (integration.name === 'Paragraph') {
			// Open paragraph integration modal
			setParagraphModalOpened(true)
		} else if (integration.name === 'Gather Town') {
			// Open paragraph integration modal
			setGatherTownModalOpened(true)
		} else {
			setIntegrationModalOpened(true)
		}
	}

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={styles.tSectionTitle}>Club Apps</Text>
				<Space h={32} />

				{existingIntegrations && existingIntegrations.length > 0 && (
					<>
						<Text
							className={styles.tSubtitle}
						>{`Added apps (${existingIntegrations?.length})`}</Text>
						<Space h={8} />
						<Grid>
							{existingIntegrations.map(integration => (
								<Grid.Col
									xs={8}
									sm={8}
									md={4}
									lg={4}
									xl={4}
									key={integration.name}
								>
									<div
										className={
											styles.enabledClubIntegrationItem
										}
									>
										<div
											className={
												styles.enabledClubIntegrationItemHeaderBackground
											}
										/>
										<div
											className={
												styles.clubIntegrationItemHeader
											}
										>
											<Image
												src={`/${integration.icon}`}
												width={16}
												height={16}
												fit={'contain'}
											/>
											<Space w={8} />
											<Text>{`${integration.name}`}</Text>
											{integration.isVerified && (
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
											<Space h={12} />
											<Divider />
										</div>
										<div
											className={styles.row}
											style={{ height: 46 }}
										>
											<a
												onClick={() => {
													if (
														integration.name ===
														'Phone Number'
													) {
														window.open(
															`tel:${integration.url}`
														)
													} else if (
														integration.name ===
														'Email Address'
													) {
														window.open(
															`mailto:${integration.url}`
														)
													} else {
														window.open(
															integration.url
														)
													}
												}}
											>
												<div
													className={styles.row}
													style={{
														cursor: 'pointer',
														padding: 12
													}}
												>
													<ExternalLink size={20} />
													<Space w={4} />
													<Text
														className={
															styles.tExtraSmall
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
													editIntegration(integration)
												}}
											>
												<div
													className={styles.row}
													style={{
														cursor: 'pointer',
														padding: 12
													}}
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
								</Grid.Col>
							))}
						</Grid>

						<Space h="xl" />
					</>
				)}
				{!loading && inteData && (
					<>
						<Text
							className={styles.tSubtitle}
						>{`Available apps (${searchedIntegrations?.length})`}</Text>
						<Space h={8} />

						<TextInput
							radius={16}
							size={'md'}
							onChange={event => {
								if (event.target.value) {
									setCurrentSearchTerm(event.target.value)
									filterIntegrations(availableIntegrations)
								} else {
									setSearchedIntegrations(
										availableIntegrations
									)
								}
							}}
							placeholder="Search Apps"
						/>
						<Space h={24} />
						<Grid>
							{searchedIntegrations.map(integration => (
								<Grid.Col
									xs={8}
									sm={8}
									md={4}
									lg={4}
									xl={4}
									key={integration.name}
								>
									<a
										onClick={() => {
											editIntegration(integration)
										}}
									>
										<div
											className={
												styles.clubIntegrationItem
											}
										>
											<div
												className={
													styles.clubIntegrationItemHeader
												}
											>
												<Image
													src={`/${integration.icon}`}
													width={16}
													height={16}
													fit={'contain'}
												/>
												<Space w={8} />
												<Text>{`${integration.name}`}</Text>
											</div>
											<Text
												className={styles.tExtraSmall}
												style={{ marginTop: 4 }}
											>
												{integration.description}
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
					integration={integrationBeingEdited}
					isOpened={isVerifyTwitterModalOpened}
					onSuccessfulVerification={twitterUsername => {
						updateIntegrationLocally({
							isVerified: true,
							twitterUsername
						})
					}}
					onModalClosed={() => {
						setVerifyTwitterModalOpened(false)
					}}
				/>
				<ClubAdminParagraphIntegrationModal
					club={club}
					integration={integrationBeingEdited}
					isOpened={isParagraphModalOpened}
					onComplete={(slug, name, isEnabled) => {
						updateIntegrationLocally({
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
					integration={integrationBeingEdited}
					isOpened={isGatherTownModalOpened}
					onSpaceSaved={(
						spaceName,
						isEnabled,
						isPublic,
						spacePassword
					) => {
						setGatherTownModalOpened(false)
						updateIntegrationLocally({
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
					opened={isIntegrationModalOpened}
					title={
						<Text
							className={styles.tModalTitle}
						>{`Add ${integrationBeingEdited?.name}`}</Text>
					}
					onClose={() => {
						setIntegrationModalOpened(false)
					}}
				>
					<Divider />
					<Space h={24} />
					{integrationBeingEdited && (
						<>
							{integrationBeingEdited.guideUrl &&
								!integrationBeingEdited.isExistingIntegration && (
									<>
										<Alert
											icon={<QuestionMarkCircle />}
											title="Need help?"
											radius={'lg'}
											color="red"
											variant="light"
										>
											<Text>{`We've written a handy short guide in case you're not familiar with ${integrationBeingEdited.name}.`}</Text>
											<Space h={4} />
											<a
												target="_blank"
												className={styles.tLink}
												href={
													integrationBeingEdited.guideUrl
												}
												rel="noreferrer"
											>
												{`${integrationBeingEdited.name} setup instructions`}
											</a>
										</Alert>
										<Space h={24} />
									</>
								)}

							<Text
								className={styles.tBold}
							>{`Enter your club's ${
								integrationBeingEdited.name
							}${
								integrationBeingEdited.name ===
									'Phone Number' ||
								integrationBeingEdited.name === 'Email Address'
									? ''
									: ' URL'
							} here:`}</Text>
							<Space h={8} />
							<TextInput
								radius="lg"
								size="md"
								value={currentIntegrationUrl}
								onChange={event => {
									setCurrentIntegrationUrl(event.target.value)
								}}
							/>
							<Space h={24} />
						</>
					)}

					{integrationBeingEdited && (
						<>
							<Switch
								checked={isCurrentIntegrationPublic}
								onChange={event =>
									setCurrentIntegrationPublic(
										event.currentTarget.checked
									)
								}
								label="Visible to non-members"
							/>

							{integrationBeingEdited?.isExistingIntegration && (
								<>
									<Space h={16} />
									<Switch
										checked={isCurrentIntegrationEnabled}
										onChange={event =>
											setCurrentIntegrationEnabled(
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

					{integrationBeingEdited && (
						<div className={styles.rowEndAlign}>
							<Button
								loading={isSavingChanges}
								disabled={isSavingChanges}
								onClick={async () => {
									saveSimpleIntegrationChanges()
								}}
								className={styles.buttonBlack}
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
