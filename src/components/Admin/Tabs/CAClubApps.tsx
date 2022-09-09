/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
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
import { ClubAdminParagraphIntegrationModal } from '../IntegrationModals/ClubAdminParagraphIntegrationModal'
import { ClubAdminVerifyTwitterModal } from '../IntegrationModals/ClubAdminVerifyTwitterModal'

const useStyles = createStyles(theme => ({
	// Membership tab
	membershipText: { fontSize: 20, marginBottom: 8, lineHeight: 2 },
	membershipSelector: {
		padding: 4,
		borderRadius: 8,
		fontWeight: 'bold',
		backgroundColor: 'rgba(255, 102, 81, 0.1)',
		color: 'rgba(255, 102, 81, 1)',
		cursor: 'pointer'
	},
	addRequirementButton: {
		backgroundColor: 'white',
		color: 'rgba(255, 102, 81, 1)',
		border: '1px dashed rgba(255, 102, 81, 1)',
		borderRadius: 24,
		'&:hover': {
			backgroundColor: 'rgba(255, 102, 81, 0.05)'
		},
		marginBottom: 8
	},
	// Admins tab
	clubAdminsPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		marginTop: 36
	},
	clubAdminsInstructions: {
		fontSize: 18,
		marginBottom: 16,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	adminsTextAreaContainer: {
		position: 'relative'
	},
	adminsTextArea: {
		paddingTop: 48,
		paddingLeft: 32
	},
	primaryAdminChip: {
		position: 'absolute',
		pointerEvents: 'none',
		top: 12,
		left: 12
	},
	primaryAdminChipContents: {
		display: 'flex',
		alignItems: 'center'
	},
	// Integrations tab
	clubIntegrationsHeader: {
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
	clubIntegrationItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		minHeight: 110,
		marginBottom: 12,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	enabledClubIntegrationItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 12,
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: 'white',
		borderRadius: 16,
		paddingTop: 16,
		position: 'relative'
	},
	intItemHeader: {
		fontWeight: 600,
		display: 'flex',
		alignItems: 'center',
		zIndex: 1
	},
	intItemDescription: {
		fontWeight: 400,
		marginTop: 4,
		fontSize: 14
	},
	clubVerificationSectionTitle: {
		fontSize: 18,
		marginBottom: 4,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginBottom: 8
		}
	},
	clubIntegrationsSectionTitle: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginBottom: 8
		}
	},
	clubContractAddress: {
		wordBreak: 'break-all',
		color: 'rgba(0, 0, 0, 0.5)'
	},
	header: {
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	modalInstructions: {
		fontWeight: 600,
		fontSize: 16
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubName: {
		fontSize: 16,
		marginLeft: 16
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 40,
		height: 40,
		minHeight: 40,
		minWidth: 40
	},
	stepsContainer: {
		borderRadius: 16,
		marginBottom: 24
	},
	buttonConfirm: {
		paddingTop: 8,
		paddingLeft: 16,
		paddingBottom: 8,
		paddingRight: 16,
		color: 'white',
		backgroundColor: 'black',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	stepDescription: {
		fontSize: 14
	},
	buttonSaveChanges: {
		marginTop: 16,
		marginBottom: 0,

		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	buttonEndAlign: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'end'
	},
	integrationActions: {
		display: 'flex',
		flexDirection: 'row',
		height: 46
	},
	integrationAction: {
		cursor: 'pointer',
		display: 'flex',
		flexDirection: 'row',
		padding: 12
	},
	integrationActionText: {
		fontSize: 14
	},
	enabledIntHeaderBg: {
		backgroundColor: '#FAFAFA',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 53,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16
	},
	manageClubHeader: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	},
	link: {
		fontWeight: 'bold',
		color: 'rgba(255, 102, 81, 1)',
		cursor: 'pointer',
		textDecoration: 'none'
	}
}))

interface IProps {
	club: Club
}

export const CAClubApps: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()
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
				updatedInte.verifiedTwitterUser =
					extraData.twitterUsername ?? ''
				updatedInte.publicationSlug = extraData.publicationSlug ?? ''
				updatedInte.publicationName = extraData.publicatioName ?? ''
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

			try {
				new URL(currentIntegrationUrl)
			} catch (_) {
				showNotification({
					radius: 'lg',
					title: 'Oops!',
					message: 'Please enter a valid URL for this integration.'
				})
				return
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
		} else {
			setIntegrationModalOpened(true)
		}
	}

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={classes.manageClubHeader}>Club Apps</Text>

				{existingIntegrations && existingIntegrations.length > 0 && (
					<>
						<Text
							className={classes.clubIntegrationsSectionTitle}
						>{`Added apps (${existingIntegrations?.length})`}</Text>
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
											classes.enabledClubIntegrationItem
										}
									>
										<div
											className={
												classes.enabledIntHeaderBg
											}
										/>
										<div className={classes.intItemHeader}>
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
											className={
												classes.integrationActions
											}
										>
											<a
												onClick={() => {
													window.open(integration.url)
												}}
											>
												<div
													className={
														classes.integrationAction
													}
												>
													<ExternalLink size={20} />
													<Space w={4} />
													<Text
														className={
															classes.integrationActionText
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
													className={
														classes.integrationAction
													}
												>
													<Settings size={20} />
													<Space w={4} />
													<Text
														className={
															classes.integrationActionText
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
							className={classes.clubIntegrationsSectionTitle}
						>{`Available apps (${availableIntegrations?.length})`}</Text>
						<TextInput
							radius={16}
							size={'md'}
							placeholder="Search Apps"
						/>
						<Space h={24} />
						<Grid>
							{availableIntegrations.map(integration => (
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
												classes.clubIntegrationItem
											}
										>
											<div
												className={
													classes.intItemHeader
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
												className={
													classes.intItemDescription
												}
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
							className={classes.modalTitle}
						>{`Add link to ${integrationBeingEdited?.name}`}</Text>
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
												className={classes.link}
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
								className={classes.modalInstructions}
							>{`Enter your club's ${integrationBeingEdited.name} URL here:`}</Text>
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
						<div className={classes.buttonEndAlign}>
							<Button
								loading={isSavingChanges}
								disabled={isSavingChanges}
								onClick={async () => {
									saveSimpleIntegrationChanges()
								}}
								className={classes.buttonConfirm}
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
