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
	Switch,
	RadioGroup,
	Radio
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import request from 'superagent'
import { Zeen } from '../../../../model/apps/zeen/zeen'
import { ZeenAdminChangesModal } from './ZeenAdminChangesModal'

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
	descriptionText: {
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
	},
	radio: { fontWeight: 600, fontFamily: 'Inter' }
}))

interface IProps {
	zeen: Zeen
}

enum WhoCanRead {
	Anyone,
	AllClubMembers,
	SpecificPeople
}

export const ZeenAdminAudienceSettings: React.FC<IProps> = ({ zeen }) => {
	// General properties / tab management
	const { classes } = useStyles()

	const router = useRouter()

	const navigateToPostCreate = () => {
		router.push({
			pathname: `/${zeen.clubSlug}/zeen/${zeen.slug}/newPost`
		})
	}

	const [whoCanRead, setWhoCanRead] = useState<WhoCanRead>(WhoCanRead.Anyone)
	const [zeenReadersString, setZeenReadersString] = useState('')
	const [zeenReaders, setZeenReaders] = useState<string[]>([])
	const [zeenEditorsString, setZeenEditorsString] = useState('')
	const [zeenEditors, setZeenEditors] = useState<string[]>([])

	const [newZeenData, setNewZeenData] = useState<Zeen>()
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const parseZeenEditors = (rawString: string) => {
		setZeenEditorsString(rawString)
		const editorsList = rawString.split('\n')
		const finalList: string[] = []
		editorsList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		log.debug(`zeen editors count = ${finalList.length + 1}`)
		setZeenEditors(finalList)
	}

	const parseZeenReaders = (rawString: string) => {
		setZeenEditorsString(rawString)
		const readersList = rawString.split('\n')
		const finalList: string[] = []
		readersList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		log.debug(`zeen editors count = ${finalList.length + 1}`)
		setZeenEditors(finalList)
	}

	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = () => {
		// Some basic validation
		// TODO: Validate the fields on this page

		// 'save changes' modal for executing zeen settings updates
		// convert current settings and update for the modal
		// TODO:
		const newZeen = zeen
		if (newZeen) {
			setNewZeenData(newZeen)
			setSaveChangesModalOpened(true)
		}
	}

	const saveChanges = () => {
		openSaveChangesModal()
	}

	return (
		<>
			<div>
				<Space h={30} />
				<Text
					className={classes.clubAppsSectionTitle}
				>{`Who can read your zeen?`}</Text>
				<Space h={16} />

				<RadioGroup
					classNames={{ label: classes.radio }}
					orientation="vertical"
					spacing={20}
					size="md"
					color="dark"
					value={
						whoCanRead === WhoCanRead.Anyone
							? 'anyone'
							: whoCanRead === WhoCanRead.AllClubMembers
							? 'all-club-members'
							: 'specific-people'
					}
					onChange={value => {
						switch (value) {
							case 'anyone':
								setWhoCanRead(WhoCanRead.Anyone)
								break
							case 'all-club-members':
								setWhoCanRead(WhoCanRead.AllClubMembers)
								break
							case 'specific-people':
								setWhoCanRead(WhoCanRead.SpecificPeople)
								break
						}
					}}
					required
				>
					<Radio
						value="anyone"
						label="Anyone with the link can read this zeen and any published posts."
					/>
					<Radio
						value="all-club-members"
						label="All club members can read this zeen and any published posts."
					/>
					<Radio
						value="specific-people"
						label="Only specific people can read this zeen and any published posts."
					/>
				</RadioGroup>
				{whoCanRead === WhoCanRead.SpecificPeople && (
					<>
						<Space h={24} />
						<Text className={classes.descriptionText}>
							Add a line break between each address
						</Text>
						<Space h={24} />

						<Textarea
							radius="lg"
							size="sm"
							value={zeenReadersString}
							minRows={10}
							onChange={event =>
								parseZeenReaders(event.currentTarget.value)
							}
						/>
						<Space h={8} />
					</>
				)}
				<Space h={48} />
				<Divider />
				<Space h={48} />
				<Text
					className={classes.clubAppsSectionTitle}
				>{`Who can edit your zeen?`}</Text>
				<div>
					<Text className={classes.clubAdminsInstructions}>
						Add a line break between each address. Note that at
						least one zeen editor is required at all times.
					</Text>
					<Textarea
						radius="lg"
						size="sm"
						value={zeenEditorsString}
						minRows={10}
						onChange={event =>
							parseZeenEditors(event.currentTarget.value)
						}
					/>
				</div>
				<Space h={24} />

				<Button
					className={classes.buttonSaveChanges}
					loading={isSavingChanges}
					onClick={saveChanges}
				>
					Save Changes
				</Button>
				<Space h={64} />
				<ZeenAdminChangesModal
					zeen={zeen}
					isOpened={isSaveChangesModalOpened}
					onModalClosed={() => {
						setIsSavingChanges(false)
						setSaveChangesModalOpened(false)
					}}
				/>
			</div>
		</>
	)
}
