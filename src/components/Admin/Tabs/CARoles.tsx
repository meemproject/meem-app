/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	Text,
	Button,
	Space,
	Badge,
	Menu,
	useMantineColorScheme
} from '@mantine/core'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Dots, Lock } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../model/club/club'
import { DeleteRoleModal } from '../../Roles/Role/Modals/DeleteRoleModal'
import {
	colorBlack,
	colorDarkerGrey,
	colorPink,
	colorWhite,
	useClubsTheme
} from '../../Styles/ClubsTheme'

interface IProps {
	club: Club
}

export const CARoles: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()

	const createRole = () => {
		router.push({
			pathname: `/${club.slug}/roles`,
			query: {
				createRole: true
			}
		})
	}

	const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpened] = useState(false)

	const [roleToDelete, setRoleToDelete] = useState<ClubRole>()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={clubsTheme.tLargeBold}>Roles</Text>

				<Space h={32} />
			</div>
			{club.roles && (
				<>
					{club.roles.map(role => (
						<div
							className={clubsTheme.gridItem}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 16
							}}
							key={role.id}
						>
							<div
								className={clubsTheme.centeredRow}
								onClick={() => {
									router.push({
										pathname: `/${club.slug}/roles`,
										query: {
											role: `/${role.id}`
										}
									})
								}}
							>
								<Lock size={16} style={{ marginBottom: 1 }} />
								<Space w={4} />
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
										inner: clubsTheme.tBadgeText
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
									{club.memberRolesMap?.get(role.id)?.length}
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
											<Dots />
										</div>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item
											onClick={() => {
												router.push({
													pathname: `/${club.slug}/roles`,
													query: {
														role: `/${role.id}`
													}
												})
											}}
											className={clubsTheme.tSmallBold}
										>
											Manage Role
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
														color: colorPink
													}}
													className={
														clubsTheme.tSmallBold
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
				</>
			)}

			<Space h={32} />
			<Button className={clubsTheme.buttonBlack} onClick={createRole}>
				+ Create Role
			</Button>
			<Space h={64} />
			<DeleteRoleModal
				role={roleToDelete}
				club={club}
				onModalClosed={() => {
					setIsDeleteRoleModalOpened(false)
				}}
				isOpened={isDeleteRoleModalOpen}
			/>
		</>
	)
}
