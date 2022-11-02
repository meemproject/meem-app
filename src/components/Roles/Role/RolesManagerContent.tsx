/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Space,
	TextInput,
	Image,
	Tabs,
	Button,
	Loader,
	Center,
	Divider,
	Radio
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { GetAvailablePermissionQuery } from '../../../../generated/graphql'
import { GET_AVAILABLE_PERMISSIONS } from '../../../graphql/clubs'
import {
	Club,
	ClubMember,
	ClubRole,
	ClubRolePermission
} from '../../../model/club/club'
import { useCustomApollo } from '../../../providers/ApolloProvider'
import { useGlobalStyles } from '../../Styles/GlobalStyles'
import { RoleManagerChangesModal } from './Modals/RoleManagerChangesModal'
import { RolesManagerDiscordIntegration } from './RolesManagerDiscordIntegration'
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

	const [isLoadingPermissions, setIsLoadingPermissons] = useState(true)
	const [isExistingRole, setIsExistingRole] = useState(false)
	const [roleName, setRoleName] = useState('')

	const [isTokenTransferrable, setIsTokenTransferrable] =
		useState('non-transferrable')

	const { anonClient } = useCustomApollo()

	const [isSaveChangesModalOpened, setIsSaveChangesModalOpened] =
		useState(false)

	const { data: availablePermissions, error } =
		useQuery<GetAvailablePermissionQuery>(GET_AVAILABLE_PERMISSIONS, {
			client: anonClient
		})

	// Set initial role + parse permissions (updated later when changes are made in subcomponents)
	useEffect(() => {
		if (error) {
			log.debug(JSON.stringify(error))
		}

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
							locked: permission.id.includes('admin')
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
							locked: permission.id.includes('admin')
						}
						convertedPermissions.push(convertedPermission)
					})
				}
				permissionedRole.permissions = convertedPermissions
			}

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

			// Stop loading
			setIsLoadingPermissons(false)
		}
		if (initialRole && !role && availablePermissions) {
			parsePermissions(initialRole, availablePermissions)
		}

		// Set 'token transferrable' setting
		if (role?.isTransferrable) {
			setIsTokenTransferrable('transferrable')
		}
	}, [availablePermissions, club, error, initialRole, role])

	const updateRole = (newRole: ClubRole) => {
		setRole(newRole)
		onRoleUpdated(newRole)
	}

	// Save any changes to the role
	const saveChanges = () => {
		if (!roleMembers || roleMembers.length === 0) {
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
		setIsSaveChangesModalOpened(true)
	}

	return (
		<>
			{isLoadingPermissions && (
				<div>
					<Loader variant="oval" color="red" />
				</div>
			)}

			{!isLoadingPermissions && (
				<div>
					<Space h={14} />
					<div
						className={styles.spacedRow}
						style={{ marginBottom: 32 }}
					>
						<Text className={styles.tSectionTitle}>
							{role && role.name.length > 0
								? role.name
								: 'Add Role'}
						</Text>
						<Button
							onClick={() => {
								saveChanges()
							}}
							className={styles.buttonBlack}
						>
							Save Changes
						</Button>
					</div>

					<div className={styles.row}>
						<Text className={styles.tSectionTitleSmall}>
							ROLE NAME
						</Text>
						<Space w={2} />
						<Text color={'red'}>*</Text>
					</div>
					<Space h={24} />
					<TextInput
						size={'lg'}
						radius={20}
						disabled={role?.isDefaultRole}
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
										permissions: role
											? role.permissions
											: []
									}
									updateRole(newRole)
								}
							}
						}}
					/>
					<Space h={40} />

					{role?.id !== 'addRole' && (
						<div>
							{role?.tokenAddress && (
								<div>
									<Text className={styles.tSectionTitleSmall}>
										CONTRACT ADDRESS
									</Text>

									<Space h={24} />

									<div className={styles.row}>
										<Text
											style={{ wordBreak: 'break-word' }}
										>
											{role?.tokenAddress}
										</Text>
										<Image
											style={{
												marginLeft: 4,
												padding: 2,
												cursor: 'pointer'
											}}
											src="/copy.png"
											height={20}
											onClick={() => {
												navigator.clipboard.writeText(
													club.address ?? ''
												)
												showNotification({
													radius: 'lg',
													title: 'Address copied',
													autoClose: 2000,
													color: 'green',
													icon: <Check />,

													message: `This role's contract address was copied to your clipboard.`
												})
											}}
											width={20}
										/>
									</div>

									<Space h={40} />

									<Text className={styles.tSectionTitleSmall}>
										TOKEN SETTINGS
									</Text>
									<Space h={24} />

									{role?.isDefaultRole && role?.isAdminRole && (
										<div>
											<Text>
												{`This is a default role and is currently the only
							role that has contract management capabilities.`}
											</Text>
											<Text>{`The
							role cannot be deleted and members with this role
							cannot transfer their token to another wallet.`}</Text>
										</div>
									)}

									{role?.isDefaultRole && !role?.isAdminRole && (
										<div>
											<Text>
												{`This is a default role that’s automatically assigned
							to club members who have connected a wallet.`}
											</Text>
											<Text>{`The
							role cannot be deleted and members with this role
							cannot transfer their token to another wallet.`}</Text>
										</div>
									)}

									{!role?.isDefaultRole && (
										<div>
											<Text
												className={styles.tBold}
											>{`Can members with this role transfer their token to another wallet?`}</Text>
											<Space h={4} />

											<Radio.Group
												orientation="vertical"
												spacing={10}
												size="sm"
												color="dark"
												value={isTokenTransferrable}
												onChange={(value: any) => {
													setIsTokenTransferrable(
														value
													)

													// Update the role's state in this component and all subcomponents
													// TODO: there's got to be a better way to update a single element of an object and
													// TODO: have it apply to useState, instead of recreating the entire object. surely?
													const newRole: ClubRole = {
														name: role?.name ?? '',
														id: role?.id ?? '',
														permissions:
															role?.permissions ??
															[],
														isTransferrable:
															isTokenTransferrable ===
															'transferrable',
														isAdminRole:
															role?.isAdminRole,
														isDefaultRole:
															role?.isDefaultRole,
														rolesIntegrationData:
															role?.rolesIntegrationData,
														guildDiscordServerId:
															role?.guildDiscordServerId ??
															'',
														guildDiscordServerIcon:
															role?.guildDiscordServerIcon ??
															'',
														guildDiscordServerName:
															role?.guildDiscordServerName ??
															'',
														guildRoleId:
															role?.guildRoleId ??
															'',
														guildRoleName:
															role?.guildRoleName ??
															''
													}
													updateRole(newRole)
												}}
												required
											>
												<Radio
													value="non-transferrable"
													label="No, this role cannot be transferred"
												/>
												<Radio
													value="transferrable"
													label="Yes, this role can be transferred to someone else"
												/>
											</Radio.Group>
										</div>
									)}

									<Space h={40} />
								</div>
							)}

							<RolesManagerDiscordIntegration
								club={club}
								role={role}
							/>

							<Divider />

							<Space h={40} />
						</div>
					)}

					<Tabs color="dark" defaultValue="permissions">
						<Tabs.List>
							<Tabs.Tab
								style={{ fontWeight: 700 }}
								value="permissions"
							>
								Permissions
							</Tabs.Tab>
							<Tabs.Tab
								style={{ fontWeight: 700 }}
								value="members"
							>
								Members
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="permissions" pt="xs">
							{!isLoadingPermissions && (
								<RolesManagerPermissions
									role={role}
									club={club}
									onSaveChanges={() => {
										saveChanges()
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
									log.debug(
										`on members updated - members length = ${members.length}`
									)
									setRoleMembers(members)
								}}
								onSaveChanges={() => {
									saveChanges()
								}}
							/>
						</Tabs.Panel>
					</Tabs>
				</div>
			)}

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
