import {
	createStyles,
	Text,
	Space,
	Modal,
	Divider,
	Radio,
	Button
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { IdentityIntegration } from '../../../../model/identity/identity'

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
	},
	modalText: {
		fontSize: 16
	},
	modalQuestion: {
		fontSize: 14,
		fontWeight: 600
	}
}))

interface IProps {
	integration?: IdentityIntegration
	isOpened: boolean
	onModalClosed: () => void
}

export const ManageLinkedAccountModal: React.FC<IProps> = ({
	integration,
	isOpened,
	onModalClosed
}) => {
	const { classes } = useStyles()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [integrationVisibility, setIntegrationVisibility] = useState('')

	const saveChanges = async () => {
		setIsSavingChanges(true)
	}

	useEffect(() => {
		if (isOpened) {
			setIntegrationVisibility(integration?.visibility ?? 'anyone')
		}
	}, [integration?.visibility, isOpened])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={!isSavingChanges}
				radius={16}
				overlayBlur={8}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={
					<>
						{integration?.name === 'Twitter' && (
							<Text className={classes.modalTitle}>
								Twitter Settings
							</Text>
						)}
						{integration?.name === 'Discord' && (
							<Text className={classes.modalTitle}>
								Discord Settings
							</Text>
						)}
						{integration?.name === 'Email' && (
							<Text className={classes.modalTitle}>
								Email Address Settings
							</Text>
						)}
					</>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={classes.stepsContainer}>
					{integration?.name === 'Twitter' && (
						<Text className={classes.modalText}>
							{`You've successfully verified @${integration.metadata?.twitterUsername} as your Twitter username.`}
						</Text>
					)}
					{integration?.name === 'Discord' && (
						<Text className={classes.modalText}>
							{`You've successfully verified ${integration.metadata?.discordUsername} as your Discord username.`}
						</Text>
					)}
					{integration?.name === 'Email' && (
						<Text className={classes.modalText}>
							{`You've successfully verified ${integration.metadata?.emailAddress} as your email address.`}
						</Text>
					)}
					<Space h={24} />
					{(integration?.name === 'Twitter' ||
						integration?.name === 'Discord') && (
						<Text className={classes.modalQuestion}>
							{`Who can view this username?`}
						</Text>
					)}
					{integration?.name === 'Email' && (
						<Text className={classes.modalQuestion}>
							{`who can view this email address?`}
						</Text>
					)}
					<Radio.Group
						orientation="vertical"
						spacing={10}
						size="sm"
						color="dark"
						value={integrationVisibility}
						onChange={(value: any) => {
							setIntegrationVisibility(value)
						}}
						required
					>
						<Radio value="anyone" label="Anyone" />
						<Radio
							value="mutual-club-members"
							label="Mutual club members"
						/>
						<Radio value="just-me" label="Just me" />
					</Radio.Group>
					<Space h={24} />

					<Button
						className={classes.buttonConfirm}
						loading={isSavingChanges}
						onClick={() => {
							saveChanges()
						}}
					>
						Save Preferences
					</Button>
				</div>
			</Modal>
		</>
	)
}
