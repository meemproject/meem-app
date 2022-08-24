import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Divider,
	Loader
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import React, { useEffect } from 'react'
import request from 'superagent'
import { AlertCircle, Check } from 'tabler-icons-react'

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
	integrationId?: string
	discordAuthCode?: string
	isOpened: boolean
	onModalClosed: () => void
}

export const ProfileLinkDiscordModal: React.FC<IProps> = ({
	integrationId,
	discordAuthCode,
	isOpened,
	onModalClosed
}) => {
	const { classes } = useStyles()
	const wallet = useWallet()

	useEffect(() => {
		async function authenticateWithDiscord() {
			try {
				await request
					.post(
						`${
							process.env.NEXT_PUBLIC_API_URL
						}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
							integrationId: integrationId ?? ''
						})}`
					)
					.set('Authorization', `JWT ${wallet.jwt}`)
					.send({
						visibility: 'mutual-club-members',
						metadata: {
							discordAuthCode
						}
					})
				showNotification({
					title: 'Success!',
					autoClose: 5000,
					color: 'green',
					icon: <Check color="green" />,
					message: `This Twitter account is now linked!`
				})
				onModalClosed()
			} catch (e) {
				log.debug(e)
				showNotification({
					title: 'Verification failed',
					autoClose: 5000,
					color: 'red',
					icon: <AlertCircle />,
					message: `Please make sure your tweet was public and try again.`
				})
				onModalClosed()
				return
			}
		}

		if (isOpened && discordAuthCode && integrationId) {
			authenticateWithDiscord()
		}
	}, [discordAuthCode, integrationId, isOpened, onModalClosed, wallet])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				size={'50%'}
				overlayBlur={8}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						Connect your Discord account
					</Text>
				}
				withCloseButton={false}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={classes.stepsContainer}>
					<Space h={8} />
					<Text>Saving Discord information to your profile...</Text>
					<Space h={8} />

					<Loader variant="oval" color="red" />
				</div>
			</Modal>
		</>
	)
}
