/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import { Text, Button, Textarea, Space } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSDK } from '@meemproject/react'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { AlertCircle, Check } from 'tabler-icons-react'
import { Agreement } from '../../../model/agreement/agreements'
import { colorGreen, colorBlue, useMeemTheme } from '../../Styles/MeemTheme'

interface IProps {
	agreement: Agreement
}

export const AdminBulkMint: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()

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
				color: colorBlue
			})
			setIsSavingChanges(false)
			return
		}

		if (airdropAddresses.length > 15) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'You can only airdrop to up to 15 addresses at once.',
				color: colorBlue
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
				color: colorBlue
			})
			setIsSavingChanges(false)
			return
		}

		// Construct airdrop data
		convertedAirdropAddresses.forEach(address => {
			airdrops.push({
				to: address,
				metadata: {
					name: agreement?.name ?? '',
					description: agreement?.description,
					image: agreement?.image,
					agreement_metadata_version: 'MeemAgreement_Token_20220718'
				}
			})
		})

		// Send request
		try {
			await sdk.agreement.bulkMint({
				agreementId: agreement.id ?? '',
				tokens: airdrops
			})

			showNotification({
				title: 'Success!',
				autoClose: 5000,
				color: colorGreen,
				icon: <Check color="green" />,
				message: `Airdrops sent! The wallets you provided should have access to this agreement in a few minutes.`
			})
			setAirdropAddressesString('')
			setAirdropAddresses([])
			setIsSavingChanges(false)
		} catch (e) {
			log.debug(e)
			showNotification({
				title: 'Airdrop send failed.',
				autoClose: 5000,
				color: colorBlue,
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

				<Text className={meemTheme.tLargeBold}>Airdrops</Text>
				<Space h={32} />

				<Text className={meemTheme.tSmallBold}>
					Invite others to your community by airdropping them a token.
					They will automatically become a community member.
				</Text>
				<Space h={16} />
				<Text className={meemTheme.tSmallFaded}>
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
				className={meemTheme.buttonBlack}
				loading={isSavingChanges}
				onClick={sendAirdrops}
			>
				Start Airdrop
			</Button>
			<Space h={64} />
		</>
	)
}
