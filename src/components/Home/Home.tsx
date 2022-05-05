/* eslint-disable import/named */
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
import { useRouter } from 'next/router'
import React, { forwardRef, useRef, useState } from 'react'

const BREAKPOINT = '@media (max-width: 755px)'

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

		[BREAKPOINT]: {
			paddingBottom: 80,
			paddingTop: 80
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

		[BREAKPOINT]: {
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

	const timeoutRef = useRef<number>(-1)
	const [autocompleteFormValue, setAutocompleteFormValue] = useState('')
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
	const [autocompleteData, setAutocompleteData] = useState<any[]>([])
	const [showCreateButton, setShowCreateButton] = useState(false)
	const [isJoinMeemDialogOpen, setJoinMeemDialogOpen] = useState(false)

	const handleChange = (val: string) => {
		window.clearTimeout(timeoutRef.current)
		setAutocompleteFormValue(val)
		setAutocompleteData([])

		if (val.trim().length === 0) {
			setIsLoadingSuggestions(false)
		} else {
			setIsLoadingSuggestions(true)
			timeoutRef.current = window.setTimeout(() => {
				setIsLoadingSuggestions(false)
				const clubsList = [
					{
						image:
							'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
						value: 'Futurama Club',
						description: 'For fans of Bender',
						id: '1'
					},
					{
						image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
						value: 'Rich Club',
						description: 'For the richest people on Earth',
						id: '1'
					},
					{
						image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
						value: 'The Simpsons Club',
						description: 'Fans of the Simpsons',
						id: '1'
					},
					{
						image:
							'https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png',
						value: 'Spongebob Club',
						description: 'Not just a sponge',
						id: '1'
					}
				]
				setAutocompleteData(clubsList)
				setShowCreateButton(clubsList.length === 0)
			}, 500)
		}
	}

	const handleSuggestionChosen = (suggestion: AutocompleteItem) => {
		console.log(`Chosen ${suggestion.value} - ${suggestion.description}`)
		setIsLoadingSuggestions(true)
		router.push({
			pathname: `/club/${suggestion.id}`
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
						) : autocompleteFormValue.length > 0 ? (
							<Button className={classes.createButton} onClick={goToCreate}>
								Create
							</Button>
						) : null
					}
				/>
				<Text className={classes.joinMeemLink}>
					<a href="https://meem.wtf/signup/walletconnect">
						Join ClubClub to create
					</a>
				</Text>
			</Container>
			<Modal
				opened={isJoinMeemDialogOpen}
				onClose={() => setJoinMeemDialogOpen(false)}
				title="Join Meem"
			>
				<Text className={classes.joinMeemDialogText}>
					To create a group, you need a Meem ID. Sign up below!
				</Text>
				<Button className={classes.createButton} onClick={goToJoinMeem}>
					Create Meem ID
				</Button>
			</Modal>
		</div>
	)
}
