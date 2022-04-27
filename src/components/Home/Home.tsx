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
	Group
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
		borderRadius: 16
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
	const [value, setValue] = useState('')
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
	const [data, setData] = useState<any[]>([])

	const handleChange = (val: string) => {
		window.clearTimeout(timeoutRef.current)
		setValue(val)
		setData([])

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
				setData(clubsList)
			}, 200)
		}
	}

	const handleSuggestionChosen = (suggestion: AutocompleteItem) => {
		console.log(`Chosen ${suggestion.value} - ${suggestion.description}`)
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
					value={value}
					data={data}
					size={'lg'}
					itemComponent={CustomAutoCompleteItem}
					onChange={handleChange}
					onItemSubmit={handleSuggestionChosen}
					rightSection={isLoadingSuggestions ? <Loader size={16} /> : null}
				/>
			</Container>
		</div>
	)
}
