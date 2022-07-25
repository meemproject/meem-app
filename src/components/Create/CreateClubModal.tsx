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
import { useWallet } from '@meemproject/react'
import { Contract, ethers } from 'ethers'
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
	Integration,
	MembershipReqType,
	MembershipSettings
} from '../../model/club/club'
import { CookieKeys } from '../../utils/cookies'

const useStyles = createStyles(theme => ({
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

	const [proxyAddress, setProxyAddress] = useState('')
	const [contractUri, setContractUri] = useState('')

	const create = async () => {
		if (!wallet.web3Provider) {
			return
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
		async function checkClubState(data: ClubSubscriptionSubscription) {
			if (data.MeemContracts.length > 0) {
				// Successfully initialized club
				log.debug('init complete')
			}
		}

		if (clubData && wallet.accounts.length > 0) {
			// TODO
			//	checkClubState(clubData)
		} else {
			log.debug('No club data (yet) or wallet not connected...')
		}
	}, [clubData, router, wallet])

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
