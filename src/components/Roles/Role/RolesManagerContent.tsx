/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	createStyles,
	Text,
	Space,
	TextInput,
	Tabs,
	Button
} from '@mantine/core'
import React, { useState } from 'react'
import { ClubMember, ClubRole } from '../../../model/club/club'
import { RolesManagerMembers } from './RolesManagerMembers'
import { RolesManagerPermissions } from './RolesManagerPermissions'

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
	spacedRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
}))

interface IProps {
	role?: ClubRole
}

export const RolesManagerContent: React.FC<IProps> = ({ role }) => {
	const { classes } = useStyles()

	const [members, setMembers] = useState<ClubMember[]>([])

	return (
		<>
			<div>
				<Space h={14} />
				<div className={classes.spacedRow}>
					<Text className={classes.manageClubHeader}>
						{role ? role.name : 'Add Role'}
					</Text>
					<Button className={classes.buttonSaveChanges}>
						Save Changes
					</Button>
				</div>

				<div className={classes.row}>
					<Text>Role Name</Text>
					<Space w={4} />
					<Text color={'red'}>*</Text>
				</div>
				<Space h={12} />
				<TextInput size={'lg'} radius={16} />
				<Space h={12} />

				<Tabs color="dark" defaultValue="permissions">
					<Tabs.List>
						<Tabs.Tab value="permissions">Permissions</Tabs.Tab>
						<Tabs.Tab value="members">Members</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="permissions" pt="xs">
						<RolesManagerPermissions role={role} />
					</Tabs.Panel>

					<Tabs.Panel value="members" pt="xs">
						<RolesManagerMembers members={members} />
					</Tabs.Panel>
				</Tabs>
			</div>

			<Space h={64} />
		</>
	)
}
