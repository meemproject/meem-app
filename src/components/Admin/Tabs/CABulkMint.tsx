/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import { createStyles, Text, Button, Textarea, Space } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import request from 'superagent'
import { AlertCircle, Check } from 'tabler-icons-react'
import { Club } from '../../../model/club/club'

const useStyles = createStyles(theme => ({
	manageClubHeader: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	},

	buttonUpload: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	buttonSaveChangesInHeader: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	buttonSaveChanges: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	clubAdminsPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		marginTop: 36
	},
	clubAdminsInstructions: {
		fontSize: 18,
		marginBottom: 16,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	textField: {
		maxWidth: 800
	}
}))

interface IProps {
	club: Club
}

export const CABulkMint: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()
	const wallet = useWallet()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [airdropAddressesString, setAirdropAddressesString] = useState('')
	const [airdropAddresses, setAirdropAddresses] = useState<string[]>([])

	const parseAirdropAddresses = (rawString: string) => {
		setAirdropAddressesString(rawString)
		const adminsList = rawString.split('\n')
		const finalList: string[] = []
		adminsList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		log.debug(`admins count = ${finalList.length + 1}`)
		setAirdropAddresses(finalList)
	}

	const sendAirdrops = async () => {
		setIsSavingChanges(true)

		if (airdropAddresses.length === 0) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'You must add at least one address.',
				color: 'red'
			})
			setIsSavingChanges(false)
			return
		}

		if (airdropAddresses.length > 15) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'You can only airdrop to up to 15 addresses at once.',
				color: 'red'
			})
			setIsSavingChanges(false)
			return
		}

		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

		const airdrops: any[] = []

		// Convert addresses from ENS
		const convertedAirdropAddresses: string[] = []
		let isListValid = true
		await Promise.all(
			airdropAddresses.map(async function (admin) {
				const name = await provider.resolveName(admin)
				if (!name) {
					isListValid = false
					return
				} else {
					convertedAirdropAddresses.push(name)
				}
			})
		)

		if (!isListValid) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'One or more addresses are not valid. Double check what you entered and try again.',
				color: 'red'
			})
			setIsSavingChanges(false)
			return
		}

		// Construct airdrop data
		convertedAirdropAddresses.forEach(address => {
			airdrops.push({
				to: address,
				metadata: {
					name: club?.name ?? '',
					description: club?.description,
					image: club?.image,
					meem_metadata_version: 'MeemClub_Token_20220718'
				}
			})
		})

		// Send request
		try {
			await request
				.post(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}${MeemAPI.v1.BulkMint.path({
						meemContractId: club.id ?? ''
					})}`
				)
				.set('Authorization', `JWT ${wallet.jwt}`)
				.send(airdrops)
			showNotification({
				title: 'Success!',
				autoClose: 5000,
				color: 'green',
				icon: <Check color="green" />,
				message: `Airdrops sent! The wallets you provided now have access to this club.`
			})
			setAirdropAddressesString('')
			setAirdropAddresses([])
			setIsSavingChanges(false)
		} catch (e) {
			log.debug(e)
			showNotification({
				title: 'Airdrop send failed.',
				autoClose: 5000,
				color: 'red',
				icon: <AlertCircle />,
				message: `Please try again or get in touch!`
			})
			setIsSavingChanges(false)
			return
		}
	}

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={classes.manageClubHeader}>Airdrops</Text>

				<Text className={classes.clubAdminsPrompt}>
					Invite others to your club by airdropping them a club token.
					They will automatically become a club member.
				</Text>
				<Text className={classes.clubAdminsInstructions}>
					Add a line break between each address or ENS name.
				</Text>
				<Textarea
					radius="lg"
					size="sm"
					className={classes.textField}
					value={airdropAddressesString}
					minRows={10}
					onChange={event =>
						parseAirdropAddresses(event.currentTarget.value)
					}
				/>
			</div>
			<Space h={32} />
			<Button
				className={classes.buttonSaveChanges}
				loading={isSavingChanges}
				onClick={sendAirdrops}
			>
				Start Airdrop
			</Button>
			<Space h={64} />
		</>
	)
}
