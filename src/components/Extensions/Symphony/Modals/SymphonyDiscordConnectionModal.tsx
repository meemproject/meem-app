import {
	Text,
	Space,
	Modal,
	Button,
	Center,
	Code,
	Stepper,
	Image
} from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { makeRequest } from '@meemproject/sdk'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useCallback, useState } from 'react'
import { showSuccessNotification } from '../../../../utils/notifications'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { API } from '../symphonyTypes.generated'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const SymphonyDiscordConnectionModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const [connectDiscordStep, setConnectDiscordStep] = useState(0)
	const [botCode, setBotCode] = useState<string>('')

	const { agreement } = useAgreement()
	const { jwt } = useAuth()

	const handleInviteBot = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}
		const { code, inviteUrl } =
			await makeRequest<API.v1.InviteDiscordBot.IDefinition>(
				`${
					process.env.NEXT_PUBLIC_SYMPHONY_API_URL
				}${API.v1.InviteDiscordBot.path()}`,
				{ query: { agreementId: agreement?.id, jwt } }
			)

		setBotCode(code)

		window.open(inviteUrl, '_blank')
	}, [agreement, jwt])

	return (
		<>
			<Modal
				opened={isOpened}
				onClose={() => onModalClosed()}
				overlayBlur={8}
				withCloseButton={false}
				radius={16}
				size={'lg'}
				padding={'sm'}
			>
				<Space h={16} />

				<Center>
					<Text
						className={meemTheme.tMediumBold}
						style={{ textAlign: 'center' }}
					>
						{`Connect to Discord`}
					</Text>
				</Center>
				<Space h={24} />
				<Stepper
					active={connectDiscordStep}
					breakpoint="sm"
					orientation="vertical"
				>
					<Stepper.Step
						label="Invite Symphony bot"
						description={
							<>
								<Text className={meemTheme.tExtraSmall}>
									{connectDiscordStep === 1
										? `You've invited the Symphony bot to your Discord server.`
										: `Please invite the Symphony bot to manage your Discord server.`}
								</Text>
								{connectDiscordStep === 0 && (
									<>
										<Space h={16} />
										<div className={meemTheme.row}>
											<Button
												leftIcon={
													<Image
														width={16}
														src={`/integration-discord-white.png`}
													/>
												}
												className={
													meemTheme.buttonDiscordBlue
												}
												onClick={() => {
													handleInviteBot()
												}}
											>
												{`Invite Symphony Bot`}
											</Button>
										</div>
										<Space h={16} />

										{botCode && (
											<>
												<div className={meemTheme.row}>
													<Button
														className={
															meemTheme.buttonBlack
														}
														onClick={() => {
															setConnectDiscordStep(
																1
															)
														}}
													>
														{`Next`}
													</Button>
												</div>
												<Space h={16} />
											</>
										)}
									</>
								)}
							</>
						}
					/>
					<Stepper.Step
						label="Activate Symphony in Discord"
						description={
							<>
								<Text className={meemTheme.tExtraSmall}>
									Type{' '}
									<span style={{ fontWeight: '600' }}>
										/activate
									</span>{' '}
									in any public channel of your Discord
									server, then enter the code below:
								</Text>
								{connectDiscordStep === 1 && (
									<>
										<Space h={16} />
										<Code
											style={{ cursor: 'pointer' }}
											onClick={() => {
												navigator.clipboard.writeText(
													`${botCode}`
												)
												showSuccessNotification(
													'Copied to clipboard',
													`The code was copied to your clipboard.`
												)
											}}
											block
										>{`${botCode}`}</Code>
										<Space h={16} />

										<div className={meemTheme.row}>
											<Button
												className={
													meemTheme.buttonBlack
												}
												onClick={() => {
													onModalClosed()
												}}
											>
												{`Done`}
											</Button>
										</div>
									</>
								)}
							</>
						}
					></Stepper.Step>
				</Stepper>
			</Modal>
		</>
	)
}
