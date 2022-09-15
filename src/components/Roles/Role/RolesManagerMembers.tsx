/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	createStyles,
	Text,
	Space,
	Divider,
	Button,
	Image,
	TextInput,
	Center
} from '@mantine/core'
import React, { useState } from 'react'
import { CircleMinus } from 'tabler-icons-react'
import { ClubMember, ClubRole } from '../../../model/club/club'

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
		justifyContent: 'space-between',
		alignItems: 'center'
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
	},
	fullWidthTextInput: {
		width: '100%'
	},
	clickable: {
		cursor: 'pointer'
	}
}))

interface IProps {
	role?: ClubRole
}

export const RolesManagerMembers: React.FC<IProps> = ({ role }) => {
	const { classes } = useStyles()

	// TODO: fetch role members
	const [members, setMembers] = useState<ClubMember[]>([
		{
			displayName: 'Role Member 1',
			profilePicture: '/exampleclub.png',
			wallet: '0x1EcE5F31d84aD3f56DD07B26fBD816126D8aB5',
			ens: ''
		},
		{
			displayName: 'Role Member 2',
			profilePicture: '/exampleclub.png',
			wallet: '0x1EcE5F31d84aD3f56DD07B26fBD598161e6D8aB5',
			ens: 'gadsby.eth'
		},
		{
			displayName: 'Role Member 3',
			profilePicture: '/exampleclub.png',
			wallet: '0x1Ec31d84aD3f56DD07B26fBD59816126D8aB5',
			ens: ''
		}
	])

	const addMember = (member: ClubMember) => {
		const newMembers = [...members]
		newMembers.push(member)
		setMembers(newMembers)
	}

	const removeMember = (member: ClubMember) => {
		const newMembers = members.filter(memb => memb.wallet !== member.wallet)
		setMembers(newMembers)
	}

	return (
		<>
			<div>
				<Space h={14} />
				<div className={classes.row}>
					<TextInput
						size={'md'}
						radius={16}
						className={classes.fullWidthTextInput}
					/>
					<Space w={16} />
					<Button className={classes.outlineButton}>
						+ Add Members
					</Button>
				</div>
				<Space h={16} />

				{members && (
					<>
						{members.map(member => (
							<div key={member.wallet}>
								<Space h={16} />
								<div className={classes.memberItemRow}>
									<div className={classes.memberDataRow}>
										<Image
											height={40}
											width={40}
											radius={20}
											src={member.profilePicture ?? ''}
										/>
										<Space w={16} />
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
									<CircleMinus
										className={classes.clickable}
										onClick={() => {
											removeMember(member)
										}}
									/>
								</div>
								<Space h={16} />
								<Divider />
							</div>
						))}
					</>
				)}
				{members.length === 0 && (
					<>
						<Space h={24} />
						<Center>
							<Text>This role has no members!</Text>
						</Center>
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
