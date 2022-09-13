/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createStyles, Text, Button, Space } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
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
	}
}))

interface IProps {
	club: Club
}

export const CARoles: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()
	const router = useRouter()

	const createRole = () => {
		router.push({ pathname: `/${club.slug}/roles` })
	}

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={classes.manageClubHeader}>Roles</Text>
			</div>
			<Space h={32} />
			<Button className={classes.buttonSaveChanges} onClick={createRole}>
				+ Create Role
			</Button>
			<Space h={64} />
		</>
	)
}
