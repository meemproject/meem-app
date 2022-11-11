/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text, Button, Space, Badge, Menu } from '@mantine/core'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Dots, Lock } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../model/club/club'
import { DeleteRoleModal } from '../../Roles/Role/Modals/DeleteRoleModal'
import { colorPink, useGlobalStyles } from '../../Styles/GlobalStyles'

interface IProps {
	club: Club
}

export const CARoles: React.FC<IProps> = ({ club }) => {
	const { classes: design } = useGlobalStyles()
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

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={design.tLargeBold}>Roles</Text>

				<Space h={32} />
			</div>
			{club.roles && (
				<>
					{club.roles.map(role => (
						<div
							className={design.gridItem}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 16
							}}
							key={role.id}
						>
							<div
								className={design.centeredRow}
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
									variant="gradient"
									gradient={{
										from: '#DCDCDC',
										to: '#DCDCDC',
										deg: 35
									}}
									classNames={{
										inner: design.tBadgeText,
										root: design.badge
									}}
									leftSection={
										<>
											<Group
												color="#000"
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
											className={design.tSmallBold}
										>
											Manage Role
										</Menu.Item>
										{!role.isDefaultRole && (
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
														design.tSmallBold
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
			<Button className={design.buttonBlack} onClick={createRole}>
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
