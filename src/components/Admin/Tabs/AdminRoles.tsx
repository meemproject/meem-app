/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	Text,
	Button,
	Space,
	Badge,
	Menu,
	useMantineColorScheme,
	Center,
	Divider
} from '@mantine/core'
import { Group } from 'iconoir-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Dots, Lock } from 'tabler-icons-react'
import { Agreement, AgreementRole } from '../../../model/agreement/agreements'
import { DeveloperPortalButton } from '../../Developer/DeveloperPortalButton'
import { DeleteRoleModal } from '../../Roles/Role/Modals/DeleteRoleModal'
import {
	colorBlack,
	colorDarkerGrey,
	colorBlue,
	colorWhite,
	useMeemTheme
} from '../../Styles/MeemTheme'

interface IProps {
	agreement: Agreement
}

export const AdminRoles: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpened] = useState(false)

	const [roleToDelete, setRoleToDelete] = useState<AgreementRole>()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={meemTheme.tLargeBold}>Roles</Text>

				<Space h={32} />
			</div>
			{agreement.roles && agreement.roles.length > 0 && (
				<>
					{agreement.roles.map(role => (
						<div
							className={meemTheme.gridItem}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 16
							}}
							key={role.id}
						>
							<Link
								href={`/${agreement.slug}/roles?role=${role.id}`}
							>
								<div className={meemTheme.centeredRow}>
									{role.isAdminRole && (
										<>
											<Lock
												size={16}
												style={{ marginBottom: 1 }}
											/>
											<Space w={4} />
										</>
									)}
									<Text>{role.name}</Text>
									<Space w={8} />
									<Badge
										gradient={{
											from: isDarkTheme
												? colorDarkerGrey
												: '#DCDCDC',
											to: isDarkTheme
												? colorDarkerGrey
												: '#DCDCDC',
											deg: 35
										}}
										classNames={{
											inner: meemTheme.tBadgeText
										}}
										variant={'gradient'}
										leftSection={
											<>
												<Group
													color={
														isDarkTheme
															? colorWhite
															: colorBlack
													}
													style={{
														marginTop: 5
													}}
												/>
											</>
										}
									>
										{
											agreement.memberRolesMap?.get(
												role.id
											)?.length
										}
									</Badge>
								</div>
							</Link>
							<div
								style={{
									width: 32,
									marginTop: 4,
									marginBottom: -4
								}}
							>
								<Menu radius={8} shadow={'lg'}>
									<Menu.Target>
										<div style={{ paddingBottom: 4 }}>
											<Dots />
										</div>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item>
											<Link
												href={`/${agreement.slug}/roles?role=${role.id}`}
											>
												<Text
													className={
														meemTheme.tSmallBold
													}
												>
													Manage Role
												</Text>
											</Link>
										</Menu.Item>
										{!role.isAdminRole && (
											<>
												<Menu.Item
													onClick={() => {
														setRoleToDelete(role)
														setIsDeleteRoleModalOpened(
															true
														)
													}}
													style={{
														marginBottom: '-2px',
														marginTop: '-2px',
														color: colorBlue
													}}
													className={
														meemTheme.tSmallBold
													}
												>
													Delete Role
												</Menu.Item>
											</>
										)}
									</Menu.Dropdown>
								</Menu>
							</div>
						</div>
					))}
					<Space h={32} />
					<Link href={`/${agreement.slug}/roles?createRole=true`}>
						<Button className={meemTheme.buttonBlack}>
							+ Create Role
						</Button>
					</Link>
				</>
			)}
			{agreement.roles && agreement.roles.length === 0 && (
				<>
					<Space h={32} />
					<Center>
						<Text className={meemTheme.tMedium}>
							Community member roles are being set up. Come back
							later!
						</Text>
					</Center>
				</>
			)}
			<Space h={32} />
			<Divider />
			<Space h={32} />
			<Text className={meemTheme.tExtraSmallLabel}>DEVELOPER PORTAL</Text>
			<Space h={20} />
			<DeveloperPortalButton
				portalButtonText={`Improve the roles feature`}
				modalTitle={'Improving roles'}
				modalText={`Roles are a core part of what makes the meem protocol so interesting. Because each role is backed by a token, the possibilities are endless. You can contribute by building on the meem app source code. Look for AdminRoles.tsx and get coding! Pull Requests are always welcome.`}
				githubLink={`https://github.com/meemproject/meem-app`}
			/>
			<Space h={64} />
			<DeleteRoleModal
				role={roleToDelete}
				agreement={agreement}
				onModalClosed={() => {
					setIsDeleteRoleModalOpened(false)
				}}
				isOpened={isDeleteRoleModalOpen}
			/>
		</>
	)
}
