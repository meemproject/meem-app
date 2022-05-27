import { ERC20 } from '@meemproject/api/build/abis/ERC20'
import erc20ABI from '@meemproject/api/build/abis/ERC20.json'
import { ERC165 } from '@meemproject/meem-contracts/typechain/@solidstate/contracts/introspection/ERC165'
import erc165ABI from '@meemproject/meem-contracts/typechain/@solidstate/contracts/introspection/ERC165.sol/ERC165.json'
import { Contract, Signer, providers, BigNumber } from 'ethers'

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
	web3Provider: providers.Web3Provider,
	signer: Signer
): Promise<Token> {
	const contract = new Contract(
		contractAddress,
		erc165ABI,
		signer
	) as unknown as ERC165

	// URL
	const tokenUrl =
		process.env.NEXT_PUBLIC_NETWORK === 'rinkeby'
			? `https://rinkeby.etherscan.io/address/${contractAddress}`
			: `https://polygonscan.io/address/${contractAddress}`

	// Balance
	let tokenBalance = BigNumber.from(0)
	tokenBalance = await web3Provider.getBalance(contractAddress)

	let symbol = '$TOKEN'
	let name = 'Token'
	let is721Contract = false
	let is20Contract = false

	is721Contract = await contract.supportsInterface('0x80ac58cd')
	is20Contract = await contract.supportsInterface('0x36372b07')
	const the20Contract = new Contract(contractAddress, erc20ABI, signer) as ERC20
	symbol = await the20Contract.symbol()
	name = await the20Contract.name()

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
