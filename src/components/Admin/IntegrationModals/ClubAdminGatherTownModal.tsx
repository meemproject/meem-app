import log from '@kengoldfarb/log'
import {
	Text,
	Space,
	Modal,
	Divider,
	TextInput,
	Loader,
	Switch,
	Alert,
	Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import request from 'superagent'
import { AlertCircle } from 'tabler-icons-react'
import { Club, Integration } from '../../../model/club/club'
import { colorPink, useClubsTheme } from '../../Styles/ClubsTheme'

interface IProps {
	club: Club
	integration?: Integration
	isOpened: boolean
	onModalClosed: () => void
	onSpaceSaved: (
		spaceUrl: string,
		isEnabled: boolean,
		isPublic: boolean,
		spacePassword?: string
	) => void
}

enum Step {
	CreateGatherSpace,
	AddGatherSpaceDetails
}

export const ClubAdminGatherTownModal: React.FC<IProps> = ({
	club,
	integration,
	isOpened,
	onModalClosed,
	onSpaceSaved
}) => {
	const { classes: clubsTheme } = useClubsTheme()

	const wallet = useWallet()

	const [step, setStep] = useState<Step>(Step.CreateGatherSpace)

	const [spaceUrl, setSpaceUrl] = useState('')

	const [spacePassword, setSpacePassword] = useState('')

	const [isEnabled, setIsEnabled] = useState(false)

	const [isPublic, setIsPublic] = useState(false)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	useEffect(() => {
		if (integration && integration.isExistingIntegration) {
			setStep(Step.AddGatherSpaceDetails)
			setSpaceUrl(integration.url ?? '')
			setIsPublic(integration.isPublic ?? false)
			setIsEnabled(integration.isEnabled ?? true)
			setSpacePassword(integration.gatherTownSpacePw ?? '')
		}
	}, [integration])

	const saveIntegration = async () => {
		if (!spaceUrl.includes('https://app.gather.town/app/')) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'Your Gather Town space URL is invalid. Check what you entered and try again.'
			})
			return
		}

		if (spacePassword.length > 50) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'Your space password is too long. Check what you entered and try again.'
			})
			return
		}

		if (isPublic && spacePassword.length > 0) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'You cannot add a password-protected Gather space as a club app if it is public. Either remove the password or set as visible to non-members.'
			})
			return
		}

		setIsSavingChanges(true)

		log.debug('saving integration')
		try {
			const postData = `${
				process.env.NEXT_PUBLIC_API_URL
			}${MeemAPI.v1.CreateOrUpdateMeemContractIntegration.path({
				meemContractId: club.id ?? '',
				integrationId: integration?.integrationId ?? ''
			})}`
			const data = {
				isEnabled: true,
				isPublic,
				metadata: {
					externalUrl: spaceUrl,
					gatherTownSpacePw: spacePassword
				}
			}
			log.debug(JSON.stringify(postData))
			log.debug(JSON.stringify(data))
			await request
				.post(postData)
				.set('Authorization', `JWT ${wallet.jwt}`)
				.send(data)
			onSpaceSaved(spaceUrl, isEnabled, isPublic, spacePassword)
			setIsSavingChanges(false)
		} catch (e) {
			log.debug(e)
			showNotification({
				title: 'Something went wrong',
				autoClose: 5000,
				color: colorPink,
				icon: <AlertCircle />,
				message: `Please check that all fields are complete and try again.`
			})
			setIsSavingChanges(false)
			return
		}
	}

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				overlayBlur={8}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={clubsTheme.tMediumBold}>Gather Town</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				{step === Step.CreateGatherSpace && (
					<>
						<>
							<div>
								<Text className={clubsTheme.tExtraSmall}>
									{`Let's create a Gather Town space for your club. Click the link below and follow the instructions.`}
								</Text>

								<Space h={8} />

								<Button
									onClick={() => {
										window.open(
											'https://app.gather.town/get-started'
										)
									}}
									className={clubsTheme.buttonBlack}
								>
									Create Space
								</Button>
								<Space h={32} />
								<Text className={clubsTheme.tExtraSmall}>
									{`When you have created a space (or already have one), continue below.`}
								</Text>
								<Space h={8} />

								<div className={clubsTheme.row}>
									<Button
										onClick={() => {
											setStep(Step.AddGatherSpaceDetails)
										}}
										className={clubsTheme.buttonBlack}
									>
										Next
									</Button>
								</div>
							</div>
						</>
					</>
				)}
				{step === Step.AddGatherSpaceDetails && (
					<>
						<>
							<div>
								<Text className={clubsTheme.tExtraSmall}>
									{`Add your club's new Gather Town Space details below. If you are using a Space password, add it here.`}
								</Text>
								<Space h={16} />

								<Text className={clubsTheme.tSmallBold}>
									Space URL
								</Text>
								<Space h={4} />
								<TextInput
									radius={16}
									size={'md'}
									value={spaceUrl}
									onChange={event => {
										setSpaceUrl(event.target.value)
									}}
								/>
								<Space h={24} />
								<Text
									className={clubsTheme.tSmallBold}
								>{`(Optional) Space Password`}</Text>

								<Space h={4} />
								<TextInput
									radius={16}
									size={'md'}
									value={spacePassword}
									onChange={event => {
										setSpacePassword(event.target.value)
									}}
								/>
								{spacePassword.length > 0 && (
									<>
										<Space h={8} />
										<Alert
											title="Security warning"
											color="red"
											radius="lg"
										>
											<Text>{`Our APIs are partially public. A skilled developer may be able to obtain this password, so consider it a deterrent rather than iron-clad security for your Gather Space. You could also use Gather's 'whitelist' feature for better security. We're working on it!`}</Text>
										</Alert>
									</>
								)}

								<Space h={24} />
								{integration &&
									integration.isExistingIntegration && (
										<>
											<Switch
												checked={isEnabled}
												onChange={event =>
													setIsEnabled(
														event.currentTarget
															.checked
													)
												}
												label="App enabled"
											/>
											<Space h={8} />
										</>
									)}
								<Switch
									checked={isPublic}
									onChange={event =>
										setIsPublic(event.currentTarget.checked)
									}
									label="Visible to non-members"
								/>
								<Space h={32} />

								{isSavingChanges && (
									<>
										<Loader color="red" variant="oval" />
									</>
								)}
								{!isSavingChanges && (
									<>
										<Button
											onClick={() => {
												saveIntegration()
											}}
											className={clubsTheme.buttonBlack}
										>
											Save
										</Button>
									</>
								)}
							</div>
						</>
					</>
				)}
			</Modal>
		</>
	)
}
