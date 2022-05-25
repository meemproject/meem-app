/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createStyles, Text, Image, Space } from '@mantine/core'
import React from 'react'
import { Club } from '../../model/club/club'

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
		alignItems: 'center',
		fontWeight: 600,
		marginBottom: 12,
		cursor: 'pointer',
		width: '100px'
	}
}))

interface IProps {
	club: Club
}

export const ClubAdminDappSettingsComponent: React.FC<IProps> = ({ club }) => {
	// General properties / tab management
	const { classes } = useStyles()

	// Integrations
	const handleTwitterIntegration = () => {}
	const handleDiscordIntegration = () => {}
	const handleGuildIntegration = () => {}
	const handleSliksafeIntegration = () => {}
	const handleTellieIntegration = () => {}
	const handleClarityIntegration = () => {}
	const handleGnosisIntegration = () => {}
	const handleMycoIntegration = () => {}
	const handleOrcaIntegration = () => {}

	return (
		<>
			<div>
				<Text className={classes.clubIntegrationsHeader}>Social</Text>
				<a onClick={handleTwitterIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-twitter.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Twitter</Text>
					</div>
				</a>
				<a onClick={handleDiscordIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-discord.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Discord</Text>
					</div>
				</a>
				<Text className={classes.clubIntegrationsHeader}>Token Gating</Text>
				<a onClick={handleGuildIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-guild.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Guild</Text>
					</div>
				</a>
				<a onClick={handleSliksafeIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-sliksafe.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Sliksafe</Text>
					</div>
				</a>
				<a onClick={handleTellieIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-tellie.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Tellie</Text>
					</div>
				</a>
				<a onClick={handleClarityIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-clarity.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Clarity</Text>
					</div>
				</a>
				<Text className={classes.clubIntegrationsHeader}>DAO Tools</Text>
				<a onClick={handleGnosisIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-gnosis.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Gnosis</Text>
					</div>
				</a>
				<a onClick={handleMycoIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-myco.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Myco</Text>
					</div>
				</a>
				<a onClick={handleOrcaIntegration}>
					<div className={classes.clubIntegrationItem}>
						<Image
							src="/integration-orca.png"
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={'xs'} />
						<Text>Orca</Text>
					</div>
				</a>
				<Space h="xl" />
			</div>
		</>
	)
}
