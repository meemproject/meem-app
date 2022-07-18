/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Divider,
	Stepper,
	MantineProvider,
	TextInput
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import request from 'superagent'
import { AlertCircle, Check } from 'tabler-icons-react'
import twitterIntent from 'twitter-intent'
import { Club, Integration } from '../../model/club/club'

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	sectionHeader: {
		fontWeight: 600,
		fontSize: 18
	},
	linkText: {
		fontSize: 18,
		textDecoration: 'underline',
		cursor: 'pointer',
		color: 'rgba(255, 102, 81, 1)'
	}
}))

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const ClubsFAQModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes } = useStyles()

	return (
		<>
			<Modal
				centered
				radius={16}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={<Text className={classes.modalTitle}>FAQ</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />
				<Space h={24} />
				<Text
					className={classes.sectionHeader}
				>{`What's a club?`}</Text>
				<Space h={12} />

				<Text>{`A club is your community’s Web3 home base. Set membership criteria and seamlessly issue tokens to authorized participants, then sync your favorite tools and apps to create a living dashboard for your members. Clubs empowers you to manage your community and its activities without dependence on centralized platforms.`}</Text>
				<Space h={24} />

				<Text className={classes.sectionHeader}>
					What can I do with my club?
				</Text>
				<Space h={12} />

				<Text>
					Today, you can manage permissions for your club with
					nuanced, intuitive membership logic. Within your club, set
					up token-gated access for popular third-party tools such as
					Discord, Notion, and SlikSafe. Collaborate on and publish a
					newsletter for your community using Mags.
				</Text>
				<Space h={24} />

				<Text className={classes.sectionHeader}>
					{`What's next for Clubs?`}
				</Text>
				<Space h={12} />

				<Text>{`We’ll be building more functionality for communities and group leaders, and we’ll be integrating with other Web2 and Web3 tools to allow your club to do even more.`}</Text>

				<Space h={24} />
				<Text className={classes.sectionHeader}>
					Have an idea or suggestion?
				</Text>
				<Space h={12} />

				<Text
					onClick={() => {
						window.open('https://airtable.com/shrM296vRoDWmK8Rm')
					}}
					className={classes.linkText}
				>
					Send us your feedback.
				</Text>
			</Modal>
		</>
	)
}
