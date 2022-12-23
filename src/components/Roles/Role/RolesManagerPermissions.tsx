/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text, Space, Switch, Divider, Button } from '@mantine/core'
import React from 'react'
import { Lock } from 'tabler-icons-react'
import {
	Agreement,
	AgreementRole,
	AgreementRolePermission
} from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/MeemTheme'

interface IProps {
	role?: AgreementRole
	agreement?: Agreement
	onSaveChanges: () => void
	onRoleUpdated: (role: AgreementRole) => void
}

export const RolesManagerPermissions: React.FC<IProps> = ({
	role,
	onSaveChanges,
	onRoleUpdated
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const permissionItem = (permission: AgreementRolePermission) => (
		<div key={permission.id}>
			<Space h={4} />
			<div className={meemTheme.centeredRow}>
				<Switch
					disabled={permission.locked}
					checked={permission.enabled}
					label={permission.name}
					onChange={value => {
						if (value && role) {
							const newPermissions = [...role.permissions]
							newPermissions.forEach(perm => {
								if (perm.id === permission.id) {
									perm.enabled = value.currentTarget.checked
								}
							})

							// TODO: there's got to be a better way to update a single element of an object and
							// TODO: have it apply to useState, instead of recreating the entire object. surely?
							const newRole: AgreementRole = {
								name: role.name,
								id: role.id,
								permissions: newPermissions,
								isTransferrable: role.isTransferrable,
								isAdminRole: role.isAdminRole,
								rolesExtensionData: role.rolesExtensionData,
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
				<Space w={8} />
				{permission.locked && (
					<Lock size={16} style={{ marginTop: 12 }} />
				)}
			</div>
			<Space h={16} />
			<Divider />
		</div>
	)

	return (
		<>
			<div>
				<Space h={24} />
				<Text className={meemTheme.tExtraSmallLabel}>
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
				<Text className={meemTheme.tExtraSmallLabel}>
					{`Agreement Permissions`.toUpperCase()}
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
				<Space h={40} />

				<Button
					className={meemTheme.buttonBlack}
					onClick={onSaveChanges}
				>
					Save Changes
				</Button>
			</div>

			<Space h={64} />
		</>
	)
}
