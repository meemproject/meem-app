import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Divider,
	Stepper,
	Loader
} from '@mantine/core'
import React, { useState } from 'react'
import { Identity } from '../../../../model/identity/identity'

const useStyles = createStyles(theme => ({
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
		border: '1px solid rgba(204, 204, 204, 1)',
		borderRadius: 16,
		padding: 16
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
	currentTwitterVerification: {
		fontWeight: 600
	},
	isVerifiedSection: {
		paddingLeft: 8,
		paddingRight: 8
	}
}))

interface IProps {
	identity: Identity
	isOpened: boolean
	onModalClosed: () => void
	onSuccessfulVerification: () => void
}

export const ProfileLinkDiscordModal: React.FC<IProps> = ({
	identity,
	isOpened,
	onModalClosed,
	onSuccessfulVerification
}) => {
	const { classes } = useStyles()

	const [isAuthenticating, setIsAuthenticating] = useState(false)

	const authenticateWithDiscord = async () => {
		onSuccessfulVerification()
	}

	// TODO: Listen out for successful verification (subscription to identity?)

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						Connect your Discord account
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={classes.stepsContainer}>
					<Stepper
						size="md"
						color="green"
						orientation="vertical"
						active={0}
					>
						<Stepper.Step
							label="Authenticate with Discord"
							description={
								<div>
									<Text className={classes.stepDescription}>
										{`Launch Discord to verify ownership of your account.`}
									</Text>
									<Space h={4} />
									{!isAuthenticating && (
										<a
											onClick={() => {
												setIsAuthenticating(true)
												authenticateWithDiscord()
											}}
											className={classes.buttonConfirm}
										>
											Launch Discord
										</a>
									)}
									{isAuthenticating && <Loader />}
								</div>
							}
						/>
					</Stepper>
				</div>
			</Modal>
		</>
	)
}
