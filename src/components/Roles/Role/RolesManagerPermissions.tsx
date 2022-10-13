/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text, Space, Switch, Divider, Button } from '@mantine/core'
import React from 'react'
import { Lock } from 'tabler-icons-react'
import { ClubRole, ClubRolePermission } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'

interface IProps {
	role?: ClubRole
	onSaveChanges: () => void
	onRoleUpdated: (role: ClubRole) => void
}

export const RolesManagerPermissions: React.FC<IProps> = ({
	role,
	onSaveChanges,
	onRoleUpdated
}) => {
	const { classes: styles } = useGlobalStyles()

	// const [isRoleDiscordSyncModalOpened, setIsRoleDiscordSyncModalOpened] =
	// 	useState(false)

	// const [isRoleDiscordCreateModalOpened, setIsRoleDiscordCreateModalOpened] =
	// 	useState(false)

	const permissionItem = (permission: ClubRolePermission) => (
		<div key={permission.id}>
			<Space h={16} />
			<div className={styles.spacedRow}>
				<Text>{permission.name}</Text>
				<div className={styles.centeredRow}>
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
								const newRole: ClubRole = {
									name: role.name,
									id: role.id,
									permissions: newPermissions
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
				<Text className={styles.tSectionTitle}>{`Permissions`}</Text>
				<Space h={32} />
				<Text className={styles.tSectionTitleSmall}>
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
				<Text className={styles.tSectionTitleSmall}>
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
				{/* <div>
					<Text className={classes.manageClubHeader}>
						Discord Role
					</Text>
					<div className={classes.rowCentered}>
						<Image
							src={'/exampleclub.png'}
							height={48}
							width={48}
							radius={24}
						/>
						<Space w={12} />
						<div>
							<Text className={classes.discordServerNameText}>
								MEEM
							</Text>
							<Text className={classes.discordServerSettingsLink}>
								Server Settings
							</Text>
						</div>
					</div>
					<Space h={24} />

					<Button
						className={classes.outlineButton}
						leftIcon={<Discord />}
					>
						Connect Discord
					</Button>
					<Space h={8} />
					<Button
						className={classes.outlineButton}
						leftIcon={<CirclePlus />}
					>
						Create New Discord Role
					</Button>
					<Space h={8} />
					<Button
						className={classes.outlineButton}
						leftIcon={<Link />}
						onClick={() => {
							setIsRoleDiscordSyncModalOpened(true)
						}}
					>
						Sync Existing Discord Role
					</Button>
					<Space h={24} />
				</div> */}

				<Button className={styles.buttonBlack} onClick={onSaveChanges}>
					Save Changes
				</Button>
			</div>

			{/* {role && club && (
				<RoleDiscordSyncModal
					isOpened={isRoleDiscordSyncModalOpened}
					onModalClosed={() => {
						setIsRoleDiscordSyncModalOpened(false)
					}}
					role={role}
					club={club}
				/>
			)} */}

			<Space h={64} />
		</>
	)
}
