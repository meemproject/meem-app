/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text, Space, Switch, Divider, Button } from '@mantine/core'
import React from 'react'
import { Lock } from 'tabler-icons-react'
import { Club, ClubRole, ClubRolePermission } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'

interface IProps {
	role?: ClubRole
	club?: Club
	onSaveChanges: () => void
	onRoleUpdated: (role: ClubRole) => void
}

export const RolesManagerPermissions: React.FC<IProps> = ({
	role,
	onSaveChanges,
	onRoleUpdated
}) => {
	const { classes: design } = useGlobalStyles()

	const permissionItem = (permission: ClubRolePermission) => (
		<div key={permission.id}>
			<Space h={16} />
			<div className={design.spacedRow}>
				<Text>{permission.name}</Text>
				<div className={design.centeredRow}>
					{permission.locked && <Lock />}
					<Space w={4} />
					<Switch
						disabled={permission.locked}
						checked={permission.enabled}
						onChange={value => {
							if (value && role) {
								const newPermissions = [...role.permissions]
								newPermissions.forEach(perm => {
									if (perm.id === permission.id) {
										perm.enabled =
											value.currentTarget.checked
									}
								})

								// TODO: there's got to be a better way to update a single element of an object and
								// TODO: have it apply to useState, instead of recreating the entire object. surely?
								const newRole: ClubRole = {
									name: role.name,
									id: role.id,
									permissions: newPermissions,
									isTransferrable: role.isTransferrable,
									isAdminRole: role.isAdminRole,
									isDefaultRole: role.isDefaultRole,
									rolesIntegrationData:
										role.rolesIntegrationData,
									guildDiscordServerId:
										role.guildDiscordServerId ?? '',
									guildDiscordServerIcon:
										role.guildDiscordServerIcon ?? '',
									guildDiscordServerName:
										role.guildDiscordServerName ?? '',
									guildRoleId: role.guildRoleId ?? '',
									guildRoleName: role.guildRoleName ?? ''
								}
								onRoleUpdated(newRole)
							}
						}}
					/>
				</div>
			</div>
			<Space h={16} />
			<Divider />
		</div>
	)

	return (
		<>
			<div>
				<Space h={14} />
				<Text className={design.tSectionTitle}>{`Permissions`}</Text>
				<Space h={32} />
				<Text className={design.tSectionTitleSmall}>
					{`Contract Permissions (Admin Only)`.toUpperCase()}
				</Text>
				<Space h={8} />
				{role && role.permissions && (
					<>
						{role?.permissions
							.filter(permission =>
								permission.id.includes('admin')
							)
							.map(permission => permissionItem(permission))}
					</>
				)}
				<Space h={32} />
				<Text className={design.tSectionTitleSmall}>
					{`Club Permissions`.toUpperCase()}
				</Text>
				<Space h={8} />

				{role && role.permissions && (
					<>
						{role?.permissions
							.filter(
								permission => !permission.id.includes('admin')
							)
							.map(permission => permissionItem(permission))}
					</>
				)}
				<Space h={32} />

				<Button className={design.buttonBlack} onClick={onSaveChanges}>
					Save Changes
				</Button>
			</div>

			<Space h={64} />
		</>
	)
}
