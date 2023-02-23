/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import { Text, Space, TextInput, Tabs, Button, Radio } from '@mantine/core'
import { Copy } from 'iconoir-react'
import React, { useEffect, useState } from 'react'
import {
	Agreement,
	AgreementMember,
	AgreementRole
} from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { colorBlue, useMeemTheme } from '../../Styles/MeemTheme'
import { RoleManagerChangesModal } from './Modals/RoleManagerChangesModal'
import { RolesManagerMembers } from './RolesManagerMembers'
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

	const [originalRoleMembers, setOriginalRoleMembers] = useState<
		AgreementMember[]
	>([])
	const [roleMembers, setRoleMembers] = useState<AgreementMember[]>([])

	const [isExistingRole, setIsExistingRole] = useState(false)

	const [originalRoleName, setOriginalRoleName] = useState('')
	const [roleName, setRoleName] = useState('')

	const [isOriginalTokenTransferrable, setIsOriginalTokenTransferrable] =
		useState('non-transferrable')
	const [isTokenTransferrable, setIsTokenTransferrable] =
		useState('non-transferrable')

	const [isSaveChangesModalOpened, setIsSaveChangesModalOpened] =
		useState(false)

	// Set initial role (updated later w/ changes in subcomponents)
	useEffect(() => {
		async function setUpRole(theRole: AgreementRole) {
			const permissionedRole = theRole

			// This is a new role, set default permissions
			if (permissionedRole.id === 'addRole') {
				setIsExistingRole(false)
				setRoleMembers([])
			} else {
				// This is an existing role, set current data
				setIsExistingRole(true)

				// Role name
				setOriginalRoleName(theRole.name)
				setRoleName(permissionedRole.name)

				// Whether the role is transferrable
				if (role?.isTransferrable) {
					setIsTokenTransferrable('transferrable')
					setIsOriginalTokenTransferrable('transferrable')
				}

				// Any existing role members
				const initialRoleMembers: AgreementMember[] | undefined =
					agreement.memberRolesMap
						? agreement.memberRolesMap.get(permissionedRole.id)
						: []

				if (initialRoleMembers) {
					setOriginalRoleMembers(initialRoleMembers)
					setRoleMembers(initialRoleMembers)
				}
			}

			// Set the role itself
			setRole(permissionedRole)
		}
		if (initialRole && !role) {
			setUpRole(initialRole)
		}
	}, [originalRoleName, agreement, initialRole, role])

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
		const dataLayer = (window as any).dataLayer ?? null

		dataLayer?.push({
			event: 'event',
			eventProps: {
				category: 'Add Role',
				action: 'Create New Role'
			}
		})
	}

	return (
		<>
			<div>
				<Space h={16} />
				<div
					className={meemTheme.spacedRow}
					style={{ marginBottom: 32 }}
				>
					<Text className={meemTheme.tLargeBold}>
						{role && role.name.length > 0 ? role.name : 'Add Role'}
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
					<Text color={'cyan'}>*</Text>
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
									id: role ? role.id : ''
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
								<Text className={meemTheme.tExtraSmallLabel}>
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
									<Copy
										className={meemTheme.copyIcon}
										height={20}
										width={20}
										color={colorBlue}
										onClick={() => {
											navigator.clipboard.writeText(
												agreement.address ?? ''
											)
											showSuccessNotification(
												'Address copied',
												`This role's contract address was copied to your clipboard.`
											)
										}}
									/>
								</div>

								<Space h={40} />

								<Text className={meemTheme.tExtraSmallLabel}>
									TOKEN SETTINGS
								</Text>
								<Space h={24} />

								{role?.isAdminRole && (
									<div>
										<Text className={meemTheme.tSmall}>
											{`This is a default role and is currently the only
							role that has contract management capabilities.`}
										</Text>
										<Text className={meemTheme.tSmall}>{`The
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
												setIsTokenTransferrable(value)
												const data = {
													name: role?.name ?? '',
													id: role?.id ?? '',
													isTransferrable:
														isTokenTransferrable ===
														value,
													tokenAddress:
														role?.tokenAddress,
													tokens: role?.tokens,
													isAdminRole:
														role?.isAdminRole,
													rolesExtensionData:
														role?.rolesExtensionData
												}
												log.debug(
													`new role data: ${JSON.stringify(
														data
													)}}`
												)

												// Update the role's state in this component and all subcomponents
												// TODO: there's got to be a better way to update a single element of an object and
												// TODO: have it apply to useState, instead of recreating the entire object. surely?
												const newRole: AgreementRole =
													data
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
						<Tabs.Tab style={{ fontWeight: 700 }} value="members">
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

			<RoleManagerChangesModal
				isOpened={isSaveChangesModalOpened}
				onModalClosed={() => {
					setIsSaveChangesModalOpened(false)
				}}
				role={role}
				isExistingRole={isExistingRole}
				haveRoleSettingsChanged={
					originalRoleName !== role?.name ||
					isOriginalTokenTransferrable != isTokenTransferrable
				}
				originalRoleMembers={originalRoleMembers}
				roleMembers={roleMembers}
				agreement={agreement}
			/>

			<Space h={64} />
		</>
	)
}
