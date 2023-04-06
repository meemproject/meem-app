import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Button, TextInput, Checkbox } from '@mantine/core'
import { useMeemApollo, useWallet } from '@meemproject/react'
import React, { useCallback, useEffect, useState } from 'react'
import { GetAgreementExistsQuery } from '../../../generated/graphql'
import { GET_AGREEMENT_EXISTS } from '../../graphql/agreements'
import { Agreement } from '../../model/agreement/agreements'
import { showErrorNotification } from '../../utils/notifications'
import { MeemFAQModal } from '../Header/MeemFAQModal'
import { colorBlue, useMeemTheme } from '../Styles/MeemTheme'
import { CreationProgressModal } from './CreationProgressModal'

interface IProps {
	isOpened: boolean
	onModalClosed: (agreement?: Agreement) => void
}

export const CreateAgreementModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const { web3Provider, isConnected, connectWallet } = useWallet()

	const [shouldCheckAgreementName, setShouldCheckAgreementName] =
		useState(false)

	const [agreementName, setAgreementName] = useState('')

	const [isAgreementCreationModalOpened, setIsAgreementCreationModalOpened] =
		useState(false)

	const [isAgreementOnChain, setIsAgreementOnChain] = useState(false)

	const [isMeemFaqModalOpen, setIsMeemFaqModalOpen] = useState(false)

	const { anonClient } = useMeemApollo()

	const closeModal = useCallback(
		(agreement?: Agreement) => {
			setAgreementName('')
			setIsAgreementCreationModalOpened(false)
			setShouldCheckAgreementName(false)
			onModalClosed(agreement)
		},
		[onModalClosed]
	)

	const { data: agreementData, loading: isCheckingName } =
		useQuery<GetAgreementExistsQuery>(GET_AGREEMENT_EXISTS, {
			client: anonClient,
			variables: {
				slug: agreementName
					.toString()
					.replaceAll(' ', '-')
					.toLowerCase(),
				chainId: process.env.NEXT_PUBLIC_CHAIN_ID
			},
			skip: !shouldCheckAgreementName || !isOpened
		})

	const checkName = useCallback(
		async (name: string) => {
			if (!web3Provider || !isConnected) {
				await connectWallet()
				return
			}

			// Some basic validation
			if (!name || name.length < 3 || name.length > 30) {
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
					`There was an error creating your community. Contact us using the top-right link on this page.`
				)

				return
			}
		},
		[connectWallet, isConnected, web3Provider]
	)

	useEffect(() => {
		if (isOpened && agreementData && shouldCheckAgreementName) {
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
	}, [
		agreementData,
		checkName,
		closeModal,
		isAgreementCreationModalOpened,
		isCheckingName,
		isOpened,
		shouldCheckAgreementName
	])

	const modalContent = (
		<>
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
			<div className={meemTheme.row}>
				<Checkbox
					onChange={event =>
						setIsAgreementOnChain(event.currentTarget.checked)
					}
					checked={isAgreementOnChain}
				/>
				<Space w={8} />
				<Text className={meemTheme.tExtraSmall}>
					Create an on-chain community agreement to make your
					community portable.{' '}
					<span
						style={{
							textDecoration: 'underline',
							fontWeight: 'bold',
							color: colorBlue,
							cursor: 'pointer'
						}}
						onClick={() => {
							setIsMeemFaqModalOpen(true)
						}}
					>
						Learn more.
					</span>
				</Text>
			</div>
			<Space h={24} />
			<Button
				loading={isCheckingName || isAgreementCreationModalOpened}
				disabled={isCheckingName || isAgreementCreationModalOpened}
				className={meemTheme.buttonBlack}
				onClick={() => {
					checkName(agreementName)
				}}
			>
				Next
			</Button>
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				centered
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
					closeModal()
				}}
			>
				{modalContent}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				centered
				closeOnEscape={false}
				withCloseButton={true}
				fullScreen
				padding={'sm'}
				opened={isOpened && !isAgreementCreationModalOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						Create Your Community
					</Text>
				}
				onClose={() => {
					closeModal()
				}}
			>
				{modalContent}
			</Modal>
			<CreationProgressModal
				agreementName={agreementName}
				isAgreementOnChain={isAgreementOnChain}
				isOpened={isAgreementCreationModalOpened}
				onModalClosed={() => {
					setIsAgreementCreationModalOpened(false)
				}}
			/>
			<MeemFAQModal
				isOpened={isMeemFaqModalOpen}
				onModalClosed={function (): void {
					setIsMeemFaqModalOpen(false)
				}}
			/>
		</>
	)
}
