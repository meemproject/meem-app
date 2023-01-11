import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Button, TextInput } from '@mantine/core'
import { useMeemApollo, useWallet } from '@meemproject/react'
import React, { useEffect, useState } from 'react'
import { GetAgreementExistsQuery } from '../../../generated/graphql'
import { GET_AGREEMENT_EXISTS } from '../../graphql/agreements'
import { showErrorNotification } from '../../utils/notifications'
import { hostnameToChainId } from '../App'
import { useMeemTheme } from '../Styles/MeemTheme'
import { CreationProgressModal } from './CreationProgressModal'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const CreateAgreementModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const { web3Provider, isConnected, connectWallet, chainId } = useWallet()

	const [shouldCheckAgreementName, setShouldCheckAgreementName] =
		useState(false)

	const [agreementName, setAgreementName] = useState('')

	const [isAgreementCreationModalOpened, setIsAgreementCreationModalOpened] =
		useState(false)

	const { anonClient } = useMeemApollo()

	const { data: agreementData, loading: isCheckingName } =
		useQuery<GetAgreementExistsQuery>(GET_AGREEMENT_EXISTS, {
			client: anonClient,
			variables: {
				slug: agreementName
					.toString()
					.replaceAll(' ', '-')
					.toLowerCase(),
				chainId:
					chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			skip: !shouldCheckAgreementName || !isOpened
		})

	const checkName = async () => {
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

		// Check the agreement name
		try {
			setShouldCheckAgreementName(true)
		} catch (e) {
			log.debug(e)

			showErrorNotification(
				'Oops!',
				`There was an error creating your community. Please let us know!`
			)
			return
		}
	}

	useEffect(() => {
		if (agreementData && shouldCheckAgreementName) {
			setShouldCheckAgreementName(false)
			if (agreementData.Agreements.length === 0) {
				// No collisions
				log.debug(
					'no naming collisions, proceeding to create new agreement'
				)
				setIsAgreementCreationModalOpened(true)
			} else {
				log.debug('agreement already exists...')
				showErrorNotification(
					'Oops!',
					`A community by that name already exists. Choose a different name.`
				)
			}
		}
	}, [agreementData, shouldCheckAgreementName])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={true}
				radius={16}
				overlayBlur={8}
				size={'50%'}
				padding={'sm'}
				opened={isOpened && !isAgreementCreationModalOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						Create Your Community
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Text className={meemTheme.tExtraSmallLabel}>
					{`What is your community called?`.toUpperCase()}
				</Text>
				<Space h={12} />
				<TextInput
					radius="lg"
					size="md"
					value={agreementName ?? ''}
					onChange={(event: {
						target: { value: React.SetStateAction<string> }
					}) => {
						setAgreementName(event.target.value)
					}}
				/>
				<Space h={24} />
				<Button
					loading={isCheckingName}
					disabled={isCheckingName}
					className={meemTheme.buttonBlack}
					onClick={() => {
						checkName()
					}}
				>
					Next
				</Button>
			</Modal>
			<CreationProgressModal
				agreementName={agreementName}
				isOpened={isAgreementCreationModalOpened}
				onModalClosed={() => {
					setIsAgreementCreationModalOpened(false)
				}}
			/>
		</>
	)
}
