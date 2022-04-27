import {
	createStyles,
	Container,
	Text,
	Button,
	Group,
	useMantineTheme,
	Center,
	Image,
	Autocomplete,
	Loader
} from '@mantine/core'
import React, { useRef, useState } from 'react'

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

export function HomeComponent() {
	const { classes } = useStyles()

	const timeoutRef = useRef<number>(-1)
	const [value, setValue] = useState('')
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<string[]>([])

	const handleChange = (val: string) => {
		window.clearTimeout(timeoutRef.current)
		setValue(val)
		setData([])

		if (val.trim().length === 0) {
			setLoading(false)
		} else {
			setLoading(true)
			timeoutRef.current = window.setTimeout(() => {
				setLoading(false)
				setData(['Meem', 'Clubs Club', 'Mealz'].map(provider => `${provider}`))
			}, 200)
		}
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
					onChange={handleChange}
					rightSection={loading ? <Loader size={16} /> : null}
				/>
			</Container>
		</div>
	)
}
