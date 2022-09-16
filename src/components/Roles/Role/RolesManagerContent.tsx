/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	createStyles,
	Text,
	Space,
	TextInput,
	Tabs,
	Button
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { ClubMember, ClubRole } from '../../../model/club/club'
import { RolesManagerMembers } from './RolesManagerMembers'
import { RolesManagerPermissions } from './RolesManagerPermissions'

const useStyles = createStyles(theme => ({
	row: {
		display: 'flex'
	},
	manageClubHeader: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	},

	buttonUpload: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	buttonSaveChangesInHeader: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	buttonSaveChanges: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
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
	textField: {
		maxWidth: 800
	},
	spacedRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
}))

interface IProps {
	club: Club
	initialRole?: ClubRole
}

export const RolesManagerContent: React.FC<IProps> = ({
	initialRole,
	club
}) => {
	const { classes } = useStyles()

	const [role, setRole] = useState<ClubRole>()
	const [roleName, setRoleName] = useState('')

	// Set initial role (updated later when changes are made in subcomponents)
	useEffect(() => {
		if (initialRole && !role) {
			setRole(initialRole)
			setRoleName(initialRole.name)
		}
	}, [initialRole, role])

	const updateRole = (newRole: ClubRole) => {
		setRole(newRole)
	}

	// Save any changes to the role
	const saveChanges = (clubMembers?: ClubMember[]) => {
		// TODO: Handle changes to club members
		// TODO
	}

	return (
		<>
			<div>
				<Space h={14} />
				<div className={classes.spacedRow}>
					<Text className={classes.manageClubHeader}>
						{role ? role.name : 'Add Role'}
					</Text>
					<Button className={classes.buttonSaveChanges}>
						Save Changes
					</Button>
				</div>

				<div className={classes.row}>
					<Text>Role Name</Text>
					<Space w={4} />
					<Text color={'red'}>*</Text>
				</div>
				<Space h={12} />
				<TextInput
					size={'lg'}
					radius={16}
					value={roleName}
					onChange={event => {
						if (event) {
							setRoleName(event.target.value)
						}
					}}
				/>
				<Space h={12} />

				<Tabs color="dark" defaultValue="permissions">
					<Tabs.List>
						<Tabs.Tab value="permissions">Permissions</Tabs.Tab>
						<Tabs.Tab value="members">Members</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="permissions" pt="xs">
						<RolesManagerPermissions
							role={role}
							onSaveChanges={saveChanges}
							onRoleUpdated={newRole => {
								updateRole(newRole)
							}}
						/>
					</Tabs.Panel>

					<Tabs.Panel value="members" pt="xs">
						<RolesManagerMembers
							role={role}
							club={club}
							onSaveChanges={members => {
								saveChanges(members)
							}}
						/>
					</Tabs.Panel>
				</Tabs>
			</div>

			<Space h={64} />
		</>
	)
}
