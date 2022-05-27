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
import { Chain, MeemType, UriSource } from '@meemproject/meem-contracts'
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
import { tokenFromContractAddress } from '../../model/token/token'
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
		(reqs: RequirementString[], slotsLeft: number) => {
			if (reqs.length === 0) {
				setMeetsAllRequirements(true)
			} else {
				let reqsMet = 0
				parsedRequirements.forEach(req => {
					if (req.meetsRequirement) {
						reqsMet++
					}
				})
				console.log(`reqs met = ${reqsMet}`)
				console.log(`total reqs = ${parsedRequirements.length}`)
				if (
					reqsMet === parsedRequirements.length &&
					slotsLeft !== -1 &&
					slotsLeft > 0
				) {
					setMeetsAllRequirements(true)
				}
			}
		},
		[parsedRequirements]
	)

	const joinClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			wallet.connectWallet()
			return
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
					tokenURI: club?.rawClub?.contractURI ?? '',
					parentChain: Chain.Polygon,
					parent: MeemAPI.zeroAddress,
					parentTokenId: 0,
					meemType: MeemType.Original,
					isURILocked: false,
					reactionTypes: ['upvote', 'downvote', 'heart'],
					uriSource: UriSource.Json,
					mintedBy: wallet.accounts[0]
				},
				meemContracts.defaultMeemProperties,
				meemContracts.defaultMeemProperties,
				{ gasLimit: '1000000' }
			)

			// @ts-ignore
			await tx.wait()
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
			if (club && club.membershipToken) {
				const tx = await meemContract?.burn(club?.membershipToken)
				// @ts-ignore
				await tx.wait()
			}
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
					let tokenUrl = ''
					let tokenName = ''
					let tokenSymbol = ''
					if (wallet.web3Provider && wallet.signer) {
						const token = await tokenFromContractAddress(
							req.tokenContractAddress,
							wallet
						)
						if (token) {
							tokenBalance = token.balance
							tokenUrl = token.url
							tokenName = token.name
							tokenSymbol = token.symbol
						} else {
							return
						}
					}

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
										Membership is available to approved applicants.
										{!req.applicationLink && (
											<span>
												{' '}
												Contact a Club Admin for the application link.
											</span>
										)}
										{req.applicationLink && (
											<span>
												{' '}
												Applicants can apply{' '}
												<a
													className={classes.requirementLink}
													href={req.applicationLink}
												>
													here
												</a>
												.
											</span>
										)}
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
										Members must hold one{' '}
										<a className={classes.requirementLink} href={tokenUrl}>
											{tokenName}
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
										Members must hold {req.tokenMinQuantity}
										<a className={classes.requirementLink} href={tokenUrl}>
											{tokenName}
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
			if (reqs.length === 0) {
				reqs.push({
					requirementKey: `Error${index}`,
					requirementComponent: (
						<Text>This club has invalid membership requirements.</Text>
					),
					meetsRequirement: false
				})
			}
			setParsedRequirements(reqs)

			setRequirementsParsed(true)
			checkEligibility(reqs, possibleClub.slotsLeft ?? -1)
		},
		[checkEligibility, classes.requirementLink, requirementsParsed, wallet]
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
