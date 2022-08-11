import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { createStyles, Text, Image, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { MyClubsSubscriptionSubscription } from '../../../generated/graphql'
import { SUB_MY_CLUBS } from '../../graphql/clubs'
import {
	MembershipSettings,
	MembershipRequirementToMeemPermission
} from '../../model/club/club'
import { CookieKeys } from '../../utils/cookies'

const useStyles = createStyles(() => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
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
		flexDirection: 'column'
	},
	headerClubName: {
		fontSize: 16
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 40,
		height: 40,
		minHeight: 40,
		minWidth: 40,
		marginBottom: 32
	},
	title: {
		fontWeight: 600,
		fontSize: 20
	},
	info: {
		fontWeight: 600,
		textAlign: 'center',
		fontSize: 15
	}
}))

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

	const { classes } = useStyles()

	const [hasStartedCreating, setHasStartedCreating] = useState(false)

	// Club subscription - watch for specific changes in order to update correctly
	const { data: myClubsData } =
		useSubscription<MyClubsSubscriptionSubscription>(SUB_MY_CLUBS, {
			variables: { walletAddress: wallet.accounts[0] }
		})

	useEffect(() => {
		async function create() {
			log.debug('creating club...')
			if (!wallet.web3Provider) {
				log.debug('no web3 provider, returning.')
				showNotification({
					title: 'Error Creating Club',
					message: 'Please connect your wallet first.',
					color: 'red'
				})
				onModalClosed()
				setHasStartedCreating(false)
				return
			}

			if (!membershipSettings) {
				log.debug('no membership settings found, returning.')
				showNotification({
					title: 'Error Creating Club',
					message:
						'An error occurred while creating the club. Please try again.',
					color: 'red'
				})

				onModalClosed()
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

				const data = {
					shouldMintAdminTokens: true,
					metadata: {
						meem_contract_type: 'meem-club',
						meem_metadata_version: 'Meem_Contract_20220718',
						name: Cookies.get(CookieKeys.clubName),
						description: Cookies.get(CookieKeys.clubDescription),
						image: Cookies.get(CookieKeys.clubImage),
						associations: [],
						external_url: ''
						// application_instructions: applicationInstructions
					},
					name: Cookies.get(CookieKeys.clubName) ?? '',
					admins: membershipSettings.clubAdminsAtClubCreation,
					minters: membershipSettings.clubAdminsAtClubCreation,
					maxSupply: ethers.BigNumber.from(
						membershipSettings.membershipQuantity
					).toHexString(),
					mintPermissions,
					splits,
					adminTokenMetadata: {
						meem_metadata_version: 'Meem_Token_20220718',
						description: `Membership token for ${Cookies.get(
							CookieKeys.clubName
						)}`,
						name: `${Cookies.get(
							CookieKeys.clubName
						)} membership token`,
						image: Cookies.get(CookieKeys.clubImage),
						associations: [],
						external_url: ''
					}
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
					title: 'Error Creating Club',
					message:
						'An error occurred while creating the club. Please try again.',
					color: 'red'
				})

				onModalClosed()
				setHasStartedCreating(false)
			}
		}
		async function checkClubState() {
			log.debug('listening for new club...')
			const newClub = myClubsData?.Meems.find(
				m => m.MeemContract?.name === Cookies.get(CookieKeys.clubName)
			)
			if (newClub) {
				// Successfully created club
				log.debug('init complete')

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

				router.push({
					pathname: `/${newClub.MeemContract?.slug}`
				})
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
		hasStartedCreating,
		isOpened,
		membershipSettings,
		myClubsData?.Meems,
		onModalClosed,
		router,
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
				padding={'lg'}
				opened={isOpened}
				onClose={() => onModalClosed()}
			>
				<div className={classes.header}>
					<Loader />
					<Space h={16} />
					<Text
						className={classes.title}
					>{`We're creating your club!`}</Text>
					<Space h={32} />
					<Image
						className={classes.clubLogoImage}
						src={Cookies.get(CookieKeys.clubImage)}
					/>
					<Text className={classes.headerClubName}>
						{Cookies.get(CookieKeys.clubName)}
					</Text>
					<Space h={24} />

					<Text className={classes.info}>
						This could take a few minutes.
					</Text>
					<Space h={16} />

					<Text
						className={classes.info}
					>{`Please don’t refresh or close this window until this step is complete.`}</Text>
				</div>
				<Space h={12} />
			</Modal>
		</>
	)
}
