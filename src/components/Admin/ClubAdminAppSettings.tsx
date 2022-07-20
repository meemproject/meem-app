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
	clubAppsSectionTitle: {
		fontSize: 18,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
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
	},
	row: {
		display: 'flex',
		flexDirection: 'row'
	},
	newText: {
		color: 'rgba(255, 102, 81, 1)',
		fontSize: 14,
		fontWeight: 600,
		marginLeft: 8,
		marginTop: 4,
		letterSpacing: 1.3
	},
	appDescriptionText: {
		opacity: 0.6
	},
	zeenCreateButton: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		width: 256,
		marginBottom: 12,
		cursor: 'pointer',
		color: 'rgba(255, 102, 81, 1)',
		border: '1px solid rgba(255, 102, 81, 0.3)',
		backgroundColor: 'rgba(255, 102, 81, 0.1)',
		borderRadius: 16,
		padding: 24
	}
}))

interface IProps {
	club: Club
}

export const ClubAdminAppsSettingsComponent: React.FC<IProps> = ({ club }) => {
	// General properties / tab management
	const { classes } = useStyles()

	const router = useRouter()

	const navigateToZeenCreate = () => {
		router.push({
			pathname: `/${club.slug}/zeen/create`
		})
	}

	return (
		<>
			<div>
				<Space h={30} />
				<div className={classes.row}>
					<Text
						className={classes.clubAppsSectionTitle}
					>{`Zeen`}</Text>
					<Text className={classes.newText}>NEW!</Text>
				</div>
				<Space h={16} />
				<Text className={classes.appDescriptionText}>
					Meet Zeen, a decentralized newsletter for your club.
					Collaborate with editors, manage subscribers and spark
					conversations that matter with your members.
				</Text>
				<Space h={32} />

				<Text
					onClick={() => {
						navigateToZeenCreate()
					}}
					className={classes.zeenCreateButton}
				>
					+ Create a zeen
				</Text>
			</div>
		</>
	)
}
