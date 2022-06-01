import { ERC20 } from '@meemproject/api/build/abis/ERC20'
import erc20ABI from '@meemproject/api/build/abis/ERC20.json'
import {
	getERC165Contract,
	getERC721Contract
} from '@meemproject/meem-contracts'
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
	wallet: any
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

	let symbol = ''
	let name = ''
	let is721Contract = false
	let is20Contract = false

	try {
		is20Contract = await contract.supportsInterface('0x36372b07')
		console.log(`is 20 contract = ${is20Contract}`)
		is721Contract = await contract.supportsInterface('0x80ac58cd')
		console.log(`is 721 contract = ${is721Contract}`)
	} catch (e) {
		console.log(e)
		return undefined
	}

	// Check against ERC20 token standard
	try {
		const contractToCheck = new ethers.Contract(
			contractAddress,
			erc20ABI,
			wallet.web3Provider
		) as ERC20
		symbol = await contractToCheck.symbol()
		console.log('get symbol')
		name = await contractToCheck.name()
		console.log('get name')
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
			console.log('get symbol')
			name = await contractToCheck.name()
			console.log('get name')
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
