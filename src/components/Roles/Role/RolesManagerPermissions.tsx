/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	createStyles,
	Text,
	Space,
	Switch,
	Divider,
	Button
} from '@mantine/core'
import React from 'react'
import { Lock } from 'tabler-icons-react'
import { ClubRole } from '../../../model/club/club'

const useStyles = createStyles(theme => ({
	row: {
		display: 'flex'
	},
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
	roleItemRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	roleSwitchRow: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	outlineButton: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	}
}))

interface IProps {
	role?: ClubRole
	onSaveChanges: () => void
	onRoleUpdated: (role: ClubRole) => void
}

export const RolesManagerPermissions: React.FC<IProps> = ({
	role,
	onSaveChanges,
	onRoleUpdated
}) => {
	const { classes } = useStyles()

	return (
		<>
			<div>
				<Space h={14} />
				<Text className={classes.manageClubHeader}>Permissions</Text>
				{role && role.permissions && (
					<>
						{role?.permissions.map(permission => (
							<div key={permission.id}>
								<Space h={16} />
								<div className={classes.roleItemRow}>
									<Text>{permission.name}</Text>
									<div className={classes.roleSwitchRow}>
										{permission.locked && <Lock />}
										<Space w={4} />
										<Switch
											checked={permission.enabled}
											onChange={value => {
												if (value) {
													const newPermissions = [
														...role.permissions
													]
													newPermissions.forEach(
														perm => {
															if (
																perm.id ===
																permission.id
															) {
																perm.enabled =
																	value.currentTarget.checked
															}
														}
													)
													const newRole: ClubRole = {
														name: role.name,
														id: role.id,
														permissions:
															newPermissions
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
						))}
					</>
				)}
				<Space h={32} />

				<Text className={classes.manageClubHeader}>Discord Role</Text>
				<Button className={classes.outlineButton}>
					Connect Discord
				</Button>
				<Space h={24} />
				<Button
					className={classes.buttonSaveChanges}
					onClick={onSaveChanges}
				>
					Save Changes
				</Button>
			</div>

			<Space h={64} />
		</>
	)
}
