/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createStyles, Text, Button, Space, Badge } from '@mantine/core'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React from 'react'
import { Dots, Lock } from 'tabler-icons-react'
import { Club } from '../../../model/club/club'

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
		alignItems: 'center'
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

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={classes.manageClubHeader}>Roles</Text>
			</div>
			{club.roles && (
				<>
					{club.roles.map(role => (
						<div
							className={classes.roleItem}
							key={role.id}
							onClick={() => {
								router.push({
									pathname: `/${club.slug}/roles`,
									query: {
										role: `/${role.id}`
									}
								})
							}}
						>
							<div className={classes.roleLeftRow}>
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
									{'member count'}
								</Badge>
							</div>
							<Dots onClick={() => {}} />
						</div>
					))}
				</>
			)}

			<Space h={32} />
			<Button className={classes.buttonSaveChanges} onClick={createRole}>
				+ Create Role
			</Button>
			<Space h={64} />
		</>
	)
}
