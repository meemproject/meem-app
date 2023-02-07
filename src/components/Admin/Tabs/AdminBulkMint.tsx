/* eslint-disable @typescript-eslint/no-non-null-assertion */
import log from '@kengoldfarb/log'
import { Text, Button, Textarea, Space } from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useMeemTheme } from '../../Styles/MeemTheme'

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
			showErrorNotification('Oops!', 'You must add at least one address.')
			setIsSavingChanges(false)
			return
		}

		if (airdropAddresses.length > 15) {
			showErrorNotification(
				'Oops!',
				'You can only airdrop to up to 15 addresses at once.'
			)
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
			showErrorNotification(
				'Oops!',
				'One or more addresses are not valid. Double check what you entered and try again.'
			)
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
					meem_metadata_type: 'Meem_AgreementToken',
					meem_metadata_version: '20221116'
				}
			})
		})

		// Send request
		try {
			await sdk.agreement.bulkMint({
				agreementId: agreement.id ?? '',
				tokens: airdrops
			})

			showSuccessNotification(
				'Success!',
				`Airdrops sent! The wallets you provided should have access to this community in a moment.`
			)
			setAirdropAddressesString('')
			setAirdropAddresses([])
			setIsSavingChanges(false)
		} catch (e) {
			log.debug(e)
			showSuccessNotification(
				'Airdrop send failed.',
				`Please try again or get in touch!`
			)
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