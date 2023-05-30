// eslint-disable-next-line import/no-extraneous-dependencies
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Button, Textarea } from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import request from 'superagent'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useAgreement } from '../../Providers/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const AddMembersModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [airdropAddressesString, setAirdropAddressesString] = useState('')
	const [airdropAddresses, setAirdropAddresses] = useState<string[]>([])

	const { agreement } = useAgreement()

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

	const sendInvites = async () => {
		setIsSavingChanges(true)

		if (airdropAddresses.length === 0) {
			showErrorNotification('Oops!', 'You must add at least one address.')
			setIsSavingChanges(false)
			return
		}

		if (airdropAddresses.length > 15) {
			showErrorNotification(
				'Oops!',
				'You can only invite to up to 15 addresses at once.'
			)
			setIsSavingChanges(false)
			return
		}

		const provider = new ethers.providers.AlchemyProvider(
			'mainnet',
			process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		)

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

		// Send request
		try {
			try {
				const postData = `${
					process.env.NEXT_PUBLIC_API_URL
				}${MeemAPI.v1.SendAgreementInvites.path({
					agreementId: agreement?.id ?? ''
				})}`
				const data = {
					to: convertedAirdropAddresses
				}
				log.debug(JSON.stringify(postData))
				log.debug(JSON.stringify(data))
				await request
					.post(postData)
					.set('Authorization', `JWT ${wallet.jwt}`)
					.send(data)
			} catch (e) {
				log.debug(JSON.stringify(e))
			}

			showSuccessNotification(
				'Success!',
				`Invites sent! The addresses you provided should have access to this community in a moment.`
			)
			setAirdropAddressesString('')
			setAirdropAddresses([])
			setIsSavingChanges(false)
		} catch (e) {
			log.debug(e)
			showSuccessNotification(
				'Invite send failed.',
				`Contact us using the top-right link on this page.`
			)
			setIsSavingChanges(false)
			return
		}
	}

	const modalContents = (
		<>
			<div>
				<Text className={meemTheme.tSmallBold}>
					Invite others to your community by entering their email or
					wallet addresses below.
				</Text>
				<Space h={16} />
				<Text className={meemTheme.tSmallFaded}>
					Add a line break between each address or ENS name{' '}
				</Text>
				<Space h={24} />
				<Textarea
					placeholder={`brandon@meem.wtf\n0x6b6e7fb5cd1773e9060a458080a53ddb8390d4e\nbminch.eth`}
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
				onClick={sendInvites}
			>
				Send Invites
			</Button>
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				centered
				radius={16}
				overlayProps={{ blur: 8 }}
				size={'60%'}
				padding={'xl'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>Add Members</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				centered
				fullScreen
				padding={'xl'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>Add Members</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
		</>
	)
}
