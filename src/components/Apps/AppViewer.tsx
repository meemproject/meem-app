/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader,
	Button
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'
import { GetClubQuery, MeemContracts } from '../../../generated/graphql'
import { GET_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, { Club, Integration } from '../../model/club/club'
import { capitalizeFirstLetter } from '../../utils/strings'

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 8,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 8,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 8,
			paddingTop: 16
		}
	},
	headerArrow: {
		marginRight: 24,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerAppNameContainer: {
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginLeft: 16
		}
	},
	headerAppNameRow: {
		display: 'flex',
		flexDirection: 'row'
	},
	headerAppName: {
		fontWeight: 600,
		fontSize: 20,
		textTransform: 'capitalize',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	headerAppImage: {
		paddingTop: 4
	},
	clubUrlContainer: {
		marginTop: 8,
		display: 'flex',
		flexDirection: 'row'
	},
	clubUrl: {
		fontSize: 14,
		opacity: 0.6,
		fontWeight: 500
	},

	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 80,
		height: 80,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 40,
			height: 40,
			minHeight: 40,
			minWidth: 40,
			marginLeft: 16
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
	buttonEditProfile: {
		borderRadius: 24,
		marginRight: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 0,
			marginLeft: 16,
			marginRight: 0,
			borderColor: 'transparent'
		}
	},
	tabs: {
		display: 'flex',
		flexDirection: 'row'
	},

	activeTab: {
		fontSize: 18,
		marginBottom: 16,
		marginRight: 24,
		fontWeight: 600,
		color: 'black',
		textDecoration: 'underline',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginRight: 16
		}
	},
	inactiveTab: {
		fontSize: 18,
		marginBottom: 16,
		marginRight: 24,

		fontWeight: 600,
		color: 'rgba(45, 28, 28, 0.3)',
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginRight: 16
		}
	},
	visibleTab: {
		display: 'block'
	},
	invisibleTab: {
		display: 'none'
	},
	clubIntegrationsSectionTitle: {
		fontSize: 20,
		marginBottom: 16,
		fontWeight: 600
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
	appFrame: {
		width: '100%',
		height: '100%'
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
	}
}))

interface IProps {
	slug: string
	appName: string
}

export const AppViewer: React.FC<IProps> = ({ slug, appName }) => {
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
	const [isLoadingClub, setIsLoadingClub] = useState(true)
	const [club, setClub] = useState<Club>()
	const [integration, setIntegration] = useState<Integration>()

	useEffect(() => {
		if (
			// Note: walletContext thinks logged in = LoginState.unknown, using cookies here
			Cookies.get('meemJwtToken') === undefined ||
			Cookies.get('walletAddress') === undefined
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${slug}/app/${appName}`
				}
			})
		}
	}, [appName, router, slug])

	useEffect(() => {
		async function getClub(data: GetClubQuery) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)

				// Find and set the relevant integration if possible
				possibleClub.allIntegrations?.forEach(clubIntegration => {
					log.debug(clubIntegration.name)

					if (
						clubIntegration.name.toLowerCase() ===
						appName.toLowerCase()
					) {
						setIntegration(clubIntegration)
					}
				})
			}
			setIsLoadingClub(false)
		}
		if (!loading && !error && !club && clubData) {
			getClub(clubData)
		}
	}, [
		appName,
		club,
		clubData,
		error,
		loading,
		wallet,
		wallet.accounts,
		wallet.isConnected
	])

	const navigateToClubDetail = () => {
		router.push({ pathname: `/${slug}` })
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
						<div className={classes.headerTitle}>
							<a onClick={navigateToClubDetail}>
								<ArrowLeft
									className={classes.headerArrow}
									size={32}
								/>
							</a>
							<Image
								className={classes.clubLogoImage}
								src={club.image!}
							/>
							<div className={classes.headerAppNameContainer}>
								<div className={classes.headerAppNameRow}>
									<Image
										className={classes.headerAppImage}
										height={20}
										width={20}
										src={`/integration-${appName.toLowerCase()}.png`}
									/>
									<Space w={8} />
									<Text className={classes.headerAppName}>
										{appName}
									</Text>
								</div>

								<Text>{club?.name}</Text>
							</div>
						</div>
					</div>
					{integration && integration.url && (
						<>
							{integration.requiresEmbed && (
								<Container className={classes.appFrame}>
									<Center>
										<div>
											<Space h={120} />
											<Text>
												{`${capitalizeFirstLetter(
													appName
												)} embedding is not
													currently supported in
													Clubs.`}
											</Text>
											<Space h={32} />
											<Button
												onClick={async () => {
													window.open(integration.url)
												}}
												className={
													classes.buttonConfirm
												}
											>
												{`Launch ${capitalizeFirstLetter(
													appName
												)}`}
											</Button>
										</div>
									</Center>
								</Container>
							)}

							{!integration.requiresEmbed && (
								<iframe
									className={classes.appFrame}
									src={integration.url}
								/>
							)}
						</>
					)}
				</>
			)}
		</>
	)
}
