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
} from '../../../../generated/graphql'
import { GET_CLUB, GET_CLUB_SLUG, SUB_CLUB } from '../../../graphql/clubs'
import zeenFromApi, { Zeen } from '../../../model/apps/zeen/zeen'
import clubFromMeemContract, {
	Club,
	MembershipReqType
} from '../../../model/club/club'
import { getClubSlug } from '../../../utils/slugs'

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

	zeenDetailSectionTitle: {
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
	copy: {
		marginLeft: 4,
		padding: 2,
		cursor: 'pointer'
	},
	linkItem: {
		color: 'rgba(255, 102, 81, 1)',
		textDecoration: 'underline',
		cursor: 'pointer',
		fontWeight: 600
	},
	row: {
		display: 'flex',
		flexDirection: 'row'
	}
}))

interface IProps {
	slug: string
}

export const ZeenDetailComponent: React.FC<IProps> = ({ slug }) => {
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	// TODO: Load zeen
	const {
		loading,
		error,
		data: zeenData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { slug }
	})

	// TODO: remove when we have real data
	const [hasGotMockZeen, setHasGotMockZeen] = useState(false)
	const [zeen, setZeen] = useState<Zeen | undefined>()
	const [zeenPosts, setZeenPosts] = useState([])
	const [isLoadingZeen, setIsLoadingZeen] = useState(true)

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

	useEffect(() => {
		// TODO: Load the actual zeen
		// async function getZeen(data: GetClubQuery) {
		// 	setIsLoadingZeen(true)
		// 	const possibleZeen = await clubFromMeemContract(
		// 		wallet,
		// 		wallet.isConnected ? wallet.accounts[0] : '',
		// 		data.MeemContracts[0] as MeemContracts
		// 	)
		// 	if (possibleZeen && possibleZeen.name) {
		// 		setZeen(possibleZeen)
		// 	}
		// 	setZeen(newClub)
		// 	setIsLoadingZeen(false)
		// }
		// if (!loading && !error && !zeen && zeenData) {
		// 	getZeen(zeenData)
		// }
		async function getMockZeen() {
			const possibleZeen = await zeenFromApi(wallet)

			if (possibleZeen && possibleZeen.name) {
				setZeen(possibleZeen)
			}
			setIsLoadingZeen(false)
		}

		// TODO: Remove mockzeen when we have data
		if (!hasGotMockZeen) {
			setHasGotMockZeen(true)
			getMockZeen()
		}
	}, [
		zeen,
		zeenData,
		error,
		loading,
		wallet,
		wallet.accounts,
		wallet.isConnected,
		wallet.web3Provider,
		hasGotMockZeen
	])

	const navigateToSettings = () => {
		router.push({ pathname: `${getClubSlug()}/zeen/${slug}/admin` })
	}

	return (
		<>
			{isLoadingZeen && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
				</Container>
			)}
			{!isLoadingZeen && !zeen?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingZeen && zeen?.name && (
				<>
					<div className={classes.header}>
						<Image
							className={classes.clubLogoImage}
							src={zeen.image}
						/>
						<div>
							<Text className={classes.headerClubName}>
								{zeen.name}
							</Text>
							<Text className={classes.headerClubDescription}>
								{zeen.description}
							</Text>
							<Space h={12} />
							<div className={classes.row}>
								<Text>♣ from</Text>
								<Space w={5} />
								<a
									className={classes.linkItem}
									onClick={() => {
										router.push({
											pathname: `/${zeen.clubSlug}`
										})
									}}
								>
									{zeen.clubName}
								</a>
							</div>
						</div>
					</div>

					<Container>
						<Space h={'xl'} />
						<Text className={classes.zeenDetailSectionTitle}>
							{zeenPosts.length === 0
								? 'Meemzine does not have any public posts yet.'
								: 'Posts'}
						</Text>
					</Container>
				</>
			)}
		</>
	)
}
