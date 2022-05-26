/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/named */
import { ApolloClient, HttpLink, InMemoryCache, useQuery } from '@apollo/client'
import {
	createStyles,
	Container,
	Text,
	Center,
	Image,
	Autocomplete,
	Loader,
	Avatar,
	SelectItemProps,
	MantineColor,
	AutocompleteItem,
	Group,
	Button,
	Modal
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import {
	GetClubsAutocompleteQuery,
	GetIsMemberOfClubQuery
} from '../../../generated/graphql'
import {
	GET_CLUBS_AUTOCOMPLETE,
	GET_IS_MEMBER_OF_CLUB
} from '../../graphql/clubs'
import { clubMetadataFromContractUri } from '../../model/club/club_metadata'

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
		paddingBottom: 120,
		marginTop: 120,

		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingBottom: 80,
			paddingTop: 0,
			marginTop: 80
		}
	},

	title: {
		paddingBottom: 64
	},

	searchPrompt: {
		marginTop: theme.spacing.xl,
		fontSize: 20,
		fontWeight: 'bold',
		color: 'black',

		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 18
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
		borderRadius: 12
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
				<Avatar src={image} />

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

	const autocompleteClient = new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL
		}),
		ssrMode: typeof window === 'undefined'
	})

	const wallet = useWallet()
	const [hasCheckedClubClubMembership, setHasCheckedClubClubMembership] =
		useState(false)
	const [isClubClubMember, setIsClubClubMember] = useState(false)
	const {
		loading: loadingIsClubClub,
		error: errorFetchingIsClubClub,
		data: clubClubData
	} = useQuery<GetIsMemberOfClubQuery>(GET_IS_MEMBER_OF_CLUB, {
		variables: {
			walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
			clubSlug: 'club-club'
		}
	})

	useEffect(() => {
		if (
			!loadingIsClubClub &&
			!errorFetchingIsClubClub &&
			!hasCheckedClubClubMembership &&
			clubClubData
		) {
			if (clubClubData.Meems.length > 0) {
				console.log('Current user is ClubClub member')
				setIsClubClubMember(true)
			}
		}
	}, [
		clubClubData,
		errorFetchingIsClubClub,
		hasCheckedClubClubMembership,
		loadingIsClubClub
	])

	const timeoutRef = useRef<number>(-1)
	const [autocompleteFormValue, setAutocompleteFormValue] = useState('')
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
	const [isFetchingData, setIsFetchingData] = useState(false)
	const [autocompleteData, setAutocompleteData] = useState<any[]>([])
	const [showCreateButton, setShowCreateButton] = useState(false)
	const [isJoinMeemDialogOpen, setJoinMeemDialogOpen] = useState(false)

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
						query: val.trim()
					}
				})

				const typedData = data as GetClubsAutocompleteQuery

				if (typedData.MeemContracts.length === 0) {
					setAutocompleteData([])
					setIsFetchingData(false)
					setIsLoadingSuggestions(false)
					setShowCreateButton(true)
					console.log('allowing create button = true')
				} else {
					const clubsList: React.SetStateAction<any[]> = []
					typedData.MeemContracts.forEach(club => {
						const metadata = clubMetadataFromContractUri(club.contractURI)
						if (metadata.image.length > 0) {
							const clubData = {
								image: metadata.image,
								value: club.name,
								description: metadata.description,
								slug: club.slug,
								id: club.id
							}
							clubsList.push(clubData)
						}
					})
					setAutocompleteData(clubsList)
					setIsFetchingData(false)
					setIsLoadingSuggestions(false)
					console.log(`allowing create button = ${clubsList.length === 0}`)
					setShowCreateButton(clubsList.length === 0)
				}
			}, 250)
		}
	}

	const handleSuggestionChosen = (suggestion: AutocompleteItem) => {
		console.log(`Chosen ${suggestion.value} - ${suggestion.description}`)
		setIsLoadingSuggestions(true)
		router.push({
			pathname: `/${suggestion.slug}`
		})
	}

	const goToCreate = () => {
		//if (hasMeemId) {
		router.push({
			pathname: `/create`,
			query: { clubname: autocompleteFormValue }
		})
		// } else {
		// 	setJoinMeemDialogOpen(true)
		// }
	}

	const goToJoinMeem = () => {
		setJoinMeemDialogOpen(false)
		window.open('https://meem.wtf/signup/walletconnect')
	}

	return (
		<div className={classes.wrapper}>
			<Container size={700} className={classes.inner}>
				<Center>
					<Image src="/clubs-home.png" height={150} width={150} fit={'contain'}>
						{' '}
						className={classes.title}{' '}
					</Image>
				</Center>

				<Text className={classes.searchPrompt} color="dimmed">
					{`What's your club called?`}
				</Text>
				<Autocomplete
					className={classes.clubSearch}
					value={autocompleteFormValue}
					data={autocompleteData}
					size={'lg'}
					itemComponent={CustomAutoCompleteItem}
					onChange={handleChange}
					placeholder="Start typing to see suggestions or create a new club..."
					onItemSubmit={handleSuggestionChosen}
					rightSection={
						isLoadingSuggestions ? (
							<Loader size={16} />
						) : autocompleteFormValue.length > 0 && showCreateButton ? (
							<Button className={classes.createButton} onClick={goToCreate}>
								Create
							</Button>
						) : null
					}
				/>
				<Text className={classes.joinMeemLink}>
					<a href="/club-club">Join Club Club to create</a>
				</Text>
			</Container>
		</div>
	)
}
