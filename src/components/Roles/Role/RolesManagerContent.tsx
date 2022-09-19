/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	TextInput,
	Tabs,
	Button,
	Loader,
	Center
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import {
	Club,
	ClubMember,
	ClubRole,
	ClubRolePermission
} from '../../../model/club/club'
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
	onRoleUpdated: (role: ClubRole) => void
}

export const RolesManagerContent: React.FC<IProps> = ({
	initialRole,
	club,
	onRoleUpdated
}) => {
	const { classes } = useStyles()

	const [role, setRole] = useState<ClubRole>()

	const [isLoadingPermissions, setIsLoadingPermissons] = useState(false)
	const [roleName, setRoleName] = useState('')

	// Set initial role (updated later when changes are made in subcomponents)
	useEffect(() => {
		async function fetchPermissions(theRole: ClubRole) {
			log.debug('fetched permissions for new role')
			const permissionedRole = theRole
			// TODO: Fetch permissions here
			const fetchedPermissions = [
				{
					id: 'membership',
					name: 'Manage membership settings',
					locked: false,
					enabled: false
				},
				{
					id: 'manage-roles',
					name: 'Manage roles',
					locked: false,
					enabled: false
				},
				{
					id: 'edit-profile',
					name: 'Edit profile',
					locked: false,
					enabled: false
				},
				{
					id: 'manage-apps',
					name: 'Manage apps',
					locked: false,
					enabled: false
				},
				{
					id: 'view-apps',
					name: 'View apps',
					locked: false,
					enabled: false
				}
			]
			permissionedRole.permissions = fetchedPermissions
			setIsLoadingPermissons(false)
			setRole(permissionedRole)
		}
		if (initialRole && !role) {
			if (initialRole.permissions.length === 0) {
				// If this is a new role, fetch the current available permissions from DB
				setIsLoadingPermissons(true)
				fetchPermissions(initialRole)
				setRoleName(initialRole.name)
			} else {
				// Otherise, we can leave things as they are
				setIsLoadingPermissons(false)
				setRole(initialRole)
				setRoleName(initialRole.name)
			}
		}
	}, [initialRole, role])

	const updateRole = (newRole: ClubRole) => {
		setRole(newRole)
		onRoleUpdated(newRole)
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
						{role && role.name.length > 0 ? role.name : 'Add Role'}
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
							if (event.target.value) {
								const newRole: ClubRole = {
									name: event.target.value,
									id: role ? role.id : '',
									permissions: role ? role.permissions : []
								}
								updateRole(newRole)
							}
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
						{!isLoadingPermissions && (
							<RolesManagerPermissions
								role={role}
								onSaveChanges={saveChanges}
								onRoleUpdated={newRole => {
									updateRole(newRole)
								}}
							/>
						)}
						{isLoadingPermissions && (
							<Center>
								<Loader />
							</Center>
						)}
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
