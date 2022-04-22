/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import {
	createStyles,
	Image,
	Container,
	Title,
	Button,
	Group,
	Text,
	Loader
} from '@mantine/core'
import React from 'react'
import { GetLastMeem } from '../graphql/__generated__/GetLastMeem'
import { GET_LAST_MEEM } from '../graphql/meems'

const useStyles = createStyles(theme => ({
	inner: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingTop: theme.spacing.xl * 4,
		paddingBottom: theme.spacing.xl * 2
	},

	content: {
		maxWidth: 480,
		marginRight: theme.spacing.xl * 3,

		[theme.fn.smallerThan('md')]: {
			maxWidth: '100%',
			marginRight: 0
		}
	},

	title: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontSize: 44,
		lineHeight: 1.2,
		fontWeight: 900,

		[theme.fn.smallerThan('xs')]: {
			fontSize: 28
		}
	},

	control: {
		[theme.fn.smallerThan('xs')]: {
			flex: 1
		}
	},

	image: {
		flex: 1,

		[theme.fn.smallerThan('md')]: {
			display: 'none'
		}
	},

	highlight: {
		position: 'relative',
		backgroundColor:
			theme.colorScheme === 'dark'
				? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
				: theme.colors[theme.primaryColor][0],
		borderRadius: theme.radius.sm,
		padding: '4px 12px'
	}
}))

export const GraphQLTestPage: React.FC = () => {
	const { classes } = useStyles()
	const { loading, error, data } = useQuery<GetLastMeem>(GET_LAST_MEEM)

	return (
		<div>
			<Container>
				<div className={classes.inner}>
					<div className={classes.content}>
						<Title className={classes.title}>
							Welcome to <span className={classes.highlight}>Clubs</span> <br />
						</Title>
						<Text color="dimmed" mt="md">
							Instant group credentials. Use easy membership cards to create
							portable on-chain social graphs that unlock web3 tools and
							experiences for your community.
						</Text>

						<Group mt={30}>
							<Button radius="xl" size="md" className={classes.control}>
								Find a Club
							</Button>
							<Button
								variant="default"
								radius="xl"
								size="md"
								className={classes.control}
							>
								Create New
							</Button>
						</Group>
					</div>
					<Image src={'/meem.svg'} className={classes.image} />
				</div>
			</Container>
			<Container>
				{loading && <Loader />}
				{!loading && error && <Text mt="md">Error: ${error.message}.</Text>}
				{!loading && !error && (
					<Text mt="md">Got meem! ${data?.Meems[0].tokenId}</Text>
				)}
			</Container>
		</div>
	)
}
