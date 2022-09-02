/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery, useSubscription } from '@apollo/client'
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
	Center,
	Group,
	Modal,
	Divider,
	HoverCard
} from '@mantine/core'
import { cleanNotifications, showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import { LoginState, useWallet } from '@meemproject/react'
import { BigNumber, Contract, ethers } from 'ethers'
import { QrCode } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState, useCallback } from 'react'
import Linkify from 'react-linkify'
import QRCode from 'react-qr-code'
import { Check, CircleCheck, CircleX, Settings } from 'tabler-icons-react'
import {
	ClubSubscriptionSubscription,
	GetBundleByIdQuery,
	GetClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import { GET_BUNDLE_BY_ID, SUB_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, {
	Club,
	Integration,
	MembershipReqType
} from '../../model/club/club'
import { tokenFromContractAddress } from '../../model/token/token'
import { quickTruncate } from '../../utils/truncated_wallet'

const useStyles = createStyles(theme => ({
	row: { display: 'flex' },
	rowCentered: { display: 'flex', alignItems: 'center' },
	rowCenteredClickable: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer'
	},

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
		marginTop: 4,
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
		marginTop: 12,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 16
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

		marginRight: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
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
		display: 'flex',
		alignItems: 'center'
	},
	memberItemName: {
		marginLeft: 6
	},
	memberAdminIndicator: {
		marginLeft: 6
	},
	memberDisplayName: {
		fontWeight: 600
	},
	memberEns: { opacity: '0.6' },
	memberContactLabel: { fontWeight: 600 },
	memberContactItemText: { opacity: '0.6' },
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
	},
	integrationDetailText: {
		fontWeight: 400
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

	const [club, setClub] = useState<Club | undefined>()

	const [previousClubDataString, setPreviousClubDataString] = useState('')
	const {
		loading,
		error,
		data: clubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: {
			slug,
			visibilityLevel: club?.isClubMember
				? ['mutual-club-members', 'anyone']
				: ['anyone']
		}
	})

	const [isLoadingClub, setIsLoadingClub] = useState(true)

	const [isJoiningClub, setIsJoiningClub] = useState(false)
	const [isLeavingClub, setIsLeavingClub] = useState(false)

	const [isQrModalOpened, setIsQrModalOpened] = useState(false)
	const [isEditionsModalOpened, setIsEditionsModalOpened] = useState(false)

	const [parsedRequirements, setParsedRequirements] = useState<
		RequirementString[]
	>([])
	const [areRequirementsParsed, setRequirementsParsed] = useState(false)
	const [doesMeetAllRequirements, setMeetsAllRequirements] = useState(false)

	const { data: bundleData } = useQuery<GetBundleByIdQuery>(
		GET_BUNDLE_BY_ID,
		{
			variables: {
				id: process.env.NEXT_PUBLIC_MEEM_BUNDLE_ID
			}
		}
	)

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

		if (wallet.loginState !== LoginState.LoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${club?.slug}`
				}
			})
			return
		}

		setIsJoiningClub(true)
		try {
			if (club && club.rawClub && club.id) {
				if (
					typeof club?.membershipSettings?.costToJoin === 'number' &&
					club.membershipSettings.costToJoin > 0
				) {
					const getProofFetcher = makeFetcher<
						MeemAPI.v1.GetMintingProof.IQueryParams,
						MeemAPI.v1.GetMintingProof.IRequestBody,
						MeemAPI.v1.GetMintingProof.IResponseBody
					>({
						method: MeemAPI.v1.GetMintingProof.method
					})

					const { proof } = await getProofFetcher(
						MeemAPI.v1.GetMintingProof.path({
							meemContractId: club.id
						})
					)

					// Cost to join. Run the transaction in browser.
					const meemContract = new Contract(
						club?.address ?? '',
						bundleData?.Bundles[0].abi,
						wallet.signer
					)

					const uri = JSON.stringify({
						name: club?.name ?? '',
						description: club?.description,
						image: club?.image,
						external_link: '',
						application_instructions: []
					})
					const data = {
						to: wallet.accounts[0],
						tokenURI: uri,
						tokenType: MeemAPI.MeemType.Original,
						proof
					}

					log.debug(JSON.stringify(data))
					const tx = await meemContract?.mint(data, {
						gasLimit: '5000000',
						value: ethers.utils.parseEther(
							club?.membershipSettings
								? `${club.membershipSettings.costToJoin}`
								: '0'
						)
					})

					// @ts-ignore
					await tx.wait()
				} else if (club?.address) {
					// No cost to join. Call the API
					const joinClubFetcher = makeFetcher<
						MeemAPI.v1.MintOriginalMeem.IQueryParams,
						MeemAPI.v1.MintOriginalMeem.IRequestBody,
						MeemAPI.v1.MintOriginalMeem.IResponseBody
					>({
						method: MeemAPI.v1.MintOriginalMeem.method
					})

					await joinClubFetcher(
						MeemAPI.v1.MintOriginalMeem.path(),
						undefined,
						{
							meemContractAddress: club.address,
							to: wallet.accounts[0],
							metadata: {
								name: club?.name ?? '',
								description: club?.description,
								image: club?.image,
								meem_metadata_version: 'MeemClub_Token_20220718'
							}
						}
					)
				} else {
					showNotification({
						radius: 'lg',
						title: 'Error joining this club.',
						message: `Please get in touch!`
					})
				}
			}
		} catch (e) {
			log.debug(e)
			setIsJoiningClub(false)

			showNotification({
				radius: 'lg',
				title: 'Error joining this club.',
				message: `Please get in touch!`
			})
		}
	}

	const leaveClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			showNotification({
				radius: 'lg',
				title: 'Unable to leave this club.',
				message: `Did you connect your wallet?`
			})
			return
		}

		if (club?.isClubAdmin) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: `You cannot leave a club you are an admin of. Remove yourself as an admin, or make someone else an admin first.`
			})
			return
		}

		if (wallet.loginState !== LoginState.LoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${club?.slug}`
				}
			})
			return
		}

		setIsLeavingClub(true)
		try {
			const meemContract = new Contract(
				club?.address ?? '',
				bundleData?.Bundles[0].abi,
				wallet.signer
			)
			if (club && club.membershipToken) {
				const tx = await meemContract?.burn(club?.membershipToken)
				// @ts-ignore
				await tx.wait()
			}
		} catch (e) {
			setIsLeavingClub(false)
			showNotification({
				radius: 'lg',
				title: 'Error leaving this club.',
				message: `${e as string}`
			})
		}
	}

	const componentDecorator = (
		href: string | undefined,
		text:
			| boolean
			| React.ReactChild
			| React.ReactFragment
			| React.ReactPortal
			| null
			| undefined,
		key: React.Key | null | undefined
	) => (
		<a href={href} key={key} target="_blank" rel="noopener noreferrer">
			{text}
		</a>
	)

	const parseRequirements = useCallback(
		async (possibleClub: Club) => {
			if (areRequirementsParsed || !possibleClub) {
				return
			}

			const reqs: RequirementString[] = []
			let index = 0

			if (possibleClub.membershipSettings) {
				await Promise.all(
					possibleClub.membershipSettings?.requirements.map(
						async function (req) {
							index++

							let tokenBalance = BigNumber.from(0)
							let tokenUrl = ''
							let tokenName = 'Unknown Token'
							if (wallet.web3Provider && wallet.signer) {
								const token = await tokenFromContractAddress(
									req.tokenContractAddress,
									wallet
								)
								if (token) {
									tokenBalance = token.balance
									tokenUrl = token.url
									tokenName = token.name
								}
							}

							switch (req.type) {
								case MembershipReqType.None:
									reqs.push({
										requirementKey: `Anyone${index}`,
										requirementComponent: (
											<Text>
												Anyone can join this club.
											</Text>
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
															Contact a Club Admin
															for instructions.
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
														<Linkify
															componentDecorator={
																componentDecorator
															}
														>
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
													{req.otherClubName}
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
			}

			log.debug('set parsed reqs')
			if (reqs.length === 0) {
				reqs.push({
					requirementKey: `Error${index}`,
					requirementComponent: (
						<Text>Anyone can join this club for free.</Text>
					),
					meetsRequirement: true
				})
			}

			// If mint start or end are valid,
			// determine whether the user falls within the date range.
			if (possibleClub.membershipSettings) {
				const mintStart =
					possibleClub.membershipSettings.membershipStartDate
				const mintEnd =
					possibleClub.membershipSettings.membershipEndDate

				const isAfterMintStart =
					Date.now() > (mintStart ? new Date(mintStart).getTime() : 0)
				const isBeforeMintEnd =
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
					if (isAfterMintStart) {
						mintDatesText = `Membership opened ${mintStartString}.`
					} else {
						mintDatesText = `Membership opens ${mintStartString}.`
					}
				} else if (!mintStart && mintEnd) {
					if (isBeforeMintEnd) {
						mintDatesText = `Membership closes ${mintEndString}.`
					} else {
						mintDatesText = `Membership closed ${mintEndString}.`
					}
				} else if (mintStart && mintEnd) {
					if (mintStart.getTime() === 0 && mintEnd.getTime() === 0) {
						mintDatesText = 'People may join at any time.'
					}
					if (!isAfterMintStart) {
						mintDatesText = `Membership opens ${mintStartString} and closes ${mintEndString}.`
					} else if (isAfterMintStart && isBeforeMintEnd) {
						mintDatesText = `Membership opened ${mintStartString} and closes ${mintEndString}.`
					} else if (!isBeforeMintEnd) {
						mintDatesText = `Membership closed ${mintEndString}.`
					}
				} else if (!mintStart && !mintEnd) {
					mintDatesText = 'People may join at any time.'
				}

				reqs.push({
					requirementKey: `mintDates${index}`,
					requirementComponent: <Text>{mintDatesText}</Text>,
					meetsRequirement:
						(isAfterMintStart && isBeforeMintEnd) ||
						(mintStart &&
							mintEnd &&
							mintStart.getTime() === 0 &&
							mintEnd.getTime() === 0) ||
						false
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
			areRequirementsParsed,
			wallet
		]
	)

	useEffect(() => {
		async function getClub() {
			if (!clubData) {
				return
			}
			// TODO: Why do I have to compare strings to prevent an infinite useEffect loop?
			// TODO: Why does this page cause a loop but MyClubs.tsx doesn't?
			if (previousClubDataString) {
				const currentData = JSON.stringify(clubData)
				if (previousClubDataString === currentData) {
					return
				}
			}
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				clubData.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
				parseRequirements(possibleClub)
				setIsLoadingClub(false)
				log.debug('got club')
			}

			setPreviousClubDataString(JSON.stringify(clubData))
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
					radius: 'lg',
					title: `Welcome to ${possibleClub.name}!`,
					color: 'green',
					autoClose: 5000,
					message: `You now have access to this club.`
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

				cleanNotifications()
				showNotification({
					radius: 'lg',
					title: 'Successfully left the club.',
					color: 'green',
					autoClose: 5000,
					message: `You'll be missed!`
				})
			}
		}

		if (!loading && !error && clubData) {
			getClub()
		}

		if (isJoiningClub && clubData) {
			join(clubData)
		} else if (isLeavingClub && clubData) {
			leave(clubData)
		}
	}, [
		club,
		clubData,
		previousClubDataString,
		error,
		isJoiningClub,
		isLeavingClub,
		loading,
		parseRequirements,
		wallet
	])

	useEffect(() => {
		if (
			wallet.isConnected &&
			process.env.NEXT_PUBLIC_CHAIN_ID &&
			+process.env.NEXT_PUBLIC_CHAIN_ID !== wallet.chainId
		) {
			setIsWrongNetwork(true)
		}
	}, [wallet])

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

	const integrationItem = (integration: Integration) => (
		<Grid.Col xs={6} sm={4} md={4} lg={4} xl={4} key={integration.name}>
			<a
				onClick={() => {
					window.open(integration.url)
				}}
			>
				<div className={classes.enabledClubIntegrationItem}>
					<div className={classes.intItemHeader}>
						<Image
							src={`/${integration.icon}`}
							width={16}
							height={16}
							fit={'contain'}
						/>
						<Space w={8} />
						<Text>{integration.name}</Text>
						{integration.isVerified && (
							<>
								<Space w={12} />
								<Image
									src="/icon-verified.png"
									width={16}
									height={16}
								/>
								<Space w={4} />
								<Text color={'#3EA2FF'} size={'sm'}>
									Verified
								</Text>
							</>
						)}
					</div>
					{integration.publicationName && (
						<>
							<Text className={classes.integrationDetailText}>
								{integration.publicationName}
							</Text>
						</>
					)}
				</div>
			</a>
		</Grid.Col>
	)

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="red" variant="oval" />
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
							width={80}
							height={80}
							radius={16}
							fit="cover"
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
							<Group
								spacing={'xs'}
								className={classes.headerButtons}
							>
								{club.membershipSettings &&
									club.membershipSettings
										?.membershipQuantity > 0 && (
										<Button
											onClick={() => {
												setIsEditionsModalOpened(true)
											}}
											className={classes.buttonJoinClub}
										>
											{' '}
											{`${club.members?.length} of ${club.membershipSettings?.membershipQuantity}`}
										</Button>
									)}
								{club.isClubMember && wallet.isConnected && (
									<Button
										onClick={leaveClub}
										loading={isLeavingClub}
										className={classes.buttonJoinClub}
									>
										Leave
									</Button>
								)}
								{!club.isClubMember && wallet.isConnected && (
									<Button
										disabled={!doesMeetAllRequirements}
										loading={isJoiningClub}
										onClick={joinClub}
										className={classes.buttonJoinClub}
									>
										{doesMeetAllRequirements &&
											((club.membershipSettings
												?.costToJoin ?? 0) > 0
												? `Join - ${
														club.membershipSettings
															?.costToJoin ?? 0
												  } MATIC`
												: `Join`)}
										{!doesMeetAllRequirements &&
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

								<Button
									className={classes.buttonJoinClub}
									onClick={() => {
										setIsQrModalOpened(true)
									}}
								>
									<QrCode />
								</Button>

								{club.isClubAdmin && wallet.isConnected && (
									<>
										<Button
											onClick={navigateToSettings}
											className={
												classes.outlineHeaderButton
											}
										>
											<Settings />
										</Button>
									</>
								)}
							</Group>
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
									{!areRequirementsParsed && (
										<div
											className={
												classes.requirementsContainer
											}
										>
											<Loader
												color="red"
												variant="oval"
											/>
										</div>
									)}

									{parsedRequirements.length > 0 &&
										areRequirementsParsed && (
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
									<Text>{club.address}</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												club.address ?? ''
											)
											showNotification({
												radius: 'lg',
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
							club.publicIntegrations &&
							club.allIntegrations &&
							club.publicIntegrations.length > 0 && (
								<>
									<Text
										className={
											classes.clubDetailSectionTitle
										}
									>{`Apps (${
										club.publicIntegrations.length
									})${
										club.allIntegrations.length >
										club.publicIntegrations.length
											? ` (more apps available for club members)`
											: ``
									}`}</Text>
									<Grid>
										{club.publicIntegrations.map(
											integration =>
												integrationItem(integration)
										)}
									</Grid>
								</>
							)}

						{/* All integrations for club members */}
						{club.isClubMember &&
							club.allIntegrations &&
							club.allIntegrations.length > 0 && (
								<>
									<Text
										className={
											classes.clubDetailSectionTitle
										}
									>{`Apps (${club.allIntegrations.length})`}</Text>
									<Grid>
										{club.allIntegrations.map(integration =>
											integrationItem(integration)
										)}
									</Grid>
								</>
							)}

						<Text
							className={classes.clubDetailSectionTitle}
						>{`Members (${club.members?.length})`}</Text>
						{club.members && club.members?.length > 0 && (
							<Grid>
								{club.members.map(member => (
									<Grid.Col
										xs={6}
										sm={4}
										md={4}
										lg={4}
										xl={4}
										key={member.wallet}
									>
										<HoverCard
											width={280}
											shadow="md"
											radius={16}
										>
											<HoverCard.Target>
												<div
													className={
														classes.memberItem
													}
												>
													{member.profilePicture && (
														<Image
															src={
																member.profilePicture
															}
															radius={16}
															height={32}
															width={32}
														/>
													)}

													<Text
														className={
															classes.memberItemName
														}
														// onClick={() => {
														// 	navigator.clipboard.writeText(
														// 		member.ens
														// 			? member.ens
														// 			: member.wallet
														// 	)
														// 	showNotification({
														// 		radius: 'lg',
														// 		title: 'Member address copied',
														// 		autoClose: 2000,
														// 		color: 'green',
														// 		icon: <Check />,

														// 		message: `This member's address was copied to your clipboard.`
														// 	})
														// }}
													>
														{member.displayName
															? member.displayName
															: member.ens
															? member.ens
															: quickTruncate(
																	member.wallet
															  )}
													</Text>
													{memberIsAdmin(
														member.wallet
													) && (
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
											</HoverCard.Target>
											<HoverCard.Dropdown>
												<div className={classes.row}>
													{member.profilePicture && (
														<>
															<Image
																src={
																	member.profilePicture
																}
																radius={24}
																height={48}
																width={48}
															/>
															<Space w={16} />
														</>
													)}
													<div>
														<Text
															className={
																classes.memberDisplayName
															}
														>
															{member.displayName &&
															member.displayName
																.length > 0
																? member.displayName
																: 'Club Member'}
														</Text>

														<div
															className={
																classes.rowCentered
															}
														>
															<Text
																className={
																	classes.memberEns
																}
															>
																{member.ens
																	? member.ens
																	: quickTruncate(
																			member.wallet
																	  )}
															</Text>
															<Space h={4} />
															<Image
																className={
																	classes.copy
																}
																src="/copy.png"
																height={18}
																width={18}
																onClick={() => {
																	navigator.clipboard.writeText(
																		member.ens
																			? member.ens
																			: member.wallet
																	)
																	showNotification(
																		{
																			radius: 'lg',
																			title: 'Address copied',
																			autoClose: 2000,
																			color: 'green',
																			icon: (
																				<Check />
																			),

																			message: `This member's address was copied to your clipboard.`
																		}
																	)
																}}
															/>
														</div>
													</div>
												</div>
												{(member.emailAddress ||
													member.twitterUsername ||
													member.discordUsername) && (
													<>
														<Space h={24} />
														<div
															className={
																classes.rowCentered
															}
														>
															<Text
																className={
																	classes.memberContactLabel
																}
															>
																Contact
															</Text>
															<Space w={4} />
															<Image
																src="/icon-verified.png"
																width={16}
																height={16}
															/>
														</div>
														{member.twitterUsername && (
															<div
																onClick={() => {
																	window.open(
																		`https://twitter.com/${member.twitterUsername}`
																	)
																}}
																className={
																	classes.rowCenteredClickable
																}
															>
																<Image
																	className={
																		classes.memberContactItemText
																	}
																	src="/integration-twitter.png"
																	width={12}
																	height={12}
																/>
																<Space w={4} />
																<Text
																	className={
																		classes.memberContactItemText
																	}
																>
																	{
																		member.twitterUsername
																	}
																</Text>
															</div>
														)}
														{member.discordUsername && (
															<div
																onClick={() => {
																	window.open(
																		`https://discordapp.com/users/${member.discordUserId}`
																	)
																}}
																className={
																	classes.rowCenteredClickable
																}
															>
																<Image
																	className={
																		classes.memberContactItemText
																	}
																	src="/integration-discord.png"
																	width={12}
																	height={12}
																/>
																<Space w={4} />
																<Text
																	className={
																		classes.memberContactItemText
																	}
																>
																	{
																		member.discordUsername
																	}
																</Text>
															</div>
														)}
														{member.emailAddress && (
															<div
																onClick={() => {
																	window.open(
																		`mailto:${member.emailAddress}`
																	)
																}}
																className={
																	classes.rowCenteredClickable
																}
															>
																<Image
																	className={
																		classes.memberContactItemText
																	}
																	src="/integration-email.png"
																	width={12}
																	height={12}
																/>
																<Space w={4} />
																<Text
																	className={
																		classes.memberContactItemText
																	}
																>
																	{
																		member.emailAddress
																	}
																</Text>
															</div>
														)}
													</>
												)}
											</HoverCard.Dropdown>
										</HoverCard>
									</Grid.Col>
								))}
							</Grid>
						)}
					</Container>
					<Modal
						centered
						overlayBlur={8}
						radius={16}
						size={300}
						padding={'sm'}
						title={'Club QR Code'}
						opened={isQrModalOpened}
						onClose={() => setIsQrModalOpened(false)}
					>
						<Divider />
						<Space h={24} />
						<QRCode
							value={
								club
									? `${window.location.origin}/${club.slug}`
									: ''
							}
						/>
					</Modal>
					<Modal
						centered
						overlayBlur={8}
						radius={16}
						padding={'sm'}
						title={'Club Members Limit'}
						opened={isEditionsModalOpened}
						onClose={() => setIsEditionsModalOpened(false)}
					>
						<Divider />
						<Space h={24} />
						<Text>
							Some clubs have limits on how many members can join.
							This shows you how many members have joined out of
							the total allowed for this club.
						</Text>
					</Modal>
				</>
			)}
		</>
	)
}
