/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import { Text, Button, Textarea, Space } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { Club } from '../../../model/club/club'
import { colorPink, useClubsTheme } from '../../Styles/ClubsTheme'

interface IProps {
	club: Club
}

export const CABulkMint: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

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
				color: colorPink
			})
			setIsSavingChanges(false)
			return
		}

		if (airdropAddresses.length > 15) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'You can only airdrop to up to 15 addresses at once.',
				color: colorPink
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
				color: colorPink
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
					agreement_metadata_version: 'MeemClub_Token_20220718'
				}
			})
		})

		// Send request
		// try {
		// 	const bulkMintFetcher = makeFetcher<
		// 		MeemAPI.v1.BulkMint.IQueryParams,
		// 		MeemAPI.v1.BulkMint.IRequestBody,
		// 		MeemAPI.v1.BulkMint.IResponseBody
		// 	>({
		// 		method: MeemAPI.v1.BulkMint.method
		// 	})

		// 	await bulkMintFetcher(
		// 		MeemAPI.v1.BulkMint.path({
		// 			agreementId: club.id ?? ''
		// 		}),
		// 		undefined,
		// 		{
		// 			tokens: airdrops
		// 		}
		// 	)

		// 	showNotification({
		// 		title: 'Success!',
		// 		autoClose: 5000,
		// 		color: colorGreen,
		// 		icon: <Check color="green" />,
		// 		message: `Airdrops sent! The wallets you provided should have access to this club in a few minutes.`
		// 	})
		// 	setAirdropAddressesString('')
		// 	setAirdropAddresses([])
		// 	setIsSavingChanges(false)
		// } catch (e) {
		// 	log.debug(e)
		// 	showNotification({
		// 		title: 'Airdrop send failed.',
		// 		autoClose: 5000,
		// 		color: colorPink,
		// 		icon: <AlertCircle />,
		// 		message: `Please try again or get in touch!`
		// 	})
		// 	setIsSavingChanges(false)
		// 	return
		// }
	}

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={clubsTheme.tLargeBold}>Airdrops</Text>
				<Space h={32} />

				<Text className={clubsTheme.tMediumBold}>
					Invite others to your club by airdropping them a club token.
					They will automatically become a club member.
				</Text>
				<Space h={16} />
				<Text className={clubsTheme.tMediumFaded}>
					Add a line break between each address or ENS name.
				</Text>
				<Space h={24} />
				<Textarea
					radius="lg"
					size="sm"
					style={{ maxWidth: 800 }}
					value={airdropAddressesString}
					minRows={10}
					onChange={event =>
						parseAirdropAddresses(event.currentTarget.value)
					}
				/>
			</div>
			<Space h={40} />
			<Button
				className={clubsTheme.buttonBlack}
				loading={isSavingChanges}
				onClick={sendAirdrops}
			>
				Start Airdrop
			</Button>
			<Space h={64} />
		</>
	)
}
