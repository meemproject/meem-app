import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Button,
	Center,
	Loader,
	TextInput,
	Select,
	// Bug in mantine imports here
	// eslint-disable-next-line import/named
	SelectItemProps,
	// eslint-disable-next-line import/named
	MantineColor
} from '@mantine/core'
import React, { forwardRef, useEffect, useState } from 'react'
import { Club, ClubRole } from '../../../../model/club/club'

const useStyles = createStyles(theme => ({
	row: { display: 'flex' },
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
	},
	fullWidthTextInput: {
		width: '100%'
	},
	clickable: {
		cursor: 'pointer'
	},
	buttonModalSave: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	buttonModalCancel: {
		marginLeft: 8,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	memberItemRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	memberDataRow: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	separatedRow: {
		display: 'flex',
		justifyContent: 'space-between'
	}
}))

interface IProps {
	club: Club
	role: ClubRole
	isOpened: boolean
	onModalClosed: () => void
}

interface DiscordRole extends SelectItemProps {
	value: string
	label: string
	memberCount: number
}

export const RoleDiscordSyncModal: React.FC<IProps> = ({
	club,
	role,
	isOpened,
	onModalClosed
}) => {
	const { classes } = useStyles()

	const [discordRoles, setDiscordRoles] = useState<DiscordRole[]>()

	const [selectedDiscordRole, setSelectedDiscordRole] =
		useState<DiscordRole>()

	const [isFetchingDiscordRoles, setIsFetchingDiscordRoles] = useState(true)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	useEffect(() => {
		async function fetchDiscordRoles() {
			setDiscordRoles([
				{
					value: 'role1',
					label: 'Insider',
					memberCount: 3
				},
				{
					value: 'role2',
					label: 'Member',
					memberCount: 10
				},
				{
					value: 'role3',
					label: 'Guest',
					memberCount: 5
				}
			])
			setIsFetchingDiscordRoles(false)
		}

		if (isOpened && !discordRoles) {
			fetchDiscordRoles()
		}
	}, [discordRoles, isFetchingDiscordRoles, isOpened])

	const saveChanges = () => {
		setIsSavingChanges(true)
	}

	// eslint-disable-next-line react/display-name
	const SelectItem = forwardRef<HTMLDivElement, DiscordRole>(
		({ label, value, memberCount, ...others }: DiscordRole, ref) => (
			<div ref={ref} {...others} key={value}>
				<div className={classes.separatedRow}>
					<Text>{label}</Text>
					<Text>{`${memberCount} members`}</Text>
				</div>
			</div>
		)
	)

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={false}
				radius={16}
				overlayBlur={8}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						Sync Existing Discord Role
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{!discordRoles && isFetchingDiscordRoles && (
					<>
						<Center>
							<Loader />
						</Center>
					</>
				)}
				{!discordRoles && !isFetchingDiscordRoles && (
					<>
						<Center>
							<Text>
								Sorry - unable to load Discord Roles. Try again
								later.
							</Text>
							<Space h={16} />
							<Button
								onClick={() => {
									onModalClosed()
								}}
								className={classes.buttonModalCancel}
							>
								Close
							</Button>
						</Center>
					</>
				)}
				{discordRoles && !isFetchingDiscordRoles && (
					<>
						<Select
							placeholder="Select a role"
							itemComponent={SelectItem}
							onChange={value => {
								if (value != null && discordRoles) {
									discordRoles.forEach(dRole => {
										if (dRole.value === value) {
											setSelectedDiscordRole(dRole)
										}
									})
								}
							}}
							data={discordRoles ?? []}
						/>
						<Space h={32} />

						<div className={classes.row}>
							<Button
								className={classes.buttonModalSave}
								onClick={async () => {
									saveChanges()
								}}
							>
								{'Save Changes'}
							</Button>
							<Space w={8} />
							<Button
								onClick={() => {
									onModalClosed()
								}}
								className={classes.buttonModalCancel}
							>
								Cancel
							</Button>
						</div>
					</>
				)}
			</Modal>
		</>
	)
}
