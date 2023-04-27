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
import { Group, Lock, MoreHorizCircle } from 'iconoir-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AgreementRole } from '../../../model/agreement/agreements'
import { DeveloperPortalButton } from '../../Developer/DeveloperPortalButton'
import { useAgreement } from '../../Providers/AgreementProvider'
import { DeleteRoleModal } from '../../Roles/Role/Modals/DeleteRoleModal'
import {
	colorBlack,
	colorDarkerGrey,
	colorBlue,
	colorWhite,
	useMeemTheme
} from '../../Styles/MeemTheme'

export const DashboardRoles: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()

	const router = useRouter()
	const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpened] = useState(false)

	const [roleToDelete, setRoleToDelete] = useState<AgreementRole>()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const { agreement } = useAgreement()

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={meemTheme.tLargeBold}>Roles</Text>

				<Space h={32} />
			</div>
			{agreement?.roles && agreement.roles.length > 0 && (
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
							<div
								className={meemTheme.centeredRow}
								style={{
									width: '100%',
									paddingTop: 8,
									paddingBottom: 8
								}}
								onClick={() => {
									router.push(
										`/${agreement.slug}/roles?role=${role.id}`
									)
								}}
							>
								{role.isAdminRole && (
									<>
										<Lock
											height={16}
											width={16}
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
										agreement.memberRolesMap?.get(role.id)
											?.length
									}
								</Badge>
							</div>
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
											<MoreHorizCircle />
										</div>
									</Menu.Target>
									<Menu.Dropdown>
										<Link
											href={`/${agreement.slug}/roles?role=${role.id}`}
											legacyBehavior
											passHref
										>
											<a
												className={
													meemTheme.unstyledLink
												}
											>
												<Menu.Item>
													<Text
														className={
															meemTheme.tSmallBold
														}
													>
														Manage Role
													</Text>
												</Menu.Item>
											</a>
										</Link>

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
					<Link
						href={`/${agreement.slug}/roles?createRole=true`}
						legacyBehavior
						passHref
					>
						<a className={meemTheme.unstyledLink}>
							<Button className={meemTheme.buttonBlack}>
								+ Create Role
							</Button>
						</a>
					</Link>
				</>
			)}
			{agreement?.roles && agreement.roles.length === 0 && (
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
