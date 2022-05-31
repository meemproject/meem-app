import {
	getERC165Contract,
	getERC721Contract
} from '@meemproject/meem-contracts'
import { BigNumber } from 'ethers'

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
	wallet: any
): Promise<Token | undefined> {
	if (!wallet.web3Provider || !wallet.signer || !contractAddress) {
		return undefined
	}

	const contract = await getERC165Contract({
		contractAddress,
		signer: wallet.signer
	})

	// URL
	const tokenUrl =
		process.env.NEXT_PUBLIC_NETWORK === 'rinkeby'
			? `https://rinkeby.etherscan.io/address/${contractAddress}`
			: `https://polygonscan.io/address/${contractAddress}`

	console.log('set tokenurl')

	// Balance
	let tokenBalance = BigNumber.from(0)
	try {
		tokenBalance = await wallet.web3Provider.getBalance(contractAddress)
	} catch (e) {
		return undefined
	}

	console.log(`get token balance (${tokenBalance})`)

	let symbol = '$TOKEN'
	let name = 'Token'
	let is721Contract = false
	let is20Contract = false

	try {
		is721Contract = await contract.supportsInterface('0x80ac58cd')
		console.log('check is 721')
	} catch (e) {
		return undefined
	}

	try {
		is20Contract = await contract.supportsInterface('0x36372b07')
		console.log('check is 20')
		const contractToCheck = await getERC721Contract({
			contractAddress,
			signer: wallet.signer
		})
		symbol = await contractToCheck.symbol()
		console.log('get symbol')
		name = await contractToCheck.name()
		console.log('get name')
	} catch (e) {
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
