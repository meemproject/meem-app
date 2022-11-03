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
	HoverCard,
	Alert
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
import {
	AlertCircle,
	Check,
	CircleCheck,
	CircleX,
	Key,
	Settings
} from 'tabler-icons-react'
import {
	GetBundleByIdQuery,
	GetClubSubscriptionSubscription,
	GetIsMemberOfClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import {
	GET_BUNDLE_BY_ID,
	SUB_CLUB,
	SUB_CLUB_AS_MEMBER,
	SUB_IS_MEMBER_OF_CLUB
} from '../../graphql/clubs'
import clubFromMeemContract, {
	Club,
	Integration,
	MembershipReqType
} from '../../model/club/club'
import { userHasPermissionManageApps } from '../../model/identity/permissions'
import { tokenFromContractAddress } from '../../model/token/token'
import { useCustomApollo } from '../../providers/ApolloProvider'
import { quickTruncate } from '../../utils/truncated_wallet'
import { hostnameToChainId } from '../App'
import { ClubMemberCard } from '../Profile/Tabs/Identity/ClubMemberCard'
import { JoinLeaveClubModal } from './JoinLeaveClubModal'

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
		wordBreak: 'break-word',
		marginTop: 4,
		marginRight: 16,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		wordBreak: 'break-word',
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
		marginBottom: 8
	},
	requirementIcon: {
		minWidth: 32
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
		wordBreak: 'break-word',
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
	},
	appsEmptyStateTitle: {
		fontSize: 16,
		fontWeight: 600
	},
	appsEmptyStateText: {
		fontSize: 16
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
	const { anonClient, mutualMembersClient } = useCustomApollo()

	const [club, setClub] = useState<Club | undefined>()

	const [previousClubDataString, setPreviousClubDataString] = useState('')

	const { data: isCurrentUserClubMemberData, error: userClubMemberError } =
		useSubscription<GetIsMemberOfClubSubscriptionSubscription>(
			SUB_IS_MEMBER_OF_CLUB,
			{
				variables: {
					walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
					clubSlug: slug,
					chainId:
						wallet.chainId ??
						hostnameToChainId(
							global.window ? global.window.location.host : ''
						)
				},
				client: anonClient
			}
		)

	const {
		loading: loadingAnonClub,
		error: errorAnonClub,
		data: anonClubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: {
			slug,
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: anonClient,
		skip:
			!isCurrentUserClubMemberData ||
			isCurrentUserClubMemberData.Meems.length > 0
	})

	const {
		loading: loadingMemberClub,
		error: errorMemberClub,
		data: memberClubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB_AS_MEMBER, {
		variables: {
			slug,
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: mutualMembersClient,
		skip:
			!isCurrentUserClubMemberData ||
			isCurrentUserClubMemberData.Meems.length === 0
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
			isCurrentUserClubAdmin: boolean,
			slotsLeft: number
		) => {
			if (reqs.length === 0 || isCurrentUserClubAdmin) {
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
						description:
							club?.description && club?.description?.length > 0
								? club?.description
								: 'Club Token',
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
				} else if (club?.address && wallet.chainId) {
					// No cost to join. Call the API
					const joinClubFetcher = makeFetcher<
						MeemAPI.v1.MintOriginalMeem.IQueryParams,
						MeemAPI.v1.MintOriginalMeem.IRequestBody,
						MeemAPI.v1.MintOriginalMeem.IResponseBody
					>({
						method: MeemAPI.v1.MintOriginalMeem.method
					})

					const data = {
						meemContractAddress: club.address,
						to: wallet.accounts[0],
						metadata: {
							name: club?.name ?? '',
							description:
								club?.description &&
								club?.description?.length > 0
									? club?.description
									: 'Club Token',
							image: club?.image,
							meem_metadata_version: 'MeemClub_Token_20220718'
						},
						chainId:
							wallet.chainId ??
							hostnameToChainId(
								global.window ? global.window.location.host : ''
							)
					}
					log.debug(JSON.stringify(data))

					await joinClubFetcher(
						MeemAPI.v1.MintOriginalMeem.path(),
						undefined,
						data
					)
				} else {
					setIsJoiningClub(false)
					showNotification({
						radius: 'lg',
						title: 'Error joining this club.',
						message: `Please get in touch!`
					})
				}
			}
		} catch (e) {
			const error: any = JSON.parse(
				(e as any).toString().split('Error: ')[1]
			)
			log.debug(error.code)
			if (error.code === 'TX_LIMIT_EXCEEDED') {
				showNotification({
					radius: 'lg',
					title: 'Transaction limit exceeded',
					message: `Come back tomorrow or get in touch!`
				})
			} else {
				showNotification({
					radius: 'lg',
					title: 'Error joining this club.',
					message: `Please get in touch!`
				})
			}
			setIsJoiningClub(false)
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

		if (club?.isCurrentUserClubAdmin && club?.admins?.length === 1) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: `You cannot leave this club because you are the only admin.`
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
				message: `Did you cancel the transaction?`
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
												</Text>
												{req.applicationInstructions && (
													<>
														<Space h={8} />
														<Alert
															title="Follow these
														instructions to
														apply:"
															color="red"
															radius="lg"
														>
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
														</Alert>
														<Space h={8} />
													</>
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
					log.debug(`mint start = ${mintStart.getTime()}`)
					log.debug(`mint end = ${mintEnd.getTime()}`)

					if (mintStart.getTime() < 1 && mintEnd.getTime() < 1) {
						mintDatesText = 'People may join at any time.'
					} else if (!isAfterMintStart) {
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
				possibleClub.isCurrentUserClubAdmin ?? false,
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
		if (errorAnonClub) {
			log.debug(JSON.stringify(errorAnonClub))
			setIsLoadingClub(false)
		}

		if (errorMemberClub) {
			log.debug(JSON.stringify(errorMemberClub))
			setIsLoadingClub(false)
		}

		async function getClub() {
			const clubData = memberClubData ?? anonClubData

			if (!clubData) {
				return
			}

			if (clubData.MeemContracts.length === 0) {
				setIsLoadingClub(false)
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

		async function join(data: GetClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)
			if (possibleClub.isCurrentUserClubMember) {
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

		async function leave(data: GetClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)
			if (!possibleClub.isCurrentUserClubMember) {
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

		// Parse data for anonymous club
		if (!loadingAnonClub && !errorAnonClub && anonClubData) {
			getClub()
		}

		// Parse data as club member
		if (!loadingMemberClub && !errorMemberClub && memberClubData) {
			getClub()
		}

		if (isJoiningClub && (anonClubData || memberClubData)) {
			const clubData = memberClubData ?? anonClubData
			if (clubData) join(clubData)
		} else if (isLeavingClub && (anonClubData || memberClubData)) {
			const clubData = memberClubData ?? anonClubData
			if (clubData) leave(clubData)
		}

		if (
			errorMemberClub &&
			errorMemberClub.graphQLErrors.length > 0 &&
			errorMemberClub.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/browse`
				}
			})
		}
	}, [
		club,
		previousClubDataString,
		isJoiningClub,
		isLeavingClub,
		parseRequirements,
		wallet,
		loadingAnonClub,
		errorAnonClub,
		anonClubData,
		loadingMemberClub,
		errorMemberClub,
		memberClubData,
		userClubMemberError,
		router,
		isCurrentUserClubMemberData
	])

	const navigateToSettings = () => {
		router.push({ pathname: `/${slug}/admin` })
	}

	const memberIsAdmin = (member: string): boolean => {
		if (club) {
			let isAdmin = false
			club.adminAddresses?.forEach(admin => {
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
					if (integration.name === 'Phone Number') {
						window.open(`tel:${integration.url}`)
					} else if (integration.name === 'Email Address') {
						window.open(`mailto:${integration.url}`)
					} else {
						window.open(integration.url)
					}
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
						<Text>{integration.name.replaceAll(' Link', '')}</Text>
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
					{integration.publicationName &&
						integration.publicationName.length > 0 && (
							<>
								<Text className={classes.integrationDetailText}>
									{integration.publicationName}
								</Text>
							</>
						)}
					{integration.gatherTownSpacePw &&
						integration.gatherTownSpacePw.length > 0 && (
							<>
								<div className={classes.rowCentered}>
									<Key size={20} />
									<Space w={4} />
									<Text
										className={
											classes.integrationDetailText
										}
									>
										{integration.gatherTownSpacePw}
									</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={e => {
											e.stopPropagation()
											navigator.clipboard.writeText(
												integration.gatherTownSpacePw ??
													''
											)
											showNotification({
												radius: 'lg',
												title: 'Password copied!',
												autoClose: 2000,
												color: 'green',
												icon: <Check />,
												message: `This club's Gather Town Space password was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
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
			{!isLoadingClub &&
				!errorAnonClub &&
				!errorMemberClub &&
				!club?.name && (
					<Container>
						<Space h={120} />
						<Center>
							<Text>Sorry, that club does not exist!</Text>
						</Center>
					</Container>
				)}
			{!isLoadingClub && (errorAnonClub || errorMemberClub) && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this club. Please let us
							know!
						</Text>
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
								{club.isCurrentUserClubMember &&
									wallet.isConnected && (
										<Button
											onClick={leaveClub}
											loading={isLeavingClub}
											className={classes.buttonJoinClub}
										>
											Leave
										</Button>
									)}
								{!club.isCurrentUserClubMember &&
									wallet.isConnected && (
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
															club
																.membershipSettings
																?.costToJoin ??
															0
													  } MATIC`
													: wallet.isConnected
													? `Join`
													: '')}
											{!doesMeetAllRequirements &&
												wallet.isConnected &&
												'Requirements not met'}
											{!wallet.isConnected &&
												'Connect wallet to join'}
										</Button>
									)}
								{!wallet.isConnected && (
									<Button
										onClick={async () => {
											await wallet.connectWallet()
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

								{club.isCurrentUserClubAdmin &&
									wallet.isConnected && (
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
						{(!club.isCurrentUserClubMember ||
							club.isCurrentUserClubAdmin) && (
							<>
								<Text
									className={classes.clubDetailSectionTitle}
								>
									Membership Requirements
								</Text>
								{!areRequirementsParsed && (
									<div
										className={
											classes.requirementsContainer
										}
									>
										<Loader color="red" variant="oval" />
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
															<CircleCheck
																className={
																	classes.requirementIcon
																}
																color="green"
															/>
														)}

														{!requirement.meetsRequirement && (
															<CircleX
																className={
																	classes.requirementIcon
																}
																color="red"
															/>
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
						)}

						{club.isCurrentUserClubAdmin && (
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
						{!club.isCurrentUserClubMember &&
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
											? ` - more apps available for club members`
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
						{club.isCurrentUserClubMember &&
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

						{club.isCurrentUserClubAdmin &&
							userHasPermissionManageApps(club) &&
							club.allIntegrations &&
							club.allIntegrations.length === 0 && (
								<>
									<Text
										className={
											classes.clubDetailSectionTitle
										}
									>{`Apps`}</Text>
									<Alert
										icon={<AlertCircle />}
										color="red"
										radius="lg"
									>
										<Text
											className={
												classes.appsEmptyStateTitle
											}
										>{`Add your first apps`}</Text>
										<Space h={4} />
										<Text
											className={
												classes.appsEmptyStateText
											}
										>{`Your club doesn't have any links or connected apps. That means there's nothing for your members to do when they join, and there's no other information about this club right now. Fix this by adding some apps!`}</Text>
										<Space h={8} />
										<Button
											onClick={() => {
												window.open(
													`/${club.slug}/admin?tab=apps`
												)
											}}
											className={classes.buttonJoinClub}
										>
											{' '}
											{`Add apps`}
										</Button>
									</Alert>
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
															: member.wallet.toLowerCase() ===
															  process.env
																	.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
															? 'meem.eth'
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
											<ClubMemberCard member={member} />
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
					<JoinLeaveClubModal
						isOpened={isJoiningClub || isLeavingClub}
						onModalClosed={() => {}}
					/>
				</>
			)}
		</>
	)
}
