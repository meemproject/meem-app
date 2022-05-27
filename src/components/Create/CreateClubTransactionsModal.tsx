/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	useLazyQuery,
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
	Modal,
	Divider,
	Stepper,
	Loader,
	MantineProvider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { Chain, Permission, UriSource } from '@meemproject/meem-contracts'
import * as meemContracts from '@meemproject/meem-contracts'
import meemABI from '@meemproject/meem-contracts/types/Meem.json'
import { useWallet } from '@meemproject/react'
import { Contract } from 'ethers'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
	BrandDiscord,
	BrandTwitter,
	Check,
	CircleCheck,
	Settings
} from 'tabler-icons-react'
import {
	ClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import { GET_CLUB_SLUG, SUB_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, {
	MembershipReqType,
	MembershipSettings
} from '../../model/club/club'
import { CookieKeys } from '../../utils/cookies'

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubName: {
		fontSize: 16,
		marginLeft: 16
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 40,
		height: 40,
		minHeight: 40,
		minWidth: 40
	},
	stepsContainer: {
		border: '1px solid rgba(204, 204, 204, 1)',
		borderRadius: 16,
		padding: 16
	},
	buttonConfirm: {
		paddingTop: 8,
		paddingLeft: 16,
		paddingBottom: 8,
		paddingRight: 16,
		color: 'white',
		backgroundColor: 'black',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	stepDescription: {
		fontSize: 14
	}
}))

interface IProps {
	membershipSettings?: MembershipSettings
	isOpened: boolean
	onModalClosed: () => void
}

enum Step {
	Start,
	Creating,
	Created,
	Initializing,
	Initialized,
	Minting,
	Minted
}

export const CreateClubTransactionsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	membershipSettings
}) => {
	const router = useRouter()

	const { web3Provider, accounts, signer } = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)
	const [proxyAddress, setProxyAddress] = useState('')
	let contractURI = ''

	const create = async () => {
		if (!web3Provider) {
			return
		}

		setStep(Step.Creating)
		try {
			const contract = await meemContracts.deployProxy({
				signer: web3Provider.getSigner()
			})

			console.log(
				`Deployed proxy at ${contract.address} w/ tx: ${contract.deployTransaction.hash}`
			)
			setProxyAddress(contract.address)
			setStep(Step.Created)
		} catch (e) {
			setStep(Step.Start)
			showNotification({
				title: 'Error creating club.',
				message: `${e as string}`
			})
		}
	}

	// Club subscription - watch for specific changes in order to update correctly
	const { data: clubData, loading } =
		useSubscription<ClubSubscriptionSubscription>(SUB_CLUB, {
			variables: { address: proxyAddress }
		})

	// When club data is available, use this to guide to the next step
	// when initializing, check if the club exists yet > Initialized
	// when minting, check if user is a club member yet > Minted
	useEffect(() => {
		if (clubData && accounts.length > 0) {
			console.log('New club detected in the DB via subscription')
			if (clubData.MeemContracts.length > 0 && step === Step.Initializing) {
				// Successfully initialized club
				console.log('init complete')
				setStep(Step.Initialized)
			} else if (clubData.MeemContracts.length > 0 && step === Step.Minting) {
				const club = clubFromMeemContract(
					accounts[0],
					clubData.MeemContracts[0] as MeemContracts
				)
				console.log('minting...')
				if (club.isClubMember) {
					console.log('mint complete')
					// Remove all metadata cookies!
					Cookies.remove(CookieKeys.clubName)
					Cookies.remove(CookieKeys.clubDescription)
					Cookies.remove(CookieKeys.clubImage)
					Cookies.remove(CookieKeys.clubExternalUrl)
					Cookies.remove(CookieKeys.clubSlug)

					// Route to the created club detail page
					showNotification({
						title: 'Success!',
						autoClose: 5000,
						color: 'green',
						icon: <Check color="green" />,

						message: `Your club has been published.`
					})
					router.push({ pathname: `/${club.slug}` })

					setStep(Step.Minted)
				}
			}
		} else {
			console.log('No club data (yet) or wallet not connected...')
		}
	}, [accounts, accounts.length, clubData, router, step])

	const initialize = async () => {
		if (!web3Provider) {
			return
		}

		setStep(Step.Initializing)

		try {
			const clubSymbol = (Cookies.get(CookieKeys.clubName) ?? '')
				.split(' ')[0]
				.toUpperCase()

			const applicationLinks: string[] = []
			if (membershipSettings) {
				membershipSettings.requirements.forEach(requirement => {
					if (
						requirement.applicationLink &&
						requirement.applicationLink?.length > 0
					) {
						applicationLinks.push(requirement.applicationLink)
					}
				})
			}

			contractURI = JSON.stringify({
				name: Cookies.get(CookieKeys.clubName),
				description: Cookies.get(CookieKeys.clubDescription),
				image: Cookies.get(CookieKeys.clubImage),
				external_link: Cookies.get(CookieKeys.clubExternalUrl),
				application_links: applicationLinks
			})

			let membershipStartUnix = 0
			let membershipEndUnix = 0
			if (membershipSettings) {
				if (membershipSettings.membershipStartDate) {
					membershipStartUnix = Math.floor(
						new Date(membershipSettings.membershipStartDate).getTime() / 1000
					)
				}
				if (membershipSettings.membershipEndDate) {
					membershipEndUnix = Math.floor(
						new Date(membershipSettings.membershipEndDate).getTime() / 1000
					)
				}
			}

			const joinCostInWei = membershipSettings
				? membershipSettings.costToJoin * 1000000000
				: 0

			const mintPermissions: any[] = []
			if (membershipSettings) {
				membershipSettings.requirements.forEach(requirement => {
					switch (requirement.type) {
						case MembershipReqType.None:
							// Anyone can join for X MATIC
							mintPermissions.push({
								permission: Permission.Anyone,
								addresses: [],
								numTokens: 0,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
						case MembershipReqType.ApprovedApplicants:
							// Approved applicants join for X MATIC
							mintPermissions.push({
								permission: Permission.Addresses,
								addresses: requirement.approvedAddresses,
								numTokens: 0,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
						case MembershipReqType.NftHolders:
							//NFT holders with 1+ tokens can join for X MATIC
							mintPermissions.push({
								permission: Permission.Holders,
								addresses: [requirement.tokenContractAddress],
								numTokens: 1,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
						case MembershipReqType.TokenHolders:
							//Token holders with X tokens can join for X MATIC
							mintPermissions.push({
								permission: Permission.Holders,
								addresses: [requirement.tokenContractAddress],
								numTokens: requirement.tokenMinQuantity,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
						case MembershipReqType.OtherClubMember:
							// Members of X club can join for X MATIC
							mintPermissions.push({
								permission: Permission.Holders,
								addresses: [requirement.clubContractAddress],
								numTokens: requirement.tokenMinQuantity,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
					}
				})
			}

			const baseProperties = {
				// Total # of tokens available. -1 means unlimited.
				totalOriginalsSupply: membershipSettings
					? membershipSettings.membershipQuantity === 0 ||
					  isNaN(membershipSettings.membershipQuantity)
						? -1
						: membershipSettings.membershipQuantity
					: -1,
				totalOriginalsSupplyLockedBy: MeemAPI.zeroAddress,
				// Specify who can mint originals
				mintPermissions,
				mintPermissionsLockedBy: MeemAPI.zeroAddress,
				// Payout of minting
				splits:
					membershipSettings &&
					membershipSettings.membershipFundsAddress.length > 0
						? [
								{
									toAddress: membershipSettings
										? membershipSettings.membershipFundsAddress
										: accounts[0],
									// Amount in basis points 10000 == 100%
									amount: 10000,
									lockedBy: MeemAPI.zeroAddress
								}
						  ]
						: [],
				splitsLockedBy: MeemAPI.zeroAddress,
				// Number of originals allowed to be held by the same wallet
				originalsPerWallet: -1,
				originalsPerWalletLockedBy: MeemAPI.zeroAddress,
				// Whether originals are transferrable
				isTransferrable: true,
				isTransferrableLockedBy: MeemAPI.zeroAddress,
				// Mint start unix timestamp
				mintStartTimestamp: membershipStartUnix,
				// Mint end unix timestamp
				mintEndTimestamp: membershipEndUnix,
				mintDatesLockedBy: MeemAPI.zeroAddress,
				// Prevent transfers until this unix timestamp
				transferLockupUntil: 0,
				transferLockupUntilLockedBy: MeemAPI.zeroAddress
			}

			console.log(`baseProperties: ${JSON.stringify(baseProperties)}`)
			console.log(`club symbol: ${clubSymbol}`)
			console.log(`club admins: ${membershipSettings?.clubAdmins}`)

			const tx = await meemContracts.initProxy({
				signer: web3Provider.getSigner(),
				proxyContractAddress: proxyAddress,
				name: Cookies.get(CookieKeys.clubName) ?? '',
				symbol: clubSymbol,
				admins: membershipSettings ? membershipSettings.clubAdmins : [],
				contractURI,
				chain:
					process.env.NEXT_PUBLIC_NETWORK === 'rinkeby'
						? Chain.Rinkeby
						: Chain.Polygon,
				version: 'latest',
				baseProperties
			})
			// @ts-ignore
			await tx.wait()

			log.debug(tx)
		} catch (e) {
			setStep(Step.Created)
			showNotification({
				title: 'Error initalizing club.',
				message: `${e as string}`
			})
		}
	}

	const mint = async () => {
		if (!web3Provider) {
			return
		}
		setStep(Step.Minting)
		try {
			const meemContract = new Contract(
				proxyAddress,
				meemABI,
				signer
			) as unknown as meemContracts.Meem

			const data = {
				to: accounts[0],
				tokenURI: contractURI,
				parentChain: MeemAPI.Chain.Polygon,
				parent: MeemAPI.zeroAddress,
				parentTokenId: 0,
				meemType: MeemAPI.MeemType.Original,
				uriSource: UriSource.Json,
				isURILocked: false,
				reactionTypes: ['upvote', 'downvote', 'heart'],
				mintedBy: accounts[0]
			}

			console.log(data)

			const tx = await meemContract?.mint(
				data,
				meemContracts.defaultMeemProperties,
				meemContracts.defaultMeemProperties,
				{ gasLimit: '1000000' }
			)

			await tx.wait()
		} catch (e) {
			setStep(Step.Initialized)

			showNotification({
				title: 'Error minting club membership.',
				message: `Please get in touch!`
			})
		}
	}

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				size={'lg'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>Finalize club creation</Text>
				}
				onClose={() => onModalClosed()}
			>
				<Divider />
				<Space h={12} />
				<div className={classes.header}>
					<div className={classes.headerTitle}>
						<Image
							className={classes.clubLogoImage}
							src={Cookies.get(CookieKeys.clubImage)}
						/>
						<Text className={classes.headerClubName}>
							{Cookies.get(CookieKeys.clubName)}
						</Text>
					</div>
				</div>
				<Space h={12} />

				<div className={classes.stepsContainer}>
					<MantineProvider
						theme={{
							colors: {
								brand: [
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E'
								]
							},
							primaryColor: 'brand'
						}}
					>
						<Stepper
							size="md"
							color="green"
							orientation="vertical"
							active={
								step === Step.Start || step === Step.Creating
									? 0
									: step === Step.Created || step === Step.Initializing
									? 1
									: step === Step.Initialized || step === Step.Minting
									? 2
									: 3
							}
						>
							<Stepper.Step
								label="Establish Club"
								loading={step === Step.Creating}
								description={
									step !== Step.Start && step !== Step.Creating ? null : (
										<>
											{step === Step.Start && (
												<div>
													<Space h={12} />
													<a onClick={create} className={classes.buttonConfirm}>
														Confirm
													</a>
												</div>
											)}
										</>
									)
								}
							/>
							<Stepper.Step
								label="Authorize membership settings"
								loading={step === Step.Initializing}
								description={
									step !== Step.Created && step !== Step.Initializing ? (
										<Text className={classes.stepDescription}>
											Multiple transactions may occur if several updates were
											made.
										</Text>
									) : (
										<>
											{step === Step.Created && (
												<div>
													<Space h={12} />

													<a
														onClick={initialize}
														className={classes.buttonConfirm}
													>
														Confirm
													</a>
												</div>
											)}
										</>
									)
								}
							/>
							<Stepper.Step
								label="Confirm club creation"
								loading={step === Step.Minting}
								description={
									step !== Step.Initialized && step !== Step.Minting ? (
										<Text className={classes.stepDescription}>
											Your club will be published at the URL you selected once
											this step is complete.
										</Text>
									) : (
										<>
											{step === Step.Initialized && (
												<div>
													<Space h={12} />

													<a onClick={mint} className={classes.buttonConfirm}>
														Confirm
													</a>
												</div>
											)}
										</>
									)
								}
							/>
						</Stepper>
					</MantineProvider>
					{(step === Step.Initialized || step === Step.Minted) && (
						<Space h={'xs'} />
					)}
				</div>
			</Modal>
		</>
	)
}
