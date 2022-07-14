/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
	MantineProvider,
	Stepper,
	Textarea,
	Loader,
	Button,
	Switch
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import request from 'superagent'
import { GetIntegrationsQuery } from '../../../generated/graphql'
import { GET_INTEGRATIONS } from '../../graphql/clubs'
import { Club, Integration } from '../../model/club/club'
import { ClubAdminVerifyTwitterModal } from './ClubAdminVerifyTwitterModal'

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
		alignItems: 'start',
		fontWeight: 600,
		marginBottom: 12,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	intItemHeader: {
		display: 'flex',
		alignItems: 'center'
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
	}
}))

interface IProps {
	club: Club
}

enum Step {
	FollowGuide,
	AddUrl
}

export const ClubAdminIntegrationsSettingsComponent: React.FC<IProps> = ({
	club
}) => {
	// General properties / tab management
	const { classes } = useStyles()

	const router = useRouter()

	const [hasSetupEnabledIntegrations, setHasSetUpIntegrations] =
		useState(false)

	const {
		loading,
		error,
		data: inteData
	} = useQuery<GetIntegrationsQuery>(GET_INTEGRATIONS)

	const [existingIntegrations, setExistingIntegrations] = useState<
		Integration[]
	>([])
	const [availableIntegrations, setAvailableIntegrations] = useState<
		Integration[]
	>([])
	const [allIntegrations, setAllIntegrations] = useState<Integration[]>([])

	// Used to populate existing integrations when changes are made
	const [integrationBeingEdited, setIntegrationBeingEdited] =
		useState<Integration>()

	// Properties that can be edited by the user
	const [currentIntegrationUrl, setCurrentIntegrationUrl] = useState('')
	const [isCurrentIntegrationEnabled, setCurrentIntegrationEnabled] =
		useState(true)
	const [isCurrentIntegrationPublic, setCurrentIntegrationPublic] =
		useState(false)
	const [currentIntegrationId, setCurrentIntegrationId] = useState('')

	const [isVerifyTwitterModalOpened, setVerifyTwitterModalOpened] =
		useState(false)
	const [isIntegrationModalOpened, setIntegrationModalOpened] =
		useState(false)
	const [step, setStep] = useState<Step>(Step.FollowGuide)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const updateIntegrationLocally = (withTwitter: boolean) => {
		// Update the integration locally
		const updatedInte = integrationBeingEdited

		if (updatedInte && integrationBeingEdited) {
			updatedInte.url = currentIntegrationUrl
			updatedInte.isEnabled = isCurrentIntegrationEnabled
			updatedInte.isPublic = isCurrentIntegrationPublic
			updatedInte.isVerified = withTwitter
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
				// Is there a better way of updating an array item in typescript than a C loop?
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

	const saveIntegrationChanges = async () => {
		if (integrationBeingEdited) {
			// Validate URL

			try {
				const url = new URL(currentIntegrationUrl)
			} catch (_) {
				showNotification({
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
				const jwtToken = Cookies.get('meemJwtToken')
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
					.set('Authorization', `JWT ${jwtToken}`)
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
					title: 'Oops!',
					message:
						'Unable to save this integration. Please get in touch!'
				})
				return
			}
		}
		setIsSavingChanges(false)
		setStep(Step.FollowGuide)
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
				let alreadyExists = false
				existingIntegrations.forEach(existing => {
					if (inte.name === existing.name) {
						alreadyExists = true
						return
					}
				})
				if (!alreadyExists) {
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
			integration.isPublic ??
				(integration.name === 'Twitter' ||
					integration.name === 'Discord')
		)

		if (integration.name === 'Twitter') {
			setVerifyTwitterModalOpened(true)
		} else {
			if (integration.url && integration.url.length > 0) {
				setStep(Step.AddUrl)
			}
			setIntegrationModalOpened(true)
		}
	}

	return (
		<>
			<div>
				<Space h={30} />

				{existingIntegrations && existingIntegrations.length > 0 && (
					<>
						<Text
							className={classes.clubIntegrationsSectionTitle}
						>{`Added apps (${existingIntegrations?.length})`}</Text>
						<Grid>
							{existingIntegrations.map(integration => (
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
											editIntegration(integration)
										}}
									>
										<div
											className={
												classes.enabledClubIntegrationItem
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
												<Text>{integration.name}</Text>
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
										</div>
									</a>
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
												<Text>{integration.name}</Text>
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
						<Loader />
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
					onSuccessfulVerification={() => {
						updateIntegrationLocally(true)
					}}
					onModalClosed={() => {
						setVerifyTwitterModalOpened(false)
					}}
				/>
				<Modal
					centered
					closeOnClickOutside={false}
					closeOnEscape={false}
					radius={16}
					size={'lg'}
					padding={'sm'}
					opened={isIntegrationModalOpened}
					title={
						<Text
							className={classes.modalTitle}
						>{`${integrationBeingEdited?.name} integration`}</Text>
					}
					onClose={() => {
						setStep(Step.FollowGuide)
						setIntegrationModalOpened(false)
					}}
				>
					<Divider />
					<Space h={24} />
					{integrationBeingEdited &&
						(integrationBeingEdited?.name === 'Twitter' ||
							integrationBeingEdited?.name === 'Discord') && (
							<>
								<Text>
									{integrationBeingEdited.description}
								</Text>
								<Space h={8} />
								<TextInput
									radius="lg"
									size="md"
									value={currentIntegrationUrl}
									onChange={event => {
										setCurrentIntegrationUrl(
											event.target.value
										)
									}}
								/>
								<Space h={24} />
							</>
						)}

					{integrationBeingEdited &&
						integrationBeingEdited?.name !== 'Twitter' &&
						integrationBeingEdited?.name !== 'Discord' && (
							<div className={classes.stepsContainer}>
								<MantineProvider
									theme={{
										colors: {
											brand: [
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E',
												'#1DAD4E'
											]
										},
										primaryColor: 'brand'
									}}
								>
									<Stepper
										size="md"
										color="green"
										orientation="vertical"
										active={
											step === Step.FollowGuide ? 0 : 1
										}
									>
										<Stepper.Step
											label={
												'Follow the instructions at the link below.'
											}
											description={
												<>
													<div>
														<Space h={12} />
														<a
															onClick={() => {
																setStep(
																	Step.AddUrl
																)
																window.open(
																	integrationBeingEdited?.guideUrl
																)
															}}
															className={
																classes.buttonConfirm
															}
														>
															View guide
														</a>
													</div>
												</>
											}
										/>
										<Stepper.Step
											label={`Add the URL for the ${integrationBeingEdited.name} integration here.`}
											description={
												<>
													{step === Step.AddUrl && (
														<div>
															<Space h={4} />
															<TextInput
																radius="lg"
																size="md"
																value={
																	currentIntegrationUrl
																}
																onChange={event => {
																	setCurrentIntegrationUrl(
																		event
																			.target
																			.value
																	)
																}}
															/>
														</div>
													)}
												</>
											}
										/>
									</Stepper>
								</MantineProvider>
							</div>
						)}
					{integrationBeingEdited &&
						(integrationBeingEdited?.name === 'Twitter' ||
							integrationBeingEdited?.name === 'Discord' ||
							step === Step.AddUrl) && (
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
											checked={
												isCurrentIntegrationEnabled
											}
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

					{integrationBeingEdited &&
						(integrationBeingEdited?.name === 'Twitter' ||
							integrationBeingEdited?.name === 'Discord' ||
							step === Step.AddUrl) && (
							<div className={classes.buttonEndAlign}>
								<Button
									loading={isSavingChanges}
									disabled={isSavingChanges}
									onClick={async () => {
										saveIntegrationChanges()
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
