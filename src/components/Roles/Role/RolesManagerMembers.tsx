/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	createStyles,
	Text,
	Space,
	Divider,
	Button,
	Image,
	TextInput
} from '@mantine/core'
import React from 'react'
import { CircleMinus } from 'tabler-icons-react'
import { ClubMember } from '../../../model/club/club'

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
	memberItemRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	memberDataRow: {
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
	members?: ClubMember[]
}

export const RolesManagerMembers: React.FC<IProps> = ({ members }) => {
	const { classes } = useStyles()

	return (
		<>
			<div>
				<Space h={14} />
				<div className={classes.row}>
					<TextInput size={'md'} radius={16} />
					<Button className={classes.outlineButton}>
						+ Add Members
					</Button>
				</div>
				{members && (
					<>
						{members.map(member => (
							<div key={member.wallet}>
								<Space h={16} />
								<div className={classes.memberItemRow}>
									<div className={classes.memberDataRow}>
										<Image
											height={16}
											width={16}
											radius={8}
											src={member.profilePicture ?? ''}
										/>
										<Space w={8} />
										<div>
											<Text>
												{member.displayName ??
													'Club Member'}
											</Text>
											<Text>
												{member.ens
													? member.ens
													: member.wallet}
											</Text>
										</div>
									</div>
									<CircleMinus />
								</div>
								<Space h={16} />
								<Divider />
							</div>
						))}
					</>
				)}
				<Space h={32} />

				<Space h={24} />
				<Button className={classes.buttonSaveChanges}>
					Save Changes
				</Button>
			</div>

			<Space h={64} />
		</>
	)
}
