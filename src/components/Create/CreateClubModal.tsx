import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Image, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import { useSockets, useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import Cookies from 'js-cookie'
import { uniq } from 'lodash'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import {
	MeemContracts,
	MyClubsSubscriptionSubscription
} from '../../../generated/graphql'
import { SUB_MY_CLUBS } from '../../graphql/clubs'
import clubFromMeemContract, {
	MembershipSettings,
	MembershipRequirementToMeemPermission,
	Club
} from '../../model/club/club'
import { useCustomApollo } from '../../providers/ApolloProvider'
import { CookieKeys } from '../../utils/cookies'
import { hostnameToChainId } from '../App'
import { colorGreen, colorPink, useClubsTheme } from '../Styles/ClubsTheme'
interface IProps {
	membershipSettings?: MembershipSettings
	isOpened: boolean
	onModalClosed: () => void
}

export const CreateClubModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	membershipSettings
}) => {
	const router = useRouter()

	const wallet = useWallet()

	const { userClient } = useCustomApollo()

	const { classes: clubsTheme } = useClubsTheme()

	const [hasStartedCreating, setHasStartedCreating] = useState(false)

	const [hasStartedCreatingSafe, setHasStartedCreatingSafe] = useState(false)

	const [hasSubscribedToSockets, setHasSubscribedToSockets] = useState(false)

	const { connect, sockets, isConnected: isSocketsConnected } = useSockets()

	const [clubSlug, setClubSlug] = useState('')

	const closeModal = useCallback(() => {
		if (sockets) {
			sockets.unsubscribe([
				{ type: MeemAPI.MeemEvent.Err },
				{ type: MeemAPI.MeemEvent.MeemIdUpdated },
				{ type: MeemAPI.MeemEvent.MeemMinted }
			])
		}
		onModalClosed()

		setHasStartedCreating(false)
		setHasStartedCreatingSafe(false)
		setHasSubscribedToSockets(false)
	}, [onModalClosed, sockets])

	// Club subscription - watch for specific changes in order to update correctly
	const { data: myClubsData } =
		useSubscription<MyClubsSubscriptionSubscription>(SUB_MY_CLUBS, {
			variables: {
				walletAddress: wallet.accounts[0],
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			client: userClient
		})

	useEffect(() => {
		if (!isSocketsConnected && isOpened) {
			connect()

			log.debug(`${JSON.stringify(membershipSettings)}`)
		}
	}, [connect, isOpened, isSocketsConnected, membershipSettings])

	useEffect(() => {
		async function finishClubCreation() {
			// Successfully created club
			log.debug('club creation complete')

			// Remove all metadata cookies!
			Cookies.remove(CookieKeys.clubName)
			Cookies.remove(CookieKeys.clubDescription)
			Cookies.remove(CookieKeys.clubImage)
			Cookies.remove(CookieKeys.clubExternalUrl)

			// Route to the created club detail page
			showNotification({
				radius: 'lg',
				title: 'Success!',
				autoClose: 5000,
				color: colorGreen,
				icon: <Check color="green" />,

				message: `Your club has been published.`
			})

			router.push({
				pathname: `/${Cookies.get(CookieKeys.clubSlug)}`
			})
			Cookies.remove(CookieKeys.clubSlug)
		}

		async function createSafe(club: Club) {
			if (hasStartedCreatingSafe || !wallet.chainId) {
				return
			}
			setHasStartedCreatingSafe(true)
			log.debug(
				`creating safe with id ${club.id}, admins ${JSON.stringify(
					membershipSettings?.clubAdminsAtClubCreation
				)} ...`
			)

			try {
				const createSafeFetcher = makeFetcher<
					MeemAPI.v1.CreateClubSafe.IQueryParams,
					MeemAPI.v1.CreateClubSafe.IRequestBody,
					MeemAPI.v1.CreateClubSafe.IResponseBody
				>({
					method: MeemAPI.v1.CreateClubSafe.method
				})

				await createSafeFetcher(
					MeemAPI.v1.CreateClubSafe.path({
						meemContractId: club.id ?? ''
					}),
					undefined,
					{
						safeOwners:
							uniq(
								membershipSettings?.clubAdminsAtClubCreation
							) ?? [],
						chainId:
							wallet.chainId ??
							hostnameToChainId(
								global.window ? global.window.location.host : ''
							)
					}
				)
			} catch (e) {
				// Ignore - the user can create later?
				finishClubCreation()
			}
		}

		async function create() {
			log.debug('creating club...')
			if (!wallet.web3Provider || !wallet.chainId) {
				log.debug('no web3 provider, returning.')
				showNotification({
					radius: 'lg',
					title: 'Error Creating Club',
					message: 'Please connect your wallet first.',
					color: colorPink
				})
				closeModal()
				setHasStartedCreating(false)
				return
			}

			if (!membershipSettings) {
				log.debug('no membership settings found, returning.')
				showNotification({
					radius: 'lg',
					title: 'Error Creating Club',
					message:
						'An error occurred while creating the club. Please try again.',
					color: colorPink
				})

				closeModal()
				setHasStartedCreating(false)
				return
			}

			try {
				const createContractFetcher = makeFetcher<
					MeemAPI.v1.CreateMeemContract.IQueryParams,
					MeemAPI.v1.CreateMeemContract.IRequestBody,
					MeemAPI.v1.CreateMeemContract.IResponseBody
				>({
					method: MeemAPI.v1.CreateMeemContract.method
				})

				log.debug('assemble fetcher')

				const splits =
					membershipSettings.membershipFundsAddress.length > 0 &&
					membershipSettings.costToJoin > 0
						? [
								{
									amount: 10000,
									toAddress:
										membershipSettings.membershipFundsAddress,
									lockedBy: MeemAPI.zeroAddress
								}
						  ]
						: []

				const mintPermissions: MeemAPI.IMeemPermission[] =
					membershipSettings.requirements.map(mr => {
						return MembershipRequirementToMeemPermission({
							...mr,
							costEth: membershipSettings.costToJoin,
							mintStartTimestamp:
								membershipSettings.membershipStartDate
									? membershipSettings.membershipStartDate.getTime() /
									  1000
									: 0,
							mintEndTimestamp:
								membershipSettings.membershipEndDate
									? membershipSettings.membershipEndDate.getTime() /
									  1000
									: 0
						})
					})

				log.debug(
					`call createContractFetcher for ${Cookies.get(
						CookieKeys.clubName
					)}`
				)

				// Setup application instructions for club
				const applicationInstructions: string[] = []
				membershipSettings.requirements.forEach(requirement => {
					if (
						requirement.applicationInstructions &&
						requirement.applicationInstructions?.length > 0
					) {
						applicationInstructions.push(
							requirement.applicationInstructions
						)
					}
				})

				if (mintPermissions.length === 0) {
					showNotification({
						radius: 'lg',
						title: 'Oops!',
						message: `This club has invalid membership requirements. Please double-check your entries and try again.`,
						color: colorPink
					})
					closeModal()
					setHasStartedCreating(false)
					return
				}

				const data = {
					shouldMintTokens: true,
					metadata: {
						meem_contract_type: 'meem-club',
						meem_metadata_version: 'MeemClub_Contract_20220718',
						name: Cookies.get(CookieKeys.clubName),
						description: Cookies.get(CookieKeys.clubDescription),
						image: Cookies.get(CookieKeys.clubImage),
						associations: [],
						external_url: '',
						application_instructions: applicationInstructions
					},
					name: Cookies.get(CookieKeys.clubName) ?? '',
					admins: membershipSettings.clubAdminsAtClubCreation,
					minters: membershipSettings.clubAdminsAtClubCreation,
					maxSupply: ethers.BigNumber.from(
						membershipSettings.membershipQuantity
					).toHexString(),
					mintPermissions,
					splits,
					tokenMetadata: {
						meem_metadata_version: 'MeemClub_Token_20220718',
						description: `Membership token for ${Cookies.get(
							CookieKeys.clubName
						)}`,
						name: `${Cookies.get(
							CookieKeys.clubName
						)} membership token`,
						image: Cookies.get(CookieKeys.clubImage),
						associations: [],
						external_url: ''
					},
					chainId:
						wallet.chainId ??
						hostnameToChainId(
							global.window ? global.window.location.host : ''
						)
				}

				log.debug(`${JSON.stringify(data, null, 2)}`)

				await createContractFetcher(
					MeemAPI.v1.CreateMeemContract.path(),
					undefined,
					data
				)

				log.debug('finish fetcher')
			} catch (e) {
				log.crit(e)
				showNotification({
					radius: 'lg',
					title: 'Error Creating Club',
					message:
						'An error occurred while creating the club. Please try again.',
					color: colorPink
				})

				closeModal()
				setHasStartedCreating(false)
			}
		}

		if (!hasSubscribedToSockets && sockets && wallet.accounts[0]) {
			sockets.subscribe(
				[{ key: MeemAPI.MeemEvent.Err }],
				wallet.accounts[0]
			)
			sockets.on({
				eventName: MeemAPI.MeemEvent.Err,
				handler: err => {
					if (err.detail.code === 'CONTRACT_CREATION_FAILED') {
						showNotification({
							radius: 'lg',
							title: 'Club Creation Failed',
							message:
								'An error occurred while creating the club. Please try again.',
							color: colorPink
						})

						closeModal()
					} else if (err.detail.code === 'SAFE_CREATE_FAILED') {
						// If there's an error with creating the safe, ignore it
						// and proceed to club homepage
						log.debug('Safe creation failed. Skipping for now...')
						finishClubCreation()
					} else if (err.detail.code === 'TX_LIMIT_EXCEEDED') {
						showNotification({
							radius: 'lg',
							title: 'Transaction limit exceeded',
							message:
								'You have used all the transactions available to you today. Get in touch or wait until tomorrow.',
							color: colorPink
						})
					} else {
						// Handle a generic socket error too
						showNotification({
							radius: 'lg',
							title: 'Club Creation Failed',
							message:
								'An error occurred while creating the club. Please try again.',
							color: colorPink
						})

						closeModal()
					}
					log.crit('SOCKET ERROR CAUGHT!!!!!!!!!!')
					log.crit(err)
					log.crit(err.detail.code)
				}
			})
			setHasSubscribedToSockets(true)
		}

		async function checkClubState() {
			log.debug('listening for new club...')
			const newClub = myClubsData?.Meems.find(
				m => m.MeemContract?.name === Cookies.get(CookieKeys.clubName)
			)
			if (newClub) {
				if (
					newClub.MeemContract &&
					newClub.MeemContract.gnosisSafeAddress
				) {
					finishClubCreation()
				} else {
					const clubModel = await clubFromMeemContract(
						wallet,
						wallet.accounts[0],
						newClub.MeemContract as MeemContracts
					)

					setClubSlug(clubModel.slug ?? '')

					// Create club safe (if not on Optimism Goerli)
					if (wallet.chainId !== 420) {
						await createSafe(clubModel)
					} else {
						finishClubCreation()
					}
				}
			}
		}

		// Create the club
		if (isOpened && !hasStartedCreating) {
			setHasStartedCreating(true)
			create()
		}

		// Start monitoring
		if (isOpened) {
			if (wallet.accounts.length > 0) {
				checkClubState()
			} else {
				log.debug('No club data (yet) or wallet not connected...')
			}
		}
	}, [
		closeModal,
		clubSlug,
		hasStartedCreating,
		hasStartedCreatingSafe,
		hasSubscribedToSockets,
		isOpened,
		membershipSettings,
		myClubsData?.Meems,
		onModalClosed,
		router,
		sockets,
		wallet
	])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={false}
				radius={16}
				overlayBlur={8}
				padding={'lg'}
				opened={isOpened}
				onClose={() => closeModal()}
			>
				<div className={clubsTheme.modalHeader}>
					<Loader color="red" variant="oval" />
					<Space h={16} />
					<Text
						className={clubsTheme.tLargeBold}
					>{`We're creating your club!`}</Text>
					<Space h={32} />
					<Image
						height={120}
						width={120}
						fit={'cover'}
						className={clubsTheme.imageClubLogo}
						src={Cookies.get(CookieKeys.clubImage)}
					/>
					<Space h={16} />
					<Text className={clubsTheme.tLargeBold}>
						{Cookies.get(CookieKeys.clubName)}
					</Text>
					<Space h={24} />

					<Text
						className={clubsTheme.tExtraSmall}
						style={{ textAlign: 'center' }}
					>
						This could take a few minutes.
					</Text>
					<Space h={16} />

					<Text
						className={clubsTheme.tExtraSmall}
						style={{ textAlign: 'center' }}
					>{`Please don’t refresh or close this window until this step is complete.`}</Text>
				</div>
				<Space h={8} />
			</Modal>
		</>
	)
}
