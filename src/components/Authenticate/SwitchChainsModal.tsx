import log from '@kengoldfarb/log'
import { Button, Modal, Space, Image, Center, Text } from '@mantine/core'
import { useAuth } from '@meemproject/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useMeemTheme } from '../Styles/MeemTheme'

export function isWrongChainId(chainId: number) {
	const expectedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

	log.debug(`expected = ${expectedChainId}`)
	log.debug(`current chain id = ${chainId}`)

	const isWrong = chainId !== undefined && chainId !== expectedChainId

	return isWrong
}

export function correctChainIdName(): string {
	const expectedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

	const correctChain =
		expectedChainId === 137
			? 'Polygon'
			: expectedChainId === 80001
			? 'Mumbai'
			: expectedChainId === 10
			? 'Optimism'
			: 'The correct network'
	return correctChain
}

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const SwitchChainsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { setChain } = useAuth()
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()

	const expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID
		? +process.env.NEXT_PUBLIC_CHAIN_ID
		: 0

	const switchNetworkModalContents = (
		<>
			<Space h={16} />
			<div>
				<Center>
					<Image src={'/meem-icon.png'} height={64} width={64} />
				</Center>
				<Space h={32} />

				<Center>
					<Text className={meemTheme.tLargeBold}>
						Please switch your network.
					</Text>
				</Center>
				<Space h={8} />

				<Center>
					<Text
						className={meemTheme.tMedium}
					>{`You're currently connected to the wrong network for this action.`}</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Button
						className={meemTheme.buttonBlack}
						onClick={async () => {
							await setChain(expectedChainId)
							router.reload()
						}}
					>
						{`Switch Network to ${correctChainIdName()}`}
					</Button>
				</Center>
			</div>
			<Space h={16} />
		</>
	)

	const switchNetworkMobileModalContents = (
		<>
			<Space h={16} />
			<div>
				<Center>
					<Image src={'/meem-icon.png'} height={64} width={64} />
				</Center>
				<Space h={32} />
				<Center>
					<Text className={meemTheme.tLargeBold}>
						Please switch your network.
					</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Text
						className={meemTheme.tMedium}
						style={{ textAlign: 'center' }}
					>{`You're currently connected to the wrong network for this action. Please connect to ${correctChainIdName} and refresh this page to continue.`}</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Link
						href={
							'https://www.google.com/search?q=how+to+switch+ethereum+network+on+mobile'
						}
						target="_blank"
						rel="noreferrer noopener"
						passHref
						legacyBehavior
					>
						<a>
							<Button className={meemTheme.buttonWhite}>
								How do I change networks?
							</Button>
						</a>
					</Link>
				</Center>
			</div>
			<Space h={16} />
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				{switchNetworkModalContents}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				withCloseButton={false}
				closeOnClickOutside={false}
				fullScreen
				padding={'lg'}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				{switchNetworkMobileModalContents}
			</Modal>
		</>
	)
}
