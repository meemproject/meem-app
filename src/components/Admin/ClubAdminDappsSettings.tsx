/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
	Textarea
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { allIntegrations, Club, Integration } from '../../model/club/club'

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
	}
}))

interface IProps {
	club: Club
}

enum Step {
	FollowGuide,
	AddUrl
}

export const ClubAdminDappSettingsComponent: React.FC<IProps> = ({ club }) => {
	// General properties / tab management
	const { classes } = useStyles()

	const [hasSetupIntegrations, setHasSetUpIntegrations] = useState(false)

	const [enabledIntegrations, setEnabledIntegrations] = useState<Integration[]>(
		[]
	)
	const [availableIntegrations, setAvailableIntegrations] = useState<
		Integration[]
	>([])

	const [integrationBeingEdited, setIntegrationBeingEdited] =
		useState<Integration>()

	const [isIntegrationModalOpened, setIntegrationModalOpened] = useState(false)
	const openIntegrationModal = () => {
		// e.g. end now or later (w/ calendar)
		setIntegrationModalOpened(true)
	}
	const [step, setStep] = useState<Step>(Step.FollowGuide)

	useEffect(() => {
		if (!hasSetupIntegrations) {
			// Set up available integrations
			const available: Integration[] = []
			allIntegrations.forEach(inte => {
				let isIntegrationEnabled = false
				club.integrations?.forEach(enabledInte => {
					if (enabledInte.name === inte.name) {
						isIntegrationEnabled = true
						return
					}
				})
				if (!isIntegrationEnabled) {
					available.push(inte)
				}
			})
			setAvailableIntegrations(available)

			// Set up enabled integrations
			setEnabledIntegrations(club.integrations ?? [])

			setHasSetUpIntegrations(true)
		}
	}, [club.integrations, hasSetupIntegrations])

	const editIntegration = (integration: Integration) => {
		setIntegrationBeingEdited(integration)
		setIntegrationModalOpened(true)
	}

	// Unused for now
	const removeIntegration = (integration: Integration) => {}

	const saveChanges = () => {}

	return (
		<>
			<div>
				<Space h={30} />
				<Text className={classes.clubIntegrationsSectionTitle}>
					Club Contract Address
				</Text>
				<Text className={classes.clubContractAddress}>{club.address}</Text>
				<Space h={'xl'} />
				<Text
					className={classes.clubIntegrationsSectionTitle}
				>{`Enabled apps (${enabledIntegrations?.length})`}</Text>
				<Grid>
					{enabledIntegrations.map(integration => (
						<Grid.Col xs={6} sm={4} md={4} lg={4} xl={4} key={integration.name}>
							<a
								onClick={() => {
									editIntegration(integration)
								}}
							>
								<div className={classes.enabledClubIntegrationItem}>
									<div className={classes.intItemHeader}>
										<Image
											src={`/${integration.icon}`}
											width={16}
											height={16}
											fit={'contain'}
										/>
										<Space w={8} />
										<Text>{integration.name}</Text>
									</div>
								</div>
							</a>
						</Grid.Col>
					))}
				</Grid>
				<Space h="xl" />
				<Text
					className={classes.clubIntegrationsSectionTitle}
				>{`Available apps (${availableIntegrations?.length})`}</Text>
				<Grid>
					{availableIntegrations.map(integration => (
						<Grid.Col xs={6} sm={4} md={4} lg={4} xl={4} key={integration.name}>
							<a
								onClick={() => {
									editIntegration(integration)
								}}
							>
								<div className={classes.clubIntegrationItem}>
									<div className={classes.intItemHeader}>
										<Image
											src={`/${integration.icon}`}
											width={16}
											height={16}
											fit={'contain'}
										/>
										<Space w={8} />
										<Text>{integration.name}</Text>
									</div>
									<Text className={classes.intItemDescription}>
										{integration.description}
									</Text>
								</div>
							</a>
						</Grid.Col>
					))}
				</Grid>
				<Space h="xl" />
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
					onClose={() => setIntegrationModalOpened(false)}
				>
					<Divider />
					<Space h={24} />
					{integrationBeingEdited &&
						(integrationBeingEdited?.name === 'Twitter' ||
							integrationBeingEdited?.name === 'Discord') && (
							<>
								<Text>{integrationBeingEdited.description}</Text>
								<Space h={8} />
								<TextInput
									radius="lg"
									size="md"
									value={integrationBeingEdited.url}
									onChange={event => {
										const newInte: Integration = {
											name: integrationBeingEdited.name,
											icon: integrationBeingEdited.icon,
											description: integrationBeingEdited.description,
											url: event.target.value,
											guideUrl: integrationBeingEdited.guideUrl
										}
										setIntegrationBeingEdited(newInte)
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
										active={step === Step.FollowGuide ? 0 : 1}
									>
										<Stepper.Step
											label={
												step === Step.AddUrl
													? ''
													: 'Follow the instructions at the link below.'
											}
											loading={step === Step.AddUrl}
											description={
												<>
													{step === Step.FollowGuide && (
														<div>
															<Space h={12} />
															<a
																onClick={() => {
																	window.open(integrationBeingEdited?.guideUrl)
																}}
																className={classes.buttonConfirm}
															>
																View guide
															</a>
														</div>
													)}

													{step === Step.AddUrl && (
														<div>
															<Space h={12} />
															<Text>Done!</Text>
														</div>
													)}
												</>
											}
										/>
									</Stepper>
								</MantineProvider>
							</div>
						)}

					<a
						onClick={() => {
							if (integrationBeingEdited) {
								let isEnabled = false
								enabledIntegrations.forEach(inte => {
									if (inte.name === integrationBeingEdited.name) {
										isEnabled = true
										return
									}
								})
								if (!isEnabled) {
									// If not enabled, push this into enabled integrations
									const newEnabled = enabledIntegrations
									newEnabled.push(integrationBeingEdited)
									setEnabledIntegrations(newEnabled)

									availableIntegrations.forEach(inte => {
										if (inte.name === integrationBeingEdited.name) {
											const newAvailable = availableIntegrations.filter(
												integ => integ.name !== integrationBeingEdited.name
											)
											setAvailableIntegrations(newAvailable)
											return
										}
									})
								} else {
									// If already enabled, modify the existing integration
									const newIntegrations = [...enabledIntegrations]
									// Is there a better way of updating an array item in typescript than a C loop?
									for (let i = 0; i < newIntegrations.length; i++) {
										if (
											newIntegrations[i].name === integrationBeingEdited.name
										) {
											newIntegrations[i] = integrationBeingEdited
											break
										}
									}

									setEnabledIntegrations(newIntegrations)
								}
							}

							setIntegrationModalOpened(false)
						}}
						className={classes.buttonConfirm}
					>
						Done
					</a>
				</Modal>
			</div>
		</>
	)
}
