import {
	Container,
	Text,
	Button,
	Textarea,
	Space,
	TextInput
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'
import { CookieKeys } from '../../utils/cookies'
import { showErrorNotification } from '../../utils/notifications'
import { useMeemTheme } from '../Styles/MeemTheme'

export const CreateComponent: React.FC = () => {
	const router = useRouter()
	const { classes: meemTheme } = useMeemTheme()

	const [agreementName, setAgreementName] = useState(
		router.query.agreementname?.toString() ?? ''
	)

	const [agreementDescription, setAgreementDescription] = useState('')

	const { web3Provider, isConnected, connectWallet } = useWallet()

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	const createAgreement = async () => {
		if (!web3Provider || !isConnected) {
			await connectWallet()
			return
		}

		// Some basic validation
		if (
			!agreementName ||
			agreementName.length < 3 ||
			agreementName.length > 30
		) {
			// Agreement name invalid
			showErrorNotification(
				'Oops!',
				'You entered an invalid community name. Please choose a longer or shorter name.'
			)
			return
		}

		if (
			agreementDescription.length < 3 ||
			agreementDescription.length > 140
		) {
			// Agreement name invalid
			showErrorNotification(
				'Oops!',
				'You entered an invalid community description. Please choose a longer or shorter description.'
			)
			return
		}

		const agreementSlug = agreementName
			.toString()
			.replaceAll(' ', '-')
			.toLowerCase()

		Cookies.set(CookieKeys.agreementName, agreementName ?? '')
		Cookies.set(CookieKeys.agreementDescription, agreementDescription)
		Cookies.set(CookieKeys.agreementSlug, agreementSlug)
		router.push({ pathname: `/create/permissions` })
	}

	return (
		<>
			<div className={meemTheme.pageHeader}>
				<div className={meemTheme.centeredRow}>
					<a onClick={navigateHome}>
						<ArrowLeft
							className={meemTheme.pageHeaderExitButton}
							size={32}
						/>
					</a>
					<div>
						<Text className={meemTheme.tSmallBoldFaded}>
							Create a community
						</Text>
						<Text className={meemTheme.tLargeBold}>
							{agreementName}
						</Text>
					</div>
				</div>
			</div>

			<Container>
				<Text className={meemTheme.tMediumBold}>
					{`Community name`}
				</Text>
				<Space h={12} />
				<TextInput
					radius="lg"
					size="md"
					value={agreementName ?? ''}
					onChange={event => {
						setAgreementName(event.target.value)
					}}
				/>

				<Space h={40} />
				<Text className={meemTheme.tMediumBold}>
					In a sentence, describe what your members do together.
				</Text>
				<Space h={16} />

				<Textarea
					radius="lg"
					size="md"
					autosize
					minRows={2}
					maxRows={4}
					maxLength={140}
					onChange={event =>
						setAgreementDescription(event.currentTarget.value)
					}
				/>

				<Space h={40} />
				<Button
					onClick={() => {
						createAgreement()
					}}
					disabled={agreementDescription.length === 0}
					className={meemTheme.buttonBlack}
				>
					Continue
				</Button>
				<Space h={64} />
			</Container>
		</>
	)
}
