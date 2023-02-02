import log from '@kengoldfarb/log'
import {
	getERC165Contract,
	getERC721Contract
} from '@meemproject/meem-contracts'
import type { IAuthContextState } from '@meemproject/react'
import { ERC20 } from '@meemproject/sdk/build/abis/ERC20'
import erc20ABI from '@meemproject/sdk/build/abis/ERC20.json'
import { BigNumber, ethers } from 'ethers'

// Convenience class for tokens and NFTs
export enum TokenType {
	Token,
	Nft
}

export interface Token {
	type: TokenType
	symbol: string
	name: string
	address: string
	balance: BigNumber
	url: string
}

export async function tokenFromContractAddress(
	contractAddress: string,
	wallet: IAuthContextState
): Promise<Token | undefined> {
	if (
		!wallet.web3Provider ||
		!wallet.signer ||
		!contractAddress ||
		contractAddress.length === 0
	) {
		return undefined
	}

	const contract = await getERC165Contract({
		contractAddress,
		signer: wallet.signer
	})

	let baseUrl = ''

	switch (wallet.chainId) {
		case 5:
			baseUrl = 'https://goerli.etherscan.io/address/'
			break

		case 80001:
			baseUrl = 'https://mumbai.polygonscan.com/address/'
			break

		case 420:
			baseUrl = 'https://goerli-optimism.etherscan.io/'
			break

		case 421613:
			baseUrl = 'https://goerli.arbiscan.io/address/'
			break

		case 137:
		default:
			baseUrl = 'https://polygonscan.com/address/'
			break
	}

	// URL
	const tokenUrl = `${baseUrl}${contractAddress}`

	log.debug('set tokenurl')

	// Balance
	let tokenBalance = BigNumber.from(0)

	let symbol = ''
	let name = ''
	let is721Contract = false
	let is20Contract = false

	try {
		is20Contract = await contract.supportsInterface('0x36372b07')
		log.debug(`is 20 contract = ${is20Contract}`)
		is721Contract = await contract.supportsInterface('0x80ac58cd')
		log.debug(`is 721 contract = ${is721Contract}`)
	} catch (e) {
		log.debug(e)
		return undefined
	}

	// Check against ERC20 token standard
	try {
		const contractToCheck = new ethers.Contract(
			contractAddress,
			erc20ABI,
			wallet.web3Provider
		) as unknown as ERC20
		symbol = await contractToCheck.symbol()
		tokenBalance = await contractToCheck.balanceOf(wallet.accounts[0])
		log.debug(`get token balance (${tokenBalance})`)
		log.debug('get symbol')
		name = await contractToCheck.name()
		log.debug('get name')
	} catch (e) {
		// Ignore, continue
	}

	// Check against ERC721 token standard
	try {
		if (symbol.length === 0) {
			const contractToCheck = await getERC721Contract({
				contractAddress,
				signer: wallet.signer
			})
			symbol = await contractToCheck.symbol()
			if (!is20Contract) {
				tokenBalance = await contractToCheck.balanceOf(
					wallet.accounts[0]
				)
			}
			log.debug(`get token balance (${tokenBalance})`)
			log.debug('get symbol')
			name = await contractToCheck.name()
			log.debug('get name')
		}
	} catch (e) {
		// Ignore, continue
	}

	if (symbol.length === 0) {
		return undefined
	}

	return {
		type: is721Contract
			? TokenType.Nft
			: is20Contract
			? TokenType.Token
			: TokenType.Token,
		address: contractAddress,
		symbol,
		name,
		balance: tokenBalance,
		url: tokenUrl
	}
}
