/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Space,
	Grid,
	Modal
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { Chain } from '@meemproject/meem-contracts'
import * as meemContracts from '@meemproject/meem-contracts'
import meemABI from '@meemproject/meem-contracts/types/Meem.json'
import { useWallet } from '@meemproject/react'
import { Contract } from 'ethers'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
	BrandDiscord,
	BrandTwitter,
	CircleCheck,
	Settings
} from 'tabler-icons-react'
import { CookieKeys } from '../../utils/cookies'

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 32,
		paddingBottom: 32,
		paddingLeft: 32,
		position: 'relative',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingLeft: 8,
			paddingRight: 8,
			paddingTop: 24,
			paddingBottom: 24
		}
	}
}))

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

enum Step {
	Start,
	Creating,
	Created,
	Initializing,
	Initialized,
	Minting,
	Minted
}

export const CreateClubTransactionsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const router = useRouter()

	const { web3Provider, accounts, signer } = useWallet()

	const [step, setStep] = useState<Step>(Step.Start)
	const [proxyAddress, setProxyAddress] = useState('')

	const create = async () => {
		if (!web3Provider) {
			return
		}
		setStep(Step.Creating)
		try {
			const contract = await meemContracts.deployProxy({
				signer: web3Provider.getSigner()
			})

			log.debug(
				`Deployed proxy at ${contract.address} w/ tx: ${contract.deployTransaction.hash}`
			)
			setProxyAddress(contract.address)
			setStep(Step.Created)
		} catch (e) {
			setStep(Step.Start)
			showNotification({
				title: 'Error creating club.',
				message: `${e as string}`
			})
		}
	}

	const initialize = async () => {
		if (!web3Provider) {
			return
		}

		setStep(Step.Initializing)

		try {
			const clubSymbol = (Cookies.get(CookieKeys.clubName) ?? '')
				.split(' ')[0]
				.toUpperCase()

			const uri = `{"name": ${Cookies.get(
				CookieKeys.clubName
			)},"description": ${CookieKeys.clubDescription},"image": ${Cookies.get(
				CookieKeys.clubImage
			)},"external_link": ${Cookies.get(CookieKeys.clubExternalUrl)}}`

			const tx = await meemContracts.initProxy({
				signer: web3Provider.getSigner(),
				proxyContractAddress: proxyAddress,
				name: Cookies.get(CookieKeys.clubName) ?? '',
				symbol: clubSymbol,
				contractURI: uri,
				chain: Chain.Rinkeby,
				version: 'latest'
			})

			log.debug(tx)

			setStep(Step.Initialized)

			// TODO
		} catch (e) {
			setStep(Step.Created)
			showNotification({
				title: 'Error initalizing club.',
				message: `${e as string}`
			})
		}
	}

	const mint = async () => {
		if (!web3Provider) {
			return
		}
		setStep(Step.Minting)
		try {
			const meemContract = new Contract(
				proxyAddress,
				meemABI,
				signer
			) as unknown as meemContracts.Meem

			const tx = await meemContract?.mint(
				{
					to: accounts[0],
					tokenURI: 'ipfs://example',
					parentChain: MeemAPI.Chain.Polygon,
					parent: MeemAPI.zeroAddress,
					parentTokenId: 0,
					meemType: MeemAPI.MeemType.Original,
					data: '',
					isURILocked: false,
					reactionTypes: ['upvote', 'downvote', 'heart'],
					uriSource: MeemAPI.UriSource.TokenUri,
					mintedBy: accounts[0]
				},
				meemContracts.defaultMeemProperties,
				meemContracts.defaultMeemProperties,
				{ gasLimit: '1000000' }
			)

			log.debug(tx)

			// Remove all metadata cookies!
			Cookies.remove(CookieKeys.clubName)
			Cookies.remove(CookieKeys.clubDescription)
			Cookies.remove(CookieKeys.clubImage)
			Cookies.remove(CookieKeys.clubExternalUrl)

			// TODO: Get club slug

			// Route to the created club detail page
			router.push({ pathname: '/clubs/club' })

			setStep(Step.Minted)
		} catch (e) {
			setStep(Step.Initialized)
			showNotification({
				title: 'Error minting club membership.',
				message: `${e as string}`
			})
		}
	}

	return (
		<>
			<Modal
				withCloseButton={false}
				centered
				overlayBlur={8}
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				padding={'sm'}
				opened={isOpened}
				onClose={() => onModalClosed()}
			>
				<Button onClick={create}>1. Create</Button>
				<Button onClick={initialize}>2. Init</Button>
				<Button onClick={mint}>3. Mint</Button>
			</Modal>
		</>
	)
}
