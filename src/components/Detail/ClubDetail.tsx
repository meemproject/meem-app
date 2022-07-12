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
import log from '@kengoldfarb/log'
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
import { BigNumber, Contract, ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState, useCallback } from 'react'
import Linkify from 'react-linkify'
import {
	BrandDiscord,
	BrandTwitter,
	Check,
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
import { clubMetadataFromContractUri } from '../../model/club/club_metadata'
import { tokenFromContractAddress } from '../../model/token/token'
import { ensWalletAddress, quickTruncate } from '../../utils/truncated_wallet'

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 32,
		paddingBottom: 32,
		paddingRight: 32,
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
		wordBreak: 'break-all',
		marginTop: 8,
		marginRight: 16,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		wordBreak: 'break-all',
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
	headerSlotsLeft: {
		fontSize: 14,
		marginTop: 8,
		marginLeft: 16,
		fontWeight: 500
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
		}
		// [`@media (max-width: ${theme.breakpoints.md}px)`]: {
		// 	fontSize: 0,
		// 	marginLeft: 0,
		// 	marginRight: 0,
		// 	backgroundColor: 'transparent',
		// 	borderColor: 'transparent'
		// }
	},
	clubSettingsIcon: {
		width: 16,
		height: 16,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 24,
			height: 24
		}
	},

	clubDetailSectionTitle: {
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
		paddingTop: 24,
		paddingBottom: 16,
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 16
	},
	requirementItem: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 8
	},
	requirementLink: {
		color: 'rgba(255, 102, 81, 1)'
	},
	memberItem: {
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		fontWeight: 600,
		borderRadius: 16,
		paddingTop: 16,
		paddingLeft: 16,
		paddingBottom: 16,
		cursor: 'pointer',
		display: 'flex'
	},
	memberAdminIndicator: {
		marginLeft: 6,
		marginTop: 6
	},
	enabledClubIntegrationItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		marginBottom: 12,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	intItemHeader: {
		display: 'flex',
		alignItems: 'center'
	},
	clubContractAddress: {
		wordBreak: 'break-all',
		color: 'rgba(0, 0, 0, 0.5)'
	},
	contractAddressContainer: {
		display: 'flex',
		flexDirection: 'row'
	},
	copy: {
		marginLeft: 4,
		padding: 2,
		cursor: 'pointer'
	},
	applicationInstructions: {
		a: {
			color: 'rgba(255, 102, 81, 1)'
		}
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
	const [isWrongNetwork, setIsWrongNetwork] = useState(false)
	const {
		loading,
		error,
		data: clubData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { slug }
	})

	const [club, setClub] = useState<Club | undefined>()
	const [isLoadingClub, setIsLoadingClub] = useState(true)

	const { data: clubSubData, loading: loadingClubSub } =
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
		(
			reqs: RequirementString[],
			isClubAdmin: boolean,
			slotsLeft: number
		) => {
			if (reqs.length === 0 || isClubAdmin) {
				setMeetsAllRequirements(true)
			} else {
				let reqsMet = 0
				reqs.forEach(req => {
					if (req.meetsRequirement) {
						reqsMet++
					}
				})
				log.debug(`reqs met = ${reqsMet}`)
				log.debug(`total reqs = ${reqs.length}`)
				log.debug(`slots left = ${slotsLeft}`)
				if (
					reqsMet === reqs.length &&
					(slotsLeft === -1 || slotsLeft > 0)
				) {
					setMeetsAllRequirements(true)
				}
			}
		},
		[]
	)

	const joinClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			await wallet.connectWallet()
			router.reload()
			return
		}

		setIsJoiningClub(true)
		try {
			const meemContract = new Contract(
				club?.address ?? '',
				meemABI,
				wallet.signer
			) as unknown as meemContracts.Meem
			const metadata = clubMetadataFromContractUri(
				club?.rawClub?.contractURI ?? ''
			)
			const uri = JSON.stringify({
				name: club?.name ?? '',
				description: metadata.description,
				image: metadata.image,
				external_link: '',
				application_instructions: []
			})
			const data = {
				to: wallet.accounts[0],
				tokenURI: uri,
				parentChain: MeemAPI.Chain.Polygon,
				parent: MeemAPI.zeroAddress,
				parentTokenId: 0,
				meemType: MeemAPI.MeemType.Original,
				uriSource: UriSource.Json,
				isURILocked: false,
				reactionTypes: ['upvote', 'downvote', 'heart'],
				mintedBy: wallet.accounts[0]
			}

			log.debug(data)
			const tx = await meemContract?.mint(
				data,
				meemContracts.defaultMeemProperties,
				meemContracts.defaultMeemProperties,
				{
					gasLimit: '5000000',
					value: ethers.utils.parseEther(
						club?.membershipSettings
							? `${club.membershipSettings.costToJoin}`
							: '0'
					)
				}
			)

			// @ts-ignore
			await tx.wait()
		} catch (e) {
			log.debug(e)
			setIsJoiningClub(false)
			showNotification({
				title: 'Error joining this club.',
				message: `Please get in touch!`
			})
		}
	}

	const leaveClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			showNotification({
				title: 'Unable to leave this club.',
				message: `Did you connect your wallet?`
			})
			return
		}

		if (club?.isClubAdmin) {
			showNotification({
				title: 'Oops!',
				message: `You cannot leave a club you are an admin of. Remove yourself as an admin, or make someone else an admin first.`
			})
			return
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
				possibleClub.membershipSettings!.requirements.map(
					async function (req) {
						index++

						let tokenBalance = BigNumber.from(0)
						let tokenUrl = ''
						let tokenName = 'Unknown Token'
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
							}
						}

						switch (req.type) {
							case MembershipReqType.None:
								reqs.push({
									requirementKey: `Anyone${index}`,
									requirementComponent: (
										<Text>Anyone can join this club.</Text>
									),
									meetsRequirement: true
								})
								break
							case MembershipReqType.ApprovedApplicants:
								reqs.push({
									requirementKey: `Applicants${index}`,
									requirementComponent: (
										<div
											style={{
												display: 'flex',
												flexDirection: 'column'
											}}
										>
											<Text>
												Membership is available to
												approved applicants.
												{!req.applicationInstructions && (
													<span>
														{' '}
														Contact a Club Admin for
														instructions.
													</span>
												)}
												{req.applicationInstructions && (
													<span>
														{' '}
														<>
															Here are the
															application
															instructions:
														</>
													</span>
												)}
											</Text>
											{req.applicationInstructions && (
												<Text
													className={
														classes.applicationInstructions
													}
												>
													<Space h={4} />
													<Linkify>
														{`${req.applicationInstructions}`}
													</Linkify>
												</Text>
											)}
										</div>
									),

									meetsRequirement: wallet.isConnected
										? req.approvedAddresses.includes(
												wallet.accounts[0]
										  )
										: false
								})
								break

							case MembershipReqType.TokenHolders:
								reqs.push({
									requirementKey: `Token${index}`,
									requirementComponent: (
										<Text>
											Members must hold{' '}
											{req.tokenMinQuantity}{' '}
											<a
												className={
													classes.requirementLink
												}
												href={tokenUrl}
											>
												{tokenName}
											</a>
											.
										</Text>
									),
									meetsRequirement:
										tokenBalance > BigNumber.from(0)
								})
								break
							case MembershipReqType.OtherClubMember:
								reqs.push({
									requirementKey: `OtherClub${index}`,
									requirementComponent: (
										<Text>
											Members must also be a member of{' '}
											<a
												className={
													classes.requirementLink
												}
												href="/club"
											>
												{req.clubName}
											</a>
										</Text>
									),
									meetsRequirement: true
								})
								break
						}
					}
				)
			)
			log.debug('set parsed reqs')
			if (reqs.length === 0) {
				reqs.push({
					requirementKey: `Error${index}`,
					requirementComponent: (
						<Text>
							This club has invalid membership requirements.
						</Text>
					),
					meetsRequirement: false
				})
			}

			// If mint start or end are valid,
			// determine whether the user falls within the date range.
			if (possibleClub.membershipSettings) {
				const mintStart =
					possibleClub.membershipSettings.membershipStartDate
				const mintEnd =
					possibleClub.membershipSettings.membershipEndDate

				const afterMintStart =
					Date.now() > (mintStart ? new Date(mintStart).getTime() : 0)
				const beforeMintEnd =
					Date.now() <
					(mintEnd ? new Date(mintEnd).getTime() : 200000000000000)

				let mintDatesText = 'Membership is available now'
				const mintStartString = mintStart
					? `${new Date(mintStart).toDateString()} at ${new Date(
							mintStart
					  ).getHours()}:${
							new Date(mintStart).getMinutes() > 9
								? new Date(mintStart).getMinutes()
								: `0${new Date(mintStart).getMinutes()}`
					  }`
					: ''

				const mintEndString = mintEnd
					? `${new Date(mintEnd).toDateString()} at ${new Date(
							mintEnd
					  ).getHours()}:${
							new Date(mintEnd).getMinutes() > 9
								? new Date(mintEnd).getMinutes()
								: `0${new Date(mintEnd).getMinutes()}`
					  }`
					: ''
				if (mintStart && !mintEnd) {
					if (afterMintStart) {
						mintDatesText = `Membership opened ${mintStartString}.`
					} else {
						mintDatesText = `Membership opens ${mintStartString}.`
					}
				} else if (!mintStart && mintEnd) {
					if (beforeMintEnd) {
						mintDatesText = `Membership closes ${mintEndString}.`
					} else {
						mintDatesText = `Membership closed ${mintEndString}.`
					}
				} else if (mintStart && mintEnd) {
					if (!afterMintStart) {
						mintDatesText = `Membership opens ${mintStartString} and closes ${mintEndString}.`
					} else if (afterMintStart && beforeMintEnd) {
						mintDatesText = `Membership opened ${mintStartString} and closes ${mintEndString}.`
					} else if (!beforeMintEnd) {
						mintDatesText = `Membership closed ${mintEndString}.`
					}
				} else if (!mintStart && !mintEnd) {
					mintDatesText = 'Members can join at any time.'
				}

				reqs.push({
					requirementKey: `mintDates${index}`,
					requirementComponent: <Text>{mintDatesText}</Text>,
					meetsRequirement: afterMintStart && beforeMintEnd
				})
			}

			setParsedRequirements(reqs)
			checkEligibility(
				reqs,
				possibleClub.isClubAdmin ?? false,
				possibleClub.slotsLeft ?? -1
			)

			setRequirementsParsed(true)
		},
		[
			checkEligibility,
			classes.applicationInstructions,
			classes.requirementLink,
			requirementsParsed,
			wallet
		]
	)

	useEffect(() => {
		async function getClub(data: GetClubQuery) {
			setIsLoadingClub(true)
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
				parseRequirements(possibleClub)
			}
			setIsLoadingClub(false)

			// After the club is loaded, convert its members into ENS names
			const newMembers: string[] = []
			for (const member of possibleClub.members!) {
				const name = await ensWalletAddress(member)
				newMembers.push(name)
			}
			// TODO: Is there an easier way to copy an object in react, like copyWith?
			const newClub: Club = {
				id: possibleClub.id,
				name: possibleClub.name,
				address: possibleClub.address,
				admins: possibleClub.admins,
				isClubAdmin: possibleClub.isClubAdmin,
				slug: possibleClub.slug,
				description: possibleClub.description,
				image: possibleClub.image,
				isClubMember: possibleClub.isClubMember,
				membershipToken: possibleClub.membershipToken,
				members: newMembers,
				slotsLeft: possibleClub.slotsLeft,
				membershipSettings: possibleClub.membershipSettings,
				isValid: possibleClub.isValid,
				rawClub: possibleClub.rawClub,
				allIntegrations: possibleClub.allIntegrations,
				publicIntegrations: possibleClub.publicIntegrations,
				privateIntegrations: possibleClub.privateIntegrations
			}
			setClub(newClub)
			setIsLoadingClub(false)
			log.debug('updated club with ENS addresses')
		}

		async function join(data: ClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)
			if (possibleClub.isClubMember) {
				log.debug('current user has joined the club!')
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
		}

		async function leave(data: ClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)
			if (!possibleClub.isClubMember) {
				log.debug('current user has left the club')
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

		if (!loading && !error && !club && clubData) {
			getClub(clubData)
		}

		if (isJoiningClub && clubSubData) {
			join(clubSubData)
		} else if (isLeavingClub && clubSubData) {
			leave(clubSubData)
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
		wallet,
		wallet.accounts,
		wallet.isConnected,
		wallet.web3Provider
	])

	useEffect(() => {
		if (wallet.isConnected) {
			const isWrong = wallet.isConnectedToWrongNetwork
			setIsWrongNetwork(isWrong)
		}
	}, [wallet.isConnected, wallet.isConnectedToWrongNetwork])

	const navigateToSettings = () => {
		router.push({ pathname: `/${slug}/admin` })
	}

	const memberIsAdmin = (member: string): boolean => {
		if (club) {
			let isAdmin = false
			club.admins?.forEach(admin => {
				if (admin === member) {
					isAdmin = true
				}
			})

			return isAdmin
		} else {
			return false
		}
	}

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
				</Container>
			)}
			{!isLoadingClub && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && club?.name && (
				<>
					<div className={classes.header}>
						<Image
							className={classes.clubLogoImage}
							src={club.image}
						/>
						<div>
							<Text className={classes.headerClubName}>
								{club.name}
							</Text>
							<Text className={classes.headerClubDescription}>
								{club.description}
							</Text>
							<div className={classes.headerButtons}>
								{club.isClubMember && wallet.isConnected && (
									<Button
										onClick={leaveClub}
										loading={isLeavingClub}
										className={classes.outlineButton}
									>
										Leave
									</Button>
								)}
								{!club.isClubMember && wallet.isConnected && (
									<Button
										disabled={!meetsAllRequirements}
										loading={isJoiningClub}
										onClick={joinClub}
										className={classes.buttonJoinClub}
									>
										{meetsAllRequirements &&
											(club.membershipSettings!
												.costToJoin > 0
												? `Join - ${
														club.membershipSettings!
															.costToJoin
												  } MATIC`
												: `Join`)}
										{!meetsAllRequirements &&
											'Requirements not met'}
										{(!wallet.isConnected ||
											isWrongNetwork) &&
											'Connect wallet to join'}
									</Button>
								)}
								{!wallet.isConnected && (
									<Button
										onClick={async () => {
											await wallet.connectWallet()
											router.reload()
										}}
										className={classes.buttonJoinClub}
									>
										Connect wallet to join
									</Button>
								)}
								{club.membershipSettings &&
									club.membershipSettings
										?.membershipQuantity > 0 && (
										<Text
											className={classes.headerSlotsLeft}
										>{`${club.members?.length} of ${club.membershipSettings?.membershipQuantity}`}</Text>
									)}
								{club.isClubAdmin && wallet.isConnected && (
									<>
										<Space w={'xs'} />
										<Button
											onClick={navigateToSettings}
											className={
												classes.outlineHeaderButton
											}
											leftIcon={
												<Settings
													className={
														classes.clubSettingsIcon
													}
												/>
											}
										>
											Settings
										</Button>
									</>
								)}
							</div>
						</div>
					</div>

					<Container>
						{!club.isClubMember ||
							(club.isClubAdmin && (
								<>
									<Text
										className={
											classes.clubDetailSectionTitle
										}
									>
										Membership Requirements
									</Text>
									{!requirementsParsed && (
										<div
											className={
												classes.requirementsContainer
											}
										>
											<Loader />
										</div>
									)}

									{parsedRequirements.length > 0 &&
										requirementsParsed && (
											<div
												className={
													classes.requirementsContainer
												}
											>
												{parsedRequirements.map(
													requirement => (
														<div
															className={
																classes.requirementItem
															}
															key={
																requirement.requirementKey
															}
														>
															{requirement.meetsRequirement && (
																<CircleCheck color="green" />
															)}

															{!requirement.meetsRequirement && (
																<CircleX color="red" />
															)}

															<Space w={'xs'} />
															{
																requirement.requirementComponent
															}
														</div>
													)
												)}
											</div>
										)}
								</>
							))}

						{club.isClubMember && (
							<>
								<Text
									className={classes.clubDetailSectionTitle}
								>
									Club Contract Address
								</Text>
								<div
									className={classes.contractAddressContainer}
								>
									<Text
										className={classes.clubContractAddress}
									>
										{club.address}
									</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												club.address ?? ''
											)
											showNotification({
												title: 'Address copied',
												autoClose: 2000,
												color: 'green',
												icon: <Check />,

												message: `This club's contract address was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</>
						)}

						{/* Public integrations for club visitors */}
						{!club.isClubMember &&
							club.publicIntegrations!.length > 0 && (
								<>
									<Text
										className={
											classes.clubDetailSectionTitle
										}
									>{`Apps (${
										club.publicIntegrations!.length
									})${
										club.allIntegrations!.length >
										club.publicIntegrations!.length
											? ` (more apps available for club members)`
											: ``
									}`}</Text>
									<Grid>
										{club.publicIntegrations!.map(
											integration => (
												<>
													<Grid.Col
														xs={6}
														sm={4}
														md={4}
														lg={4}
														xl={4}
														key={integration.name}
													>
														<a
															onClick={() => {
																window.open(
																	integration.url
																)
															}}
														>
															<div
																className={
																	classes.enabledClubIntegrationItem
																}
															>
																<div
																	className={
																		classes.intItemHeader
																	}
																>
																	<Image
																		src={`/${integration.icon}`}
																		width={
																			16
																		}
																		height={
																			16
																		}
																		fit={
																			'contain'
																		}
																	/>
																	<Space
																		w={8}
																	/>
																	<Text>
																		{
																			integration.name
																		}
																	</Text>
																	{integration.isVerified && (
																		<>
																			<Space
																				w={
																					12
																				}
																			/>
																			<Image
																				src="/icon-verified.png"
																				width={
																					16
																				}
																				height={
																					16
																				}
																			/>
																			<Space
																				w={
																					4
																				}
																			/>
																			<Text
																				color={
																					'#3EA2FF'
																				}
																				size={
																					'sm'
																				}
																			>
																				Verified
																			</Text>
																		</>
																	)}
																</div>
															</div>
														</a>
													</Grid.Col>
												</>
											)
										)}
									</Grid>
								</>
							)}

						{/* All integrations for club members */}
						{club.isClubMember && club.allIntegrations!.length > 0 && (
							<>
								<Text
									className={classes.clubDetailSectionTitle}
								>{`Apps (${
									club.allIntegrations!.length
								})`}</Text>
								<Grid>
									{club.allIntegrations!.map(integration => (
										<Grid.Col
											xs={6}
											sm={4}
											md={4}
											lg={4}
											xl={4}
											key={integration.name}
										>
											<a
												onClick={() => {
													window.open(integration.url)
												}}
											>
												<div
													className={
														classes.enabledClubIntegrationItem
													}
												>
													<div
														className={
															classes.intItemHeader
														}
													>
														<Image
															src={`/${integration.icon}`}
															width={16}
															height={16}
															fit={'contain'}
														/>
														<Space w={8} />
														<Text>
															{integration.name}
														</Text>
														{integration.isVerified && (
															<>
																<Space w={12} />
																<Image
																	src="/icon-verified.png"
																	width={16}
																	height={16}
																/>
																<Space w={4} />
																<Text
																	color={
																		'#3EA2FF'
																	}
																	size={'sm'}
																>
																	Verified
																</Text>
															</>
														)}
													</div>
												</div>
											</a>
										</Grid.Col>
									))}
								</Grid>
							</>
						)}

						<Text
							className={classes.clubDetailSectionTitle}
						>{`Members (${club.members!.length})`}</Text>
						{club.members!.length > 0 && (
							<Grid>
								{club.members!.map(member => (
									<Grid.Col
										xs={6}
										sm={4}
										md={4}
										lg={4}
										xl={4}
										key={member}
									>
										<div className={classes.memberItem}>
											<Text
												onClick={() => {
													navigator.clipboard.writeText(
														member
													)
													showNotification({
														title: 'Member address copied',
														autoClose: 2000,
														color: 'green',
														icon: <Check />,

														message: `This member's address was copied to your clipboard.`
													})
												}}
											>
												{quickTruncate(member)}
											</Text>
											{memberIsAdmin(member) && (
												<Image
													className={
														classes.memberAdminIndicator
													}
													src="/star.png"
													height={12}
													width={12}
												/>
											)}
										</div>
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
