import {
	createStyles,
	Text,
	Button,
	Space,
	Textarea,
	Chips,
	Chip
} from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Lock } from 'tabler-icons-react'

const useStyles = createStyles(theme => ({
	buttonSaveChanges: {
		marginTop: 48,
		marginBottom: 48,

		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	// Admins tab
	clubAdminsPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '600',
		marginTop: 36
	},
	clubAdminsInstructions: {
		fontSize: 18,
		marginBottom: 16,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	adminsTextAreaContainer: {
		position: 'relative'
	},
	adminsTextArea: {
		paddingTop: 48,
		paddingLeft: 32
	},
	primaryAdminChip: {
		position: 'absolute',
		pointerEvents: 'none',
		top: 12,
		left: 12
	},
	primaryAdminChipContents: {
		display: 'flex',
		alignItems: 'center'
	}
}))

export const ClubAdminAdminsSettingsComponent: React.FC = () => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()

	// Club admins
	const [primaryClubAdmin, setPrimaryClubAdmin] = useState('gadsby.eth')
	const [clubAdminsString, setClubAdminsString] = useState('')
	const [clubAdmins, setClubAdmins] = useState<string[]>([])

	const parseClubAdmins = (rawString: string) => {
		setClubAdminsString(rawString)
		const adminsList = rawString.split('\n')
		const finalList: string[] = []
		adminsList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		console.log(`admins count = ${finalList.length + 1}`)
		setClubAdmins(finalList)
	}

	return (
		<>
			<div>
				<Text className={classes.clubAdminsPrompt}>
					Who can manage this club’s profile and membership settings?
				</Text>
				<Text className={classes.clubAdminsInstructions}>
					Add a line break between each address. Note that the club creator will
					always have admin permissions.
				</Text>
				<div className={classes.adminsTextAreaContainer}>
					<Textarea
						classNames={{ input: classes.adminsTextArea }}
						radius="lg"
						size="md"
						value={clubAdminsString}
						minRows={10}
						onChange={event => parseClubAdmins(event.currentTarget.value)}
					/>
					<Chips
						color={'rgba(0, 0, 0, 0.05)'}
						className={classes.primaryAdminChip}
						variant="filled"
					>
						<Chip size="md" value="" checked={false}>
							<div className={classes.primaryAdminChipContents}>
								<Lock width={16} height={16} />
								<Space w={4} />
								<Text>{primaryClubAdmin}</Text>
							</div>
						</Chip>
					</Chips>
				</div>
				<Space h="lg" />

				<Button className={classes.buttonSaveChanges}>Save Changes</Button>
				<Space h="lg" />
			</div>
		</>
	)
}
