/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import { Text, Space, Switch, Divider, Button, Image } from '@mantine/core'
import { Discord } from 'iconoir-react'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import {
	CirclePlus,
	ExternalLink,
	Link,
	Lock,
	Settings
} from 'tabler-icons-react'
import { Club, ClubRole, ClubRolePermission } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'
import { RoleDiscordCloseTabModal } from './Modals/RoleDiscordCloseTabModal'
import { RoleDiscordConnectServerModal } from './Modals/RoleDiscordConnectServerModal'
import { RoleDiscordNewRoleModal } from './Modals/RoleDiscordNewRoleModal'
import { RoleDiscordSyncModal } from './Modals/RoleDiscordSyncModal'

interface IProps {
	role?: ClubRole
	club?: Club
	onSaveChanges: () => void
	onRoleUpdated: (role: ClubRole) => void
}

export const RolesManagerPermissions: React.FC<IProps> = ({
	role,
	club,
	onSaveChanges,
	onRoleUpdated
}) => {
	const { classes: styles } = useGlobalStyles()

	const [
		isRoleDiscordConnectModalOpened,
		setIsRoleDiscordConnectModalOpened
	] = useState(false)

	const [isRoleDiscordSyncModalOpened, setIsRoleDiscordSyncModalOpened] =
		useState(false)

	const [isRoleDiscordCreateModalOpened, setIsRoleDiscordCreateModalOpened] =
		useState(false)

	const [
		isRoleDiscordCloseTabModalOpened,
		setIsRoleDiscordCloseTabModalOpened
	] = useState(false)

	const [discordAccessToken, setDiscordAccessToken] = useState('')

	const startDiscordAuth = () => {
		const uri = encodeURIComponent(`${window.location.origin}/profile`)
		const scope = encodeURIComponent(`identify guilds`)
		Cookies.set('authForDiscordRole', 'true')
		Cookies.set('roleId', role ? role.id : '')
		Cookies.set('clubSlug', club && club.slug ? club.slug : '')
		setIsRoleDiscordCloseTabModalOpened(true)
		window.open(
			`https://discord.com/api/oauth2/authorize?client_id=967119580088660039&redirect_uri=${uri}&response_type=code&scope=${scope}`,
			'_self'
		)
	}
	useEffect(() => {
		if (Cookies.get('discordAccessToken')) {
			setDiscordAccessToken(Cookies.get('discordAccessToken') ?? '')
			log.debug(
				`discordAccessToken = ${Cookies.get('discordAccessToken')}`
			)
		}
	}, [])

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
				<div>
					<Text className={styles.tSectionTitle}>Discord Role</Text>
					<Space h={24} />

					<div className={styles.centeredRow}>
						<Image
							src={'/exampleclub.png'}
							height={48}
							width={48}
							radius={24}
						/>
						<Space w={16} />
						<div>
							<Text className={styles.tTitle}>MEEM</Text>
							<Text className={styles.tLink}>Disconnect</Text>
						</div>
					</div>
					<Space h={24} />

					<div
						className={styles.enabledClubIntegrationItem}
						style={{ width: 300 }}
					>
						<div className={styles.enabledIntHeaderBg} />
						<div className={styles.intItemHeader}>
							<Image
								src={`/integration-discord.png`}
								width={16}
								height={16}
								fit={'contain'}
							/>
							<Space w={8} />
							<Text>{`Admin role in Meem`}</Text>
						</div>
						<div
							style={{
								width: '100%'
							}}
						>
							<Space h={12} />
							<Divider />
						</div>
						<div className={styles.integrationActions}>
							<a onClick={() => {}}>
								<div className={styles.integrationAction}>
									<ExternalLink size={20} />
									<Space w={4} />
									<Text className={styles.tExtraSmall}>
										Launch Discord
									</Text>
								</div>
							</a>
							<Space w={4} />
							<Divider orientation="vertical" />
							<Space w={4} />

							<a onClick={() => {}}>
								<div className={styles.integrationAction}>
									<Settings size={20} />
									<Space w={4} />
									<Text className={styles.tExtraSmall}>
										Settings
									</Text>
								</div>
							</a>
						</div>
					</div>
					{!discordAccessToken && (
						<div>
							<Button
								className={styles.buttonWhite}
								leftIcon={<Discord />}
								onClick={() => {
									startDiscordAuth()
								}}
							>
								Connect Discord
							</Button>
							<Space h={32} />
						</div>
					)}
					{discordAccessToken && (
						<>
							<div>
								<Button
									className={styles.buttonWhite}
									leftIcon={<CirclePlus />}
									onClick={() => {
										setIsRoleDiscordCreateModalOpened(true)
									}}
								>
									Create New Discord Role
								</Button>
								<Space h={8} />
								<Button
									className={styles.buttonWhite}
									leftIcon={<Link />}
									onClick={() => {
										setIsRoleDiscordSyncModalOpened(true)
									}}
								>
									Sync Existing Discord Role
								</Button>
								<Space h={24} />
							</div>
						</>
					)}
				</div>

				<Button className={styles.buttonBlack} onClick={onSaveChanges}>
					Save Changes
				</Button>
			</div>

			{role && club && (
				<>
					<RoleDiscordConnectServerModal
						isOpened={isRoleDiscordConnectModalOpened}
						onModalClosed={() => {
							setIsRoleDiscordConnectModalOpened(false)
						}}
						role={role}
						club={club}
					/>
					<RoleDiscordSyncModal
						isOpened={isRoleDiscordSyncModalOpened}
						onModalClosed={() => {
							setIsRoleDiscordSyncModalOpened(false)
						}}
						role={role}
						club={club}
					/>
					<RoleDiscordNewRoleModal
						isOpened={isRoleDiscordCreateModalOpened}
						onModalClosed={() => {
							setIsRoleDiscordCreateModalOpened(false)
						}}
						role={role}
						club={club}
					/>
				</>
			)}

			<RoleDiscordCloseTabModal
				isOpened={isRoleDiscordCloseTabModalOpened}
				onModalClosed={() => {
					setIsRoleDiscordCloseTabModalOpened(false)
				}}
			/>

			<Space h={64} />
		</>
	)
}
