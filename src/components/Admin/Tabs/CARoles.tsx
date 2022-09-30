/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createStyles, Text, Button, Space, Badge, Menu } from '@mantine/core'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Dots, Lock } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../model/club/club'
import { DeleteRoleModal } from '../../Roles/Role/Modals/DeleteRoleModal'

const useStyles = createStyles(theme => ({
	manageClubHeader: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	},

	buttonUpload: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	buttonSaveChangesInHeader: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	buttonSaveChanges: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	clubAdminsPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		marginTop: 36
	},
	clubAdminsInstructions: {
		fontSize: 18,
		marginBottom: 16,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	textField: {
		maxWidth: 800
	},
	roleLeftRow: {
		display: 'flex',
		alignItems: 'center',
		marginTop: 4
	},
	roleItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'start',
		justifyContent: 'space-between',
		fontWeight: 600,
		marginBottom: 12,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	badgeText: {
		color: '#000'
	},
	badge: {
		paddingLeft: 8,
		paddingRight: 8
	},
	menuItem: {
		fontWeight: 600
	},
	redMenuItem: {
		fontWeight: 600,
		color: 'rgba(255, 102, 81, 1)',
		marginBottom: '-2px',
		marginTop: '-2px'
	},
	roleMenu: {
		width: 32,
		marginTop: 4,
		marginBottom: -4
	}
}))

interface IProps {
	club: Club
}

export const CARoles: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()
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

				<Text className={classes.manageClubHeader}>Roles</Text>
			</div>
			{club.roles && (
				<>
					{club.roles.map(role => (
						<div className={classes.roleItem} key={role.id}>
							<div
								className={classes.roleLeftRow}
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
										inner: classes.badgeText,
										root: classes.badge
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
							<div className={classes.roleMenu}>
								<Menu radius={8} shadow={'lg'}>
									<Menu.Target>
										<div>
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
											className={classes.menuItem}
										>
											Manage Role
										</Menu.Item>
										<Menu.Item
											onClick={() => {
												setRoleToDelete(role)
												setIsDeleteRoleModalOpened(true)
											}}
											className={classes.redMenuItem}
										>
											Delete Role
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							</div>
						</div>
					))}
				</>
			)}

			<Space h={32} />
			<Button className={classes.buttonSaveChanges} onClick={createRole}>
				+ Create Role
			</Button>
			<Space h={64} />
			<DeleteRoleModal
				role={roleToDelete}
				onModalClosed={() => {
					setIsDeleteRoleModalOpened(false)
				}}
				isOpened={isDeleteRoleModalOpen}
			/>
		</>
	)
}
