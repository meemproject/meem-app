/* eslint-disable import/named */
import { ERC20 } from '@meemproject/api/build/abis/ERC20'
import erc20ABI from '@meemproject/api/build/abis/ERC20.json'
import erc165ABI from '@meemproject/meem-contracts/artifacts/@solidstate/contracts/introspection/ERC165.sol/ERC165.json'
import { ERC165 } from '@meemproject/meem-contracts/typechain/@solidstate/contracts/introspection/ERC165'
import { Contract, BigNumber } from 'ethers'

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

	const contract = new Contract(
		contractAddress,
		erc165ABI.abi,
		wallet.signer
	) as unknown as ERC165

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

	console.log('get token balance')

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
		const the20Contract = new Contract(
			contractAddress,
			erc20ABI,
			wallet.signer
		) as ERC20
		symbol = await the20Contract.symbol()
		console.log('get symbol')
		name = await the20Contract.name()
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
