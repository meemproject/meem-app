import {
	createStyles,
	Container,
	Text,
	Center,
	Image,
	Loader,
	Button,
	Textarea,
	Space,
	Grid
} from '@mantine/core'
import { base64StringToBlob } from 'blob-util'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, CircleCheck, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 32,
		paddingBottom: 32,
		paddingLeft: 32
	},
	headerClubDescription: {
		fontSize: 16,
		marginTop: 8,
		fontWeight: '500',
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: '600',
		fontSize: 24,
		marginTop: -8
	},
	clubMemberReqsTitleText: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: '600',
		color: 'rgba(0, 0, 0, 0.6)'
	},
	clubMembersListTitleText: {
		fontSize: 18,
		marginBottom: 16,
		marginTop: 32,
		fontWeight: '600',
		color: 'rgba(0, 0, 0, 0.6)'
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
	buttonJoinClub: {
		marginTop: 24,
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},
	requirementsContainer: {
		border: '1px solid rgba(0, 0, 0, 0.5)',
		borderRadius: 16,
		padding: 16
	},
	requirementItem: {
		display: 'flex',
		alignItems: 'center'
	},
	memberItem: {
		border: '1px solid rgba(0, 0, 0, 0.5)',
		borderRadius: 16,
		padding: 16
	}
}))

export const ClubDetailComponent: React.FC = () => {
	const router = useRouter()
	const { classes } = useStyles()

	const [clubName, setClubName] = useState('Harry  Potter Club')
	const [clubDescription, setClubDescription] = useState(
		'A club to talk about spells and magic'
	)
	const [membershipRequirements, setMembershipRequirements] = useState([
		'Hold a Memesters Union Card'
	])

	const [clubMembers, setClubMembers] = useState([
		'popp.eth',
		'kateweimer.eth',
		'kencodes.eth',
		'gadsby.eth',
		'gregb.eth',
		'shoople.eth'
	])

	const [isLoading, setIsLoading] = useState(true)

	return (
		<>
			<div className={classes.header}>
				<Image
					className={classes.clubLogoImage}
					src="/exampleclub.png"
					width={80}
					height={80}
					fit={'contain'}
				/>
				<Space w={'md'} />
				<div>
					<Text className={classes.headerClubName}>{clubName}</Text>
					<Text className={classes.headerClubDescription}>
						{clubDescription}
					</Text>
					<Button className={classes.buttonJoinClub}>Join Club</Button>
				</div>
			</div>

			<Container>
				<Text className={classes.clubMemberReqsTitleText}>
					Membership Requirements
				</Text>
				{membershipRequirements.length > 0 && (
					<div className={classes.requirementsContainer}>
						{membershipRequirements.map(requirement => (
							<div className={classes.requirementItem} key={requirement}>
								<CircleCheck color="green" />
								<Space w={'xs'} />

								<Text>{requirement}</Text>
							</div>
						))}
					</div>
				)}

				<Text
					className={classes.clubMembersListTitleText}
				>{`Members (${clubMembers.length})`}</Text>
				{clubMembers.length > 0 && (
					<Grid>
						{clubMembers.map(member => (
							<Grid.Col span={4} key={member}>
								<Text className={classes.memberItem}>{member}</Text>
							</Grid.Col>
						))}
					</Grid>
				)}
			</Container>
		</>
	)
}
