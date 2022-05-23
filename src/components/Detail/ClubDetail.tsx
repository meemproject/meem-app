/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloClient, HttpLink, InMemoryCache, useQuery } from '@apollo/client'
import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Space,
	Grid,
	Loader,
	Center
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState, useCallback } from 'react'
import {
	BrandDiscord,
	BrandTwitter,
	CircleCheck,
	Settings
} from 'tabler-icons-react'
import { GetClubQuery, MeemContracts } from '../../../generated/graphql'
import { GET_CLUB, GET_CLUB_SLUG } from '../../graphql/clubs'
import clubFromMeemContract, {
	Club,
	MembershipReqType
} from '../../model/club/club'
import { clubMetadataFromContractUri } from '../../utils/club_metadata'
import { truncatedWalletAddress } from '../../utils/truncated_wallet'

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 32,
		paddingBottom: 32,
		paddingLeft: 32,
		position: 'relative',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingLeft: 8,
			paddingRight: 8,
			paddingTop: 24,
			paddingBottom: 24
		}
	},
	headerClubDescription: {
		fontSize: 16,
		marginTop: 8,
		marginRight: 16,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		marginTop: -8
	},
	headerLinks: {
		position: 'absolute',
		top: '24px',
		right: '64px',
		display: 'flex',
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		},
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			display: 'flex'
		}
	},
	mobileHeaderLinks: {
		marginTop: 16,
		display: 'flex',
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'flex'
		},
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	headerLink: {
		display: 'flex',
		cursor: 'pointer',
		color: 'black',
		textDecoration: 'none'
	},
	headerButtons: {
		marginTop: 24,
		display: 'flex'
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
	outlineHeaderButton: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 0,
			marginLeft: 0,
			marginRight: 0,
			backgroundColor: 'transparent',
			borderColor: 'transparent'
		}
	},
	clubSettingsIcon: {
		width: 16,
		height: 16,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 24,
			height: 24
		}
	},
	clubMemberReqsTitleText: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	clubMembersListTitleText: {
		fontSize: 18,
		marginBottom: 16,
		marginTop: 40,
		fontWeight: 600,
		color: 'rgba(0, 0, 0, 0.6)'
	},

	buttonJoinClub: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 120,
		height: 120,
		marginRight: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 60,
			height: 60,
			minHeight: 60,
			minWidth: 60,
			marginLeft: 20,
			marginRight: 20
		}
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
	requirementLink: {
		color: 'rgba(255, 102, 81, 1)'
	},
	memberItem: {
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		fontWeight: 600,
		borderRadius: 16,
		padding: 16
	}
}))

interface IProps {
	slug: string
}

interface RequirementString {
	requirementComponent: ReactNode
	requirementKey: string
	meetsRequirement: boolean
}

export const ClubDetailComponent: React.FC<IProps> = ({ slug }) => {
	const router = useRouter()
	const wallet = useWallet()
	const { classes } = useStyles()

	const {
		loading,
		error,
		data: clubData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { slug }
	})

	const [clubName, setClubName] = useState('')
	const [clubLogo, setClubLogo] = useState('')
	const [clubDescription, setClubDescription] = useState('')
	const [membershipRequirements, setMembershipRequirements] = useState<
		RequirementString[]
	>([])
	const [isClubMember, setIsClubMember] = useState(false)
	const [costToJoin, setCostToJoin] = useState(0)

	const [clubMembers, setClubMembers] = useState<string[]>([])

	const parseRequirements = useCallback(
		async (club: Club) => {
			const reqs: RequirementString[] = []
			let index = 0
			club.membershipSettings?.requirements.forEach(req => {
				index++

				const tokenUrl =
					process.env.NEXT_PUBLIC_NETWORK === 'rinkeby'
						? `https://rinkeby.etherscan.com/address/${req.tokenContractAddress}`
						: `https://polygonscan.com/address/${req.tokenContractAddress}`
				switch (req.type) {
					case MembershipReqType.None:
						reqs.push({
							requirementKey: `Anyone${index}`,
							requirementComponent: <Text>Anyone can join this club.</Text>,
							meetsRequirement: true
						})
						break
					case MembershipReqType.ApprovedApplicants:
						reqs.push({
							requirementKey: `Applicants${index}`,
							requirementComponent: (
								<Text>
									Membership is available to approved applicants. Applicants can
									apply{' '}
									<a
										className={classes.requirementLink}
										href={req.applicationLink}
									>
										here
									</a>
								</Text>
							),

							meetsRequirement: true
						})
						break
					case MembershipReqType.NftHolders:
						reqs.push({
							requirementKey: `NFT${index}`,
							requirementComponent: (
								<Text>
									Members must hold a <a href={tokenUrl}>NFT.</a>
								</Text>
							),
							meetsRequirement: true
						})
						break
					case MembershipReqType.TokenHolders:
						reqs.push({
							requirementKey: `Token${index}`,
							requirementComponent: (
								<Text>
									Members must hold <a href={tokenUrl}>token</a>
								</Text>
							),
							meetsRequirement: true
						})
						break
					case MembershipReqType.OtherClubMember:
						reqs.push({
							requirementKey: `OtherClub${index}`,
							requirementComponent: (
								<Text>
									Members must also be a member of{' '}
									<a href="/club">{req.clubName}</a>
								</Text>
							),
							meetsRequirement: true
						})
						break
				}
			})
			setMembershipRequirements(reqs)
		},
		[classes.requirementLink]
	)

	useEffect(() => {
		if (!loading && !error && clubData) {
			const club = clubFromMeemContract(
				wallet.isConnected ? wallet.accounts[0] : undefined,
				clubData.MeemContracts[0] as MeemContracts
			)

			if (club) {
				setClubName(club.name!)
				setClubLogo(club.image!)
				setClubDescription(club.description!)
				setCostToJoin(club.membershipSettings!.costToJoin)

				// Parse requirements
				parseRequirements(club)

				const members: string[] = []
				clubData.MeemContracts[0].Meems.forEach(meem => {
					console.log(meem)
					if (wallet.isConnected && meem.owner === wallet.accounts[0]) {
						setIsClubMember(true)
					}
					members.push(meem.owner)
				})
				setClubMembers(members)
			}
		}
	}, [
		clubData,
		error,
		loading,
		parseRequirements,
		wallet.accounts,
		wallet.isConnected
	])

	const navigateToSettings = () => {
		router.push({ pathname: `/${slug}/admin` })
	}

	return (
		<>
			{loading && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
				</Container>
			)}
			{!loading && !clubData && (
				<Container>
					<Text>Sorry, that club does not exist!</Text>
				</Container>
			)}
			{!loading && clubData && (
				<>
					<div className={classes.header}>
						<Image className={classes.clubLogoImage} src={clubLogo} />
						<div>
							<Text className={classes.headerClubName}>{clubName}</Text>
							<Text className={classes.headerClubDescription}>
								{clubDescription}
							</Text>
							<div className={classes.headerButtons}>
								{isClubMember && (
									<Button className={classes.outlineButton}>Leave</Button>
								)}
								{!isClubMember && (
									<Button className={classes.buttonJoinClub}>
										{costToJoin > 0 ? `Join (${costToJoin} MATIC)` : `Join`}
									</Button>
								)}
								<Space w={'xs'} />
								<Button
									onClick={navigateToSettings}
									className={classes.outlineHeaderButton}
									leftIcon={<Settings className={classes.clubSettingsIcon} />}
								>
									Settings
								</Button>
							</div>
							{/* <div className={classes.mobileHeaderLinks}>
								<a href="twitter.com" className={classes.headerLink}>
									{' '}
									<BrandTwitter />
									<Space w={8} />
									<Text>Twitter</Text>
								</a>
								<Space w={'sm'} />
								<a href="discord.com" className={classes.headerLink}>
									{' '}
									<BrandDiscord />
									<Space w={8} />
									<Text>Discord</Text>
								</a>
							</div> */}
						</div>
						{/* <div className={classes.headerLinks}>
							<a href="twitter.com" className={classes.headerLink}>
								{' '}
								<BrandTwitter />
								<Space w={8} />
								<Text>Twitter</Text>
							</a>
							<Space w={'sm'} />
							<a href="discord.com" className={classes.headerLink}>
								{' '}
								<BrandDiscord />
								<Space w={8} />
								<Text>Discord</Text>
							</a>
						</div> */}
					</div>

					<Container>
						<Text className={classes.clubMemberReqsTitleText}>
							Membership Requirements
						</Text>
						{membershipRequirements.length > 0 && (
							<div className={classes.requirementsContainer}>
								{membershipRequirements.map(requirement => (
									<div
										className={classes.requirementItem}
										key={requirement.requirementKey}
									>
										<CircleCheck color="green" />
										<Space w={'xs'} />
										{requirement.requirementComponent}
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
									<Grid.Col xs={6} sm={4} md={4} lg={4} xl={4} key={member}>
										<Text className={classes.memberItem}>
											{truncatedWalletAddress(member)}
										</Text>
									</Grid.Col>
								))}
							</Grid>
						)}
						<Space h={'xl'} />
					</Container>
				</>
			)}
		</>
	)
}
