/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	useQuery,
	useSubscription
} from '@apollo/client'
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
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import * as meemContracts from '@meemproject/meem-contracts'
import meemABI from '@meemproject/meem-contracts/types/Meem.json'
import { useWallet } from '@meemproject/react'
import { BigNumber, Contract } from 'ethers'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState, useCallback } from 'react'
import {
	BrandDiscord,
	BrandTwitter,
	CircleCheck,
	CircleX,
	Settings
} from 'tabler-icons-react'
import {
	ClubSubscriptionSubscription,
	GetClubQuery,
	MeemContracts
} from '../../../generated/graphql'
import { GET_CLUB, GET_CLUB_SLUG, SUB_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, {
	Club,
	MembershipReqType
} from '../../model/club/club'
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
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()
	const {
		loading,
		error,
		data: clubData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { slug }
	})

	const [club, setClub] = useState<Club>()

	const { data: clubSubData, loading: loadingClub } =
		useSubscription<ClubSubscriptionSubscription>(SUB_CLUB, {
			variables: { address: club ? club!.address! : '' }
		})

	const [isJoiningClub, setIsJoiningClub] = useState(false)
	const [isLeavingClub, setIsLeavingClub] = useState(false)

	const [parsedRequirements, setParsedRequirements] = useState<
		RequirementString[]
	>([])
	const [requirementsParsed, setRequirementsParsed] = useState(false)
	const [meetsAllRequirements, setMeetsAllRequirements] = useState(false)

	const checkEligibility = useCallback(
		(reqs: RequirementString[]) => {
			if (reqs.length === 0) {
				setMeetsAllRequirements(false)
			} else {
				let reqsMet = 0
				parsedRequirements.forEach(req => {
					if (req.meetsRequirement) {
						reqsMet++
					}
				})
				console.log(`reqs met = ${reqsMet}`)
				console.log(`total reqs = ${parsedRequirements.length}`)
				if (reqsMet === parsedRequirements.length) {
					setMeetsAllRequirements(true)
				}
			}
		},
		[parsedRequirements]
	)

	const joinClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			showNotification({
				title: 'Unable to join this club.',
				message: `Did you connect your wallet?`
			})
		}

		setIsJoiningClub(true)
		try {
			const meemContract = new Contract(
				club?.address ?? '',
				meemABI,
				wallet.signer
			) as unknown as meemContracts.Meem

			const tx = await meemContract?.mint(
				{
					to: wallet.accounts[0],
					// TODO: What goes here?
					tokenURI: 'ipfs://example',
					parentChain: MeemAPI.Chain.Polygon,
					parent: MeemAPI.zeroAddress,
					parentTokenId: 0,
					meemType: MeemAPI.MeemType.Original,
					data: '',
					isURILocked: false,
					reactionTypes: ['upvote', 'downvote', 'heart'],
					uriSource: MeemAPI.UriSource.TokenUri,
					mintedBy: wallet.accounts[0]
				},
				meemContracts.defaultMeemProperties,
				meemContracts.defaultMeemProperties,
				{ gasLimit: '1000000' }
			)
		} catch (e) {
			setIsJoiningClub(false)
			showNotification({
				title: 'Error minting club membership.',
				message: `${e as string}`
			})
		}
	}

	const leaveClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			showNotification({
				title: 'Unable to leave this club.',
				message: `Did you connect your wallet?`
			})
		}

		setIsLeavingClub(true)
		try {
			const meemContract = new Contract(
				club?.address ?? '',
				meemABI,
				wallet.signer
			) as unknown as meemContracts.Meem

			//const tx = await meemContract?.burn()
		} catch (e) {
			setIsLeavingClub(false)
			showNotification({
				title: 'Error leaving this club.',
				message: `${e as string}`
			})
		}
	}

	const parseRequirements = useCallback(
		async (possibleClub: Club) => {
			if (requirementsParsed || !possibleClub) {
				return
			}
			const reqs: RequirementString[] = []
			let index = 0
			await Promise.all(
				possibleClub.membershipSettings!.requirements.map(async function (req) {
					index++

					let tokenBalance = BigNumber.from(0)
					if (req.tokenContractAddress.length > 0 && wallet.web3Provider) {
						const balance = await wallet.web3Provider?.getBalance(
							req.tokenContractAddress
						)

						tokenBalance = balance
					}

					console.log(`token balance = ${tokenBalance}`)

					const tokenUrl =
						process.env.NEXT_PUBLIC_NETWORK === 'rinkeby'
							? `https://rinkeby.etherscan.io/address/${req.tokenContractAddress}`
							: `https://polygonscan.io/address/${req.tokenContractAddress}`
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
										Membership is available to approved applicants. Applicants
										can apply{' '}
										<a
											className={classes.requirementLink}
											href={req.applicationLink}
										>
											here
										</a>
										.
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
										Members must hold this{' '}
										<a className={classes.requirementLink} href={tokenUrl}>
											NFT
										</a>
										.
									</Text>
								),
								meetsRequirement: tokenBalance !== BigNumber.from(0)
							})
							break
						case MembershipReqType.TokenHolders:
							reqs.push({
								requirementKey: `Token${index}`,
								requirementComponent: (
									<Text>
										Members must hold this{' '}
										<a className={classes.requirementLink} href={tokenUrl}>
											token
										</a>
										.
									</Text>
								),
								meetsRequirement: tokenBalance !== BigNumber.from(0)
							})
							break
						case MembershipReqType.OtherClubMember:
							reqs.push({
								requirementKey: `OtherClub${index}`,
								requirementComponent: (
									<Text>
										Members must also be a member of{' '}
										<a className={classes.requirementLink} href="/club">
											{req.clubName}
										</a>
									</Text>
								),
								meetsRequirement: true
							})
							break
					}
				})
			)
			console.log('set parsed reqs')
			setParsedRequirements(reqs)
			setRequirementsParsed(true)
			checkEligibility(reqs)
		},
		[
			checkEligibility,
			classes.requirementLink,
			requirementsParsed,
			wallet.web3Provider
		]
	)

	useEffect(() => {
		if (!loading && !error && !club && clubData) {
			const possibleClub = clubFromMeemContract(
				wallet.isConnected ? wallet.accounts[0] : undefined,
				clubData.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
				parseRequirements(possibleClub)
			}
		}

		if (isJoiningClub && clubSubData) {
			const possibleClub = clubFromMeemContract(
				wallet.isConnected ? wallet.accounts[0] : undefined,
				clubSubData.MeemContracts[0] as MeemContracts
			)
			if (possibleClub.isClubMember) {
				console.log('current user has joined the club!')
				setIsJoiningClub(false)

				// Set the updated local copy of the club
				setClub(possibleClub)

				showNotification({
					title: `Welcome to ${possibleClub.name}!`,
					color: 'green',
					autoClose: 5000,
					message: `You now have access to this club's tools and resources.`
				})
			}
		} else if (isLeavingClub && clubSubData) {
			const possibleClub = clubFromMeemContract(
				wallet.isConnected ? wallet.accounts[0] : undefined,
				clubSubData.MeemContracts[0] as MeemContracts
			)
			if (!possibleClub.isClubMember) {
				console.log('current user has left the club')
				setIsLeavingClub(false)

				// Set the updated local copy of the club
				setClub(possibleClub)

				showNotification({
					title: 'Successfully left the club.',
					color: 'green',
					autoClose: 5000,
					message: `You'll be missed!`
				})
			}
		}
	}, [
		club,
		clubData,
		clubSubData,
		error,
		isJoiningClub,
		isLeavingClub,
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
			{!loading && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!loading && club?.name && (
				<>
					<div className={classes.header}>
						<Image className={classes.clubLogoImage} src={club.image} />
						<div>
							<Text className={classes.headerClubName}>{club.name}</Text>
							<Text className={classes.headerClubDescription}>
								{club.description}
							</Text>
							<div className={classes.headerButtons}>
								{club.isClubMember && (
									<Button
										onClick={leaveClub}
										loading={isLeavingClub}
										className={classes.outlineButton}
									>
										Leave
									</Button>
								)}
								{!club.isClubMember && (
									<Button
										disabled={!meetsAllRequirements}
										loading={isJoiningClub}
										onClick={joinClub}
										className={classes.buttonJoinClub}
									>
										{club.membershipSettings!.costToJoin > 0
											? `Join (${club.membershipSettings!.costToJoin} MATIC)`
											: `Join`}
									</Button>
								)}
								{club.isClubAdmin && (
									<>
										<Space w={'xs'} />
										<Button
											onClick={navigateToSettings}
											className={classes.outlineHeaderButton}
											leftIcon={
												<Settings className={classes.clubSettingsIcon} />
											}
										>
											Settings
										</Button>
									</>
								)}
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
						{!requirementsParsed && (
							<div className={classes.requirementsContainer}>
								<Loader />
							</div>
						)}
						{parsedRequirements.length > 0 && requirementsParsed && (
							<div className={classes.requirementsContainer}>
								{parsedRequirements.map(requirement => (
									<div
										className={classes.requirementItem}
										key={requirement.requirementKey}
									>
										{requirement.meetsRequirement && (
											<CircleCheck color="green" />
										)}

										{!requirement.meetsRequirement && <CircleX color="red" />}

										<Space w={'xs'} />
										{requirement.requirementComponent}
									</div>
								))}
							</div>
						)}

						<Text className={classes.clubMembersListTitleText}>{`Members (${
							club.members!.length
						})`}</Text>
						{club.members!.length > 0 && (
							<Grid>
								{club.members!.map(member => (
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
