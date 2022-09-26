import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Autocomplete,
	Loader,
	Avatar,
	Group,
	Button,
	Space,
	// Bug in mantine imports here
	// eslint-disable-next-line import/named
	SelectItemProps,
	// eslint-disable-next-line import/named
	MantineColor,
	// eslint-disable-next-line import/named
	AutocompleteItem
} from '@mantine/core'
import { LoginState, useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { forwardRef, useContext, useRef, useState } from 'react'
// eslint-disable-next-line import/namespace
import { GetClubsAutocompleteQuery } from '../../../generated/graphql'
import { GET_CLUBS_AUTOCOMPLETE } from '../../graphql/clubs'
import { CookieKeys } from '../../utils/cookies'
import ClubClubContext from '../Detail/ClubClubProvider'
import { ClubsFAQModal } from '../Header/ClubsFAQModal'

const useStyles = createStyles(theme => ({
	wrapper: {
		position: 'relative',
		boxSizing: 'border-box',
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
	},

	inner: {
		position: 'relative',
		paddingTop: 0,
		paddingBottom: 32,
		marginTop: 70,

		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingBottom: 80,
			paddingTop: 0,
			marginTop: 40
		}
	},

	title: {
		paddingBottom: 64
	},

	searchPrompt: {
		marginTop: 64,
		fontSize: 20,
		fontWeight: 'bold',
		color: 'black',

		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 18,
			marginTop: 48
		}
	},

	clubSearch: {
		marginTop: 16,
		input: {
			borderRadius: 16
		}
	},

	joinMeemLink: {
		marginTop: 24,
		cursor: 'pointer',
		a: {
			color: 'rgba(255, 102, 81, 1)',
			textDecoration: 'underline',
			fontWeight: 'bold'
		}
	},
	createButton: {
		marginRight: 64,
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 32
	},
	joinButton: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 12
	},
	joinMeemDialogText: {
		marginBottom: 8,
		fontSize: 14
	},
	header: {
		backgroundColor: 'rgba(255, 102, 81, 0.1)'
	},
	headerContainer: { display: 'flex', paddingTop: 32, paddingBottom: 32 },
	headerLogoContainer: {
		marginRight: 48,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 32
		}
	},
	headerLogo: {
		filter: 'invert(52%) sepia(97%) saturate(1775%) hue-rotate(326deg) brightness(99%) contrast(105%)'
	},
	headerTextContainer: {
		color: 'rgba(255, 102, 81, 1)',
		fontWeight: 600,
		marginTop: 6
	},
	headerPitchText: {
		fontSize: 22,
		fontWeight: 800,
		lineHeight: 1.3,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	headerLinkText: {
		fontSize: 18,
		textDecoration: 'underline',
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 15
		}
	}
}))

interface ItemProps extends SelectItemProps {
	color: MantineColor
	description: string
	slug: string
	image: string
}

// eslint-disable-next-line react/display-name
const CustomAutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
	({ description, value, image, ...others }: ItemProps, ref) => (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={image} style={{ imageRendering: 'pixelated' }} />

				<div>
					<Text>{value}</Text>
					<Text size="xs" color="dimmed">
						{description}
					</Text>
				</div>
			</Group>
		</div>
	)
)

export function HomeComponent() {
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const autocompleteClient = new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL
		}),
		ssrMode: typeof window === 'undefined'
	})

	const clubclub = useContext(ClubClubContext)

	const timeoutRef = useRef<number>(-1)
	const [autocompleteFormValue, setAutocompleteFormValue] = useState('')
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
	const [isFetchingData, setIsFetchingData] = useState(false)
	const [autocompleteData, setAutocompleteData] = useState<any[]>([])
	const [isShowingCreateButton, setShowCreateButton] = useState(false)

	const handleChange = async (val: string) => {
		window.clearTimeout(timeoutRef.current)
		setAutocompleteFormValue(val)
		setAutocompleteData([])

		if (val.trim().length === 0) {
			setIsLoadingSuggestions(false)
		} else {
			setIsLoadingSuggestions(true)
			timeoutRef.current = window.setTimeout(async () => {
				if (isFetchingData) {
					return
				}
				setIsFetchingData(true)
				const { data } = await autocompleteClient.query({
					query: GET_CLUBS_AUTOCOMPLETE,
					variables: {
						query: `%${val.trim()}%`,
						chainId: wallet.chainId
					}
				})

				const typedData = data as GetClubsAutocompleteQuery

				if (typedData.MeemContracts.length === 0) {
					setAutocompleteData([])
					setIsFetchingData(false)
					setIsLoadingSuggestions(false)
					setShowCreateButton(true)
					log.debug('allowing create button = true')
				} else {
					const clubsList: React.SetStateAction<any[]> = []
					typedData.MeemContracts.forEach(club => {
						const clubData = {
							image: club.metadata.image
								? club.metadata.image
								: '',
							value: club.name,
							description: club.metadata.description
								? club.metadata.description
								: 'Unknown description',
							slug: club.slug,
							id: club.id
						}
						clubsList.push(clubData)
					})
					setAutocompleteData(clubsList)
					setIsFetchingData(false)
					setIsLoadingSuggestions(false)

					// Now look through the returned clubs to see if a club of the same name exists
					let shouldAllow = true
					clubsList.forEach(club => {
						if (
							club.value &&
							club.value.toLowerCase() ===
								val.trim().toLowerCase()
						) {
							shouldAllow = false
							return
						}
					})
					setShowCreateButton(shouldAllow)
					log.debug(`allowing create button = ${shouldAllow}`)
				}
			}, 250)
		}
	}

	const handleSuggestionChosen = (suggestion: AutocompleteItem) => {
		log.debug(`Chosen ${suggestion.value} - ${suggestion.description}`)
		setIsLoadingSuggestions(true)
		router.push({
			pathname: `/${suggestion.slug}`
		})
	}

	const goToBrowse = () => {
		router.push({
			pathname: `/browse`
		})
	}

	const goToCreate = () => {
		if (wallet.loginState === LoginState.NotLoggedIn) {
			Cookies.set(CookieKeys.clubName, autocompleteFormValue)
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/create`
				}
			})
		} else {
			router.push({
				pathname: `/create`,
				query: { clubname: autocompleteFormValue }
			})
		}
	}

	const [isClubsFAQModalOpen, setIsClubsFAQModalOpen] = useState(false)

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<Container size={900} className={classes.headerContainer}>
					<div className={classes.headerLogoContainer}>
						<Image
							className={classes.headerLogo}
							src="/clubs-home.svg"
							height={120}
							width={120}
							fit={'contain'}
						>
							{' '}
							className={classes.title}{' '}
						</Image>
					</div>

					<div className={classes.headerTextContainer}>
						<Text className={classes.headerPitchText}>
							Effortless access management and collaborative
							publishing tools for your online community
						</Text>
						<Space h={24} />
						<Text
							onClick={() => {
								setIsClubsFAQModalOpen(true)
							}}
							className={classes.headerLinkText}
						>
							Get to know Clubs
						</Text>
					</div>
				</Container>
			</div>

			<Container size={900} className={classes.inner}>
				<Text className={classes.searchPrompt} color="dimmed">
					{`What's your club called?`}
				</Text>
				<Autocomplete
					className={classes.clubSearch}
					value={autocompleteFormValue}
					data={autocompleteData}
					limit={2}
					size={'xl'}
					itemComponent={CustomAutoCompleteItem}
					onChange={handleChange}
					placeholder={
						'Start typing to see suggestions or create a new club...'
					}
					onItemSubmit={handleSuggestionChosen}
					rightSection={
						isLoadingSuggestions ? (
							<Loader
								variant="oval"
								color={'red'}
								size={24}
								style={{ marginRight: '12px' }}
							/>
						) : autocompleteFormValue.length > 0 &&
						  isShowingCreateButton &&
						  clubclub.isMember ? (
							<Button
								className={classes.createButton}
								onClick={goToCreate}
							>
								Create
							</Button>
						) : null
					}
				/>
				{!clubclub.isMember && (
					<Text className={classes.joinMeemLink}>
						<a
							onClick={() => {
								router.push({ pathname: '/club-club' })
							}}
						>
							Join Club Club to create
						</a>
					</Text>
				)}
				<Space h={24} />
				<Button className={classes.createButton} onClick={goToBrowse}>
					Browse all clubs
				</Button>
			</Container>
			<ClubsFAQModal
				onModalClosed={() => {
					setIsClubsFAQModalOpen(false)
				}}
				isOpened={isClubsFAQModalOpen}
			/>
		</div>
	)
}
