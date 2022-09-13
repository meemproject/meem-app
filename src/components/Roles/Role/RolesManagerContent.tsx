/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createStyles, Text, Space, TextInput, Tabs } from '@mantine/core'
import React from 'react'
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
	}
}))

interface IProps {
	role?: ClubRole
}

export const RolesManagerContent: React.FC<IProps> = ({ role }) => {
	const { classes } = useStyles()

	return (
		<>
			<div>
				<Space h={14} />
				<Text className={classes.manageClubHeader}>
					{role ? role.name : 'Add Role'}
				</Text>
				<div className={classes.row}>
					<Text>Role Name</Text>
					<Space w={4} />
					<Text color={'red'}>*</Text>
				</div>
				<Space h={12} />
				<TextInput size={'lg'} radius={16} />
				<Space h={12} />

				<Tabs color="dark" defaultValue="gallery">
					<Tabs.List>
						<Tabs.Tab value="permissions">Permissions</Tabs.Tab>
						<Tabs.Tab value="members">Members</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="permissions" pt="xs">
						Gallery tab content
					</Tabs.Panel>

					<Tabs.Panel value="members" pt="xs">
						Messages tab content
					</Tabs.Panel>
				</Tabs>
			</div>

			<Space h={64} />
		</>
	)
}
