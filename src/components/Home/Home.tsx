import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
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
import { showNotification } from '@mantine/notifications'
import { LoginState, useAuth, useSDK } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { X } from 'tabler-icons-react'
// eslint-disable-next-line import/namespace
import { GetAgreementsAutocompleteQuery } from '../../../generated/graphql'
import { GET_AGREEMENTS_AUTOCOMPLETE } from '../../graphql/agreements'
import { CookieKeys } from '../../utils/cookies'
import { hostnameToChainId } from '../App'
import { MeemFAQModal } from '../Header/MeemFAQModal'
import { colorBlue, useMeemTheme } from '../Styles/AgreementsTheme'

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
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const { sdk } = useSDK()
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
					query: GET_AGREEMENTS_AUTOCOMPLETE,
					variables: {
						query: `%${val.trim()}%`,
						chainId:
							chainId ??
							hostnameToChainId(
								global.window ? global.window.location.host : ''
							)
					}
				})

				const typedData = data as GetAgreementsAutocompleteQuery

				if (typedData.Agreements.length === 0) {
					setAutocompleteData([])
					setIsFetchingData(false)
					setIsLoadingSuggestions(false)
					setShowCreateButton(true)
					log.debug('allowing create button = true')
				} else {
					const agreementsList: React.SetStateAction<any[]> = []
					typedData.Agreements.forEach(agreement => {
						const agreementData = {
							image: agreement.metadata.image
								? agreement.metadata.image
								: '',
							value: agreement.name,
							description: agreement.metadata.description
								? agreement.metadata.description
								: 'Unknown description',
							slug: agreement.slug,
							id: agreement.id
						}
						agreementsList.push(agreementData)
					})
					setAutocompleteData(agreementsList)
					setIsFetchingData(false)
					setIsLoadingSuggestions(false)

					// Now look through the returned agreements to see if a agreement of the same name exists
					let shouldAllow = true
					agreementsList.forEach(agreement => {
						if (
							agreement.value &&
							agreement.value.toLowerCase() ===
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
			Cookies.set(CookieKeys.agreementName, autocompleteFormValue)
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
					message: `That agreement name is too long or short. Choose something else.`,
					color: colorBlue
				})
			} else {
				router.push({
					pathname: `/create`,
					query: { agreementname: autocompleteFormValue }
				})
			}
		}
	}

	const [isAgreementsFAQModalOpen, setIsAgreementsFAQModalOpen] =
		useState(false)

	useEffect(() => {
		const doLogin = async () => {
			try {
				const accessToken = await getAccessTokenSilently()
				const { jwt } = await sdk.id.loginWithAPI({
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
		<div className={meemTheme.widgetMeem}>
			<Container
				size={900}
				style={{
					position: 'relative',
					paddingTop: 0,
					paddingBottom: 32,
					marginTop: 70
				}}
			>
				<Text className={meemTheme.tExtraSmallLabel} color="black">
					CREATE A AGREEMENT
				</Text>
				<Space h={16} />
				<Text
					style={{
						color: 'black',
						fontSize: 20,
						fontWeight: 'bold'
					}}
				>
					{`What's your agreement called?`}
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
						'Start typing to see suggestions or create a new agreement...'
					}
					onItemSubmit={handleSuggestionChosen}
					rightSection={
						isLoadingSuggestions ? (
							<Loader
								variant="oval"
								color={'blue'}
								size={24}
								style={{ marginRight: '12px' }}
							/>
						) : autocompleteFormValue.length > 0 &&
						  isShowingCreateButton ? (
							<Button
								style={{ marginRight: 64 }}
								className={meemTheme.buttonBlack}
								onClick={goToCreate}
							>
								Create
							</Button>
						) : null
					}
				/>
				<Text className={meemTheme.tLink} style={{ marginTop: 16 }}>
					<a
						onClick={() => {
							router.push({
								pathname: '/agreement-agreement'
							})
						}}
					>
						Join Agreement Agreement to create
					</a>
				</Text>

				<Space h={64} />
			</Container>
			<MeemFAQModal
				onModalClosed={() => {
					setIsAgreementsFAQModalOpen(false)
				}}
				isOpened={isAgreementsFAQModalOpen}
			/>
		</div>
	)
}
