/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@apollo/client'
import {
	Text,
	Space,
	TextInput,
	Tabs,
	Button,
	Loader,
	Center
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import { GetAvailablePermissionQuery } from '../../../../generated/graphql'
import { GET_AVAILABLE_PERMISSIONS } from '../../../graphql/clubs'
import {
	Club,
	ClubMember,
	ClubRole,
	ClubRolePermission
} from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'
import { RoleManagerChangesModal } from './Modals/RoleManagerChangesModal'
import { RolesManagerMembers } from './RolesManagerMembers'
import { RolesManagerPermissions } from './RolesManagerPermissions'
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
	const { classes: styles } = useGlobalStyles()

	const [role, setRole] = useState<ClubRole>()
	const [roleMembers, setRoleMembers] = useState<ClubMember[]>([])

	const [isLoadingPermissions, setIsLoadingPermissons] = useState(false)
	const [isExistingRole, setIsExistingRole] = useState(false)
	const [roleName, setRoleName] = useState('')

	const [isSaveChangesModalOpened, setIsSaveChangesModalOpened] =
		useState(false)

	const { data: availablePermissions } =
		useQuery<GetAvailablePermissionQuery>(GET_AVAILABLE_PERMISSIONS)

	// Set initial role + parse permissions (updated later when changes are made in subcomponents)
	useEffect(() => {
		async function parsePermissions(
			theRole: ClubRole,
			allPermissions: GetAvailablePermissionQuery
		) {
			const permissionedRole = theRole

			// This is a new role, set default permissions
			if (permissionedRole.id === 'addRole') {
				setIsExistingRole(false)

				const convertedPermissions: ClubRolePermission[] = []
				if (allPermissions.RolePermissions) {
					allPermissions.RolePermissions.forEach(permission => {
						const convertedPermission: ClubRolePermission = {
							id: permission.id,
							description: permission.description,
							name: permission.name,
							enabled: false,
							locked: !club.isClubAdmin
						}
						convertedPermissions.push(convertedPermission)
					})
				}
				permissionedRole.permissions = convertedPermissions
				setRoleMembers([])
			} else {
				// This is an existing role, determine what permissions are enabled
				// by looking at the permissions added at the club level and reconciling
				// them with the avilable permissions
				setIsExistingRole(true)

				const convertedPermissions: ClubRolePermission[] = []
				if (allPermissions.RolePermissions) {
					allPermissions.RolePermissions.forEach(permission => {
						let isPermissionEnabled = false
						if (club && club.roles) {
							club.roles.forEach(clubRole => {
								if (clubRole.id === theRole.id) {
									clubRole.permissions.forEach(rp => {
										if (rp.id === permission.id) {
											isPermissionEnabled = true
										}
									})
								}
							})
						}

						const convertedPermission: ClubRolePermission = {
							id: permission.id,
							description: permission.description,
							name: permission.name,
							enabled: isPermissionEnabled,
							locked: !club.isClubAdmin
						}
						convertedPermissions.push(convertedPermission)
					})
				}
				permissionedRole.permissions = convertedPermissions
			}

			setIsLoadingPermissons(false)

			// Role name
			setRoleName(permissionedRole.name)

			// Any existing role members
			const initialRoleMembers: ClubMember[] | undefined =
				club.memberRolesMap
					? club.memberRolesMap.get(permissionedRole.id)
					: []
			if (initialRoleMembers) {
				setRoleMembers(initialRoleMembers)
			}

			// Set the role itself
			setRole(permissionedRole)
		}
		if (initialRole && !role && availablePermissions) {
			parsePermissions(initialRole, availablePermissions)
		}
	}, [availablePermissions, club, initialRole, role])

	const updateRole = (newRole: ClubRole) => {
		setRole(newRole)
		onRoleUpdated(newRole)
	}

	// Save any changes to the role
	const saveChanges = (clubMembers?: ClubMember[]) => {
		if (!clubMembers || clubMembers.length === 0) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: `Please add at least one member to this role!`
			})
			return
		}

		// Save process
		// 1. Open modal
		// 2. Save changes
		// 3. When change detected, refresh the page, ideally to where the previous tab was
		if (clubMembers) {
			setRoleMembers(clubMembers)
		}
		setIsSaveChangesModalOpened(true)
	}

	return (
		<>
			<div>
				<Space h={14} />
				<div className={styles.spacedRow} style={{ marginBottom: 32 }}>
					<Text className={styles.tSectionTitle}>
						{role && role.name.length > 0 ? role.name : 'Add Role'}
					</Text>
					<Button
						onClick={() => {
							saveChanges(roleMembers)
						}}
						className={styles.buttonBlack}
					>
						Save Changes
					</Button>
				</div>

				<div className={styles.row}>
					<Text className={styles.tSectionTitleSmall}>ROLE NAME</Text>
					<Space w={2} />
					<Text color={'red'}>*</Text>
				</div>
				<Space h={12} />
				<TextInput
					size={'lg'}
					radius={20}
					classNames={{
						input: styles.fTextField
					}}
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
						<Tabs.Tab
							style={{ fontWeight: 700 }}
							value="permissions"
						>
							Permissions
						</Tabs.Tab>
						<Tabs.Tab style={{ fontWeight: 700 }} value="members">
							Members
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="permissions" pt="xs">
						{!isLoadingPermissions && (
							<RolesManagerPermissions
								role={role}
								onSaveChanges={() => {
									saveChanges(roleMembers)
								}}
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
							onMembersUpdated={members => {
								setRoleMembers(members)
							}}
							onSaveChanges={() => {
								saveChanges()
							}}
						/>
					</Tabs.Panel>
				</Tabs>
			</div>

			<RoleManagerChangesModal
				isOpened={isSaveChangesModalOpened}
				onModalClosed={() => {
					setIsSaveChangesModalOpened(false)
				}}
				role={role}
				isExistingRole={isExistingRole}
				roleMembers={roleMembers}
				club={club}
			/>

			<Space h={64} />
		</>
	)
}
