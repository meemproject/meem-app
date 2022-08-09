import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Space,
	Center,
	Loader,
	Grid
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'
import { Identity } from '../../../../model/identity/identity'
import { ProfileLinkDiscordModal } from './ProfileLinkDiscordModal'
import { ProfileLinkEmailModal } from './ProfileLinkEmailModal'
import { ProfileLinkTwitterModal } from './ProfileLinkTwitterModal'

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 8,
			paddingTop: 16
		}
	},
	headerLeftItems: {
		display: 'flex',
		alignItems: 'center'
	},
	headerArrow: {
		marginRight: 32,
		marginTop: 6,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 16,
			marginLeft: 16
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 20
		}
	},
	buttonCreate: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		marginRight: 32
	},
	createClubLink: {
		marginTop: 24,
		a: {
			color: 'rgba(255, 102, 81, 1)',
			textDecoration: 'underline',
			fontWeight: 'bold'
		}
	},
	clubItem: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 24,
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},
	clubNameEllipsis: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},

	myClubsPrompt: { fontSize: 18, marginBottom: 16 }
}))

interface IProps {
	identity: Identity
}

export const ManageIdentityComponent: React.FC<IProps> = ({ identity }) => {
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	// Modal visibility
	const [isLinkedAccountModalOpen, setIsLinkedAccountModalOped] =
		useState(false)

	const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
	const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false)
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

	return (
		<>
			<Space h={30} />
			<Text>Manage identity here</Text>
			<ProfileLinkTwitterModal
				identity={identity}
				isOpened={isTwitterModalOpen}
				onSuccessfulVerification={() => {
					// TODO: Add to list of verified accounts locally
				}}
				onModalClosed={() => {
					setIsTwitterModalOpen(false)
				}}
			/>
			<ProfileLinkEmailModal
				identity={identity}
				isOpened={isEmailModalOpen}
				onSuccessfulVerification={() => {
					// TODO: Add to list of verified accounts locally
				}}
				onModalClosed={() => {
					setIsEmailModalOpen(false)
				}}
			/>
			<ProfileLinkDiscordModal
				identity={identity}
				isOpened={isDiscordModalOpen}
				onSuccessfulVerification={() => {
					// TODO: Add to list of verified accounts locally
				}}
				onModalClosed={() => {
					setIsDiscordModalOpen(false)
				}}
			/>
		</>
	)
}
