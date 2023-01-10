/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
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
	Radio
} from '@mantine/core'
import { useMeemApollo } from '@meemproject/react'
import React, { useEffect, useState } from 'react'
import { GetAvailablePermissionQuery } from '../../../../generated/graphql'
import { GET_AVAILABLE_PERMISSIONS } from '../../../graphql/agreements'
import {
	Agreement,
	AgreementMember,
	AgreementRole,
	AgreementRolePermission
} from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { RoleManagerChangesModal } from './Modals/RoleManagerChangesModal'
import { RolesManagerMembers } from './RolesManagerMembers'
import { RolesManagerPermissions } from './RolesManagerPermissions'
interface IProps {
	agreement: Agreement
	initialRole?: AgreementRole
	onRoleUpdated: (role: AgreementRole) => void
}

export const RolesManagerContent: React.FC<IProps> = ({
	initialRole,
	agreement,
	onRoleUpdated
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const [role, setRole] = useState<AgreementRole>()
	const [roleMembers, setRoleMembers] = useState<AgreementMember[]>([])

	const [isLoadingPermissions, setIsLoadingPermissons] = useState(true)
	const [isExistingRole, setIsExistingRole] = useState(false)
	const [roleName, setRoleName] = useState('')

	const [isTokenTransferrable, setIsTokenTransferrable] =
		useState('non-transferrable')

	const { anonClient } = useMeemApollo()

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
			theRole: AgreementRole,
			allPermissions: GetAvailablePermissionQuery
		) {
			const permissionedRole = theRole

			// This is a new role, set default permissions
			if (permissionedRole.id === 'addRole') {
				setIsExistingRole(false)

				const convertedPermissions: AgreementRolePermission[] = []
				if (allPermissions.RolePermissions) {
					allPermissions.RolePermissions.forEach(permission => {
						const convertedPermission: AgreementRolePermission = {
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
				// by looking at the permissions added at the agreement level and reconciling
				// them with the avilable permissions
				setIsExistingRole(true)

				const convertedPermissions: AgreementRolePermission[] = []
				if (allPermissions.RolePermissions) {
					allPermissions.RolePermissions.forEach(permission => {
						let isPermissionEnabled = false
						if (agreement && agreement.roles) {
							agreement.roles.forEach(agreementRole => {
								if (agreementRole.id === theRole.id) {
									agreementRole.permissions.forEach(rp => {
										if (rp.id === permission.id) {
											isPermissionEnabled = true
										}
									})
								}
							})
						}

						const convertedPermission: AgreementRolePermission = {
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
			const initialRoleMembers: AgreementMember[] | undefined =
				agreement.memberRolesMap
					? agreement.memberRolesMap.get(permissionedRole.id)
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
	}, [availablePermissions, agreement, error, initialRole, role])

	const updateRole = (newRole: AgreementRole) => {
		setRole(newRole)
		onRoleUpdated(newRole)
	}

	// Save any changes to the role
	const saveChanges = () => {
		if (!roleMembers || roleMembers.length === 0) {
			showErrorNotification(
				'Oops!',
				`Please add at least one member to this role!`
			)
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
					<Loader variant="oval" color="blue" />
				</div>
			)}

			{!isLoadingPermissions && (
				<div>
					<Space h={16} />
					<div
						className={meemTheme.spacedRow}
						style={{ marginBottom: 32 }}
					>
						<Text className={meemTheme.tLargeBold}>
							{role && role.name.length > 0
								? role.name
								: 'Add Role'}
						</Text>
						<Button
							onClick={() => {
								saveChanges()
							}}
							className={meemTheme.buttonBlack}
						>
							Save Changes
						</Button>
					</div>

					<div className={meemTheme.row}>
						<Text className={meemTheme.tExtraSmallLabel}>
							ROLE NAME
						</Text>
						<Space w={2} />
						<Text color={'blue'}>*</Text>
					</div>
					<Space h={24} />
					<TextInput
						size={'lg'}
						radius={20}
						disabled={role?.isAdminRole}
						classNames={{
							input: meemTheme.fTextField
						}}
						value={roleName}
						onChange={event => {
							if (event) {
								setRoleName(event.target.value)
								if (event.target.value) {
									const newRole: AgreementRole = {
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
									<Text
										className={meemTheme.tExtraSmallLabel}
									>
										CONTRACT ADDRESS
									</Text>

									<Space h={24} />

									<div className={meemTheme.row}>
										<Text
											className={meemTheme.tSmall}
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
													agreement.address ?? ''
												)
												showSuccessNotification(
													'Address copied',
													`This role's contract address was copied to your clipboard.`
												)
											}}
											width={20}
										/>
									</div>

									<Space h={40} />

									<Text
										className={meemTheme.tExtraSmallLabel}
									>
										TOKEN SETTINGS
									</Text>
									<Space h={24} />

									{role?.isAdminRole && (
										<div>
											<Text className={meemTheme.tSmall}>
												{`This is a default role and is currently the only
							role that has contract management capabilities.`}
											</Text>
											<Text
												className={meemTheme.tSmall}
											>{`The
							role cannot be deleted and members with this role
							cannot transfer their token to another wallet.`}</Text>
										</div>
									)}

									{!role?.isAdminRole && (
										<div>
											<Text
												className={meemTheme.tSmallBold}
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
													const newRole: AgreementRole =
														{
															name:
																role?.name ??
																'',
															id: role?.id ?? '',
															permissions:
																role?.permissions ??
																[],
															isTransferrable:
																isTokenTransferrable ===
																'transferrable',
															isAdminRole:
																role?.isAdminRole,
															rolesExtensionData:
																role?.rolesExtensionData,
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
						</div>
					)}

					<Tabs color="dark" defaultValue="members">
						<Tabs.List>
							{/* <Tabs.Tab
								style={{ fontWeight: 700 }}
								value="permissions"
							>
								Permissions
							</Tabs.Tab> */}
							<Tabs.Tab
								style={{ fontWeight: 700 }}
								value="members"
							>
								Members
							</Tabs.Tab>
						</Tabs.List>

						{/* <Tabs.Panel value="permissions" pt="xs">
							{!isLoadingPermissions && (
								<RolesManagerPermissions
									role={role}
									agreement={agreement}
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
						</Tabs.Panel> */}

						<Tabs.Panel value="members" pt="xs">
							<RolesManagerMembers
								role={role}
								agreement={agreement}
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
				agreement={agreement}
			/>

			<Space h={64} />
		</>
	)
}
