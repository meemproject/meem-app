import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'
import log from '@kengoldfarb/log'
import {
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
	AutocompleteItem,
	useMantineColorScheme
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { LoginState, useAuth, useMeemSDK } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, {
	forwardRef,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { X } from 'tabler-icons-react'
// eslint-disable-next-line import/namespace
import { GetClubsAutocompleteQuery } from '../../../generated/graphql'
import { GET_CLUBS_AUTOCOMPLETE } from '../../graphql/clubs'
import { CookieKeys } from '../../utils/cookies'
import { hostnameToChainId } from '../App'
import ClubClubContext from '../ClubHome/ClubClubProvider'
import { ClubsFAQModal } from '../Header/ClubsFAQModal'
import {
	colorDarkGrey,
	colorLightPink,
	colorPink,
	useClubsTheme
} from '../Styles/ClubsTheme'

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
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const { sdk } = useMeemSDK()
	const { loginState, setJwt, chainId } = useAuth()
	const { isAuthenticated, getAccessTokenSilently } = useAuth0()
	const [hasTriedLogin, setHasTriedLogin] = useState(false)

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
						chainId:
							chainId ??
							hostnameToChainId(
								global.window ? global.window.location.host : ''
							)
					}
				})

				const typedData = data as GetClubsAutocompleteQuery

				if (typedData.Agreements.length === 0) {
					setAutocompleteData([])
					setIsFetchingData(false)
					setIsLoadingSuggestions(false)
					setShowCreateButton(true)
					log.debug('allowing create button = true')
				} else {
					const clubsList: React.SetStateAction<any[]> = []
					typedData.Agreements.forEach(club => {
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

	const goToCreate = () => {
		if (loginState === LoginState.NotLoggedIn) {
			Cookies.set(CookieKeys.clubName, autocompleteFormValue)
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/create`
				}
			})
		} else {
			if (
				autocompleteFormValue.length < 3 ||
				autocompleteFormValue.length > 50
			) {
				showNotification({
					radius: 'lg',
					title: 'Oops!',
					message: `That club name is too long or short. Choose something else.`,
					color: colorPink
				})
			} else {
				router.push({
					pathname: `/create`,
					query: { clubname: autocompleteFormValue }
				})
			}
		}
	}

	const [isClubsFAQModalOpen, setIsClubsFAQModalOpen] = useState(false)

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	useEffect(() => {
		const doLogin = async () => {
			try {
				const accessToken = await getAccessTokenSilently()
				const { jwt } = await sdk.id.login({
					accessToken
				})
				setJwt(jwt)
			} catch (e) {
				log.crit(e)

				showNotification({
					title: 'Error connecting account',
					autoClose: 2000,
					color: 'red',
					icon: <X />,

					message: `Please try again.`
				})
			}
		}

		if (
			isAuthenticated &&
			loginState !== LoginState.LoggedIn &&
			!hasTriedLogin
		) {
			setHasTriedLogin(true)
			doLogin()
		}
	}, [
		loginState,
		isAuthenticated,
		hasTriedLogin,
		setHasTriedLogin,
		getAccessTokenSilently,
		setJwt,
		sdk.id
	])

	return (
		<div>
			<div
				style={{
					backgroundColor: isDarkTheme
						? colorDarkGrey
						: colorLightPink
				}}
			>
				<Container
					size={900}
					className={clubsTheme.rowResponsive}
					style={{
						paddingTop: 32,
						paddingBottom: 32
					}}
				>
					<Image
						style={{
							filter: 'invert(52%) sepia(97%) saturate(1775%) hue-rotate(326deg) brightness(99%) contrast(105%)',
							marginRight: 48
						}}
						src="/clubs-home.svg"
						height={120}
						width={120}
						fit={'contain'}
					/>

					<div
						style={{
							color: colorPink,
							fontWeight: 600,
							marginTop: 6
						}}
					>
						<Text
							style={{
								fontSize: 22,
								fontWeight: 800,
								lineHeight: 1.4
							}}
						>
							Effortless access management and collaborative
							publishing tools for your online community
						</Text>
						<Space h={24} />
						<Text
							onClick={() => {
								setIsClubsFAQModalOpen(true)
							}}
							className={clubsTheme.tLink}
							style={{
								fontSize: 18
							}}
						>
							Get to know Clubs
						</Text>
					</div>
				</Container>
			</div>

			<Container
				size={900}
				style={{
					position: 'relative',
					paddingTop: 0,
					paddingBottom: 32,
					marginTop: 70
				}}
			>
				<Text className={clubsTheme.tExtraSmallLabel}>
					CREATE A CLUB
				</Text>
				<Space h={16} />
				<Text
					style={{
						fontSize: 20,
						fontWeight: 'bold'
					}}
					color="dimmed"
				>
					{`What's your club called?`}
				</Text>
				<Autocomplete
					style={{
						marginTop: 16
					}}
					radius={16}
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
						  (clubclub.isMember ||
								process.env.NEXT_PUBLIC_TEST_MODE ===
									'true') ? (
							<Button
								style={{ marginRight: 64 }}
								className={clubsTheme.buttonBlack}
								onClick={goToCreate}
							>
								Create
							</Button>
						) : null
					}
				/>
				{!clubclub.isMember && (
					<Text
						className={clubsTheme.tLink}
						style={{ marginTop: 16 }}
					>
						<a
							onClick={() => {
								router.push({ pathname: '/club-club' })
							}}
						>
							Join Club Club to create
						</a>
					</Text>
				)}

				<Space h={64} />
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
