import { ethers } from 'ethers'

export async function truncatedWalletAddress(address: string): Promise<string> {
	if (address.length === 0) {
		return ''
	}
	const provider = new ethers.providers.AlchemyProvider(
		'mainnet',
		process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
	)
	const name = await provider.lookupAddress(address)
	if (name !== null) return name

	const walletAddressLength = address.length
	const truncatedWallet = `${address.substring(0, 5)}...${address.substring(
		walletAddressLength - 5,
		walletAddressLength
	)}`

	return truncatedWallet.toLowerCase()
}

export function quickTruncate(address: string): string {
	if (!address || address.length === 0) {
		return ''
	}

	const walletAddressLength = address.length
	const truncatedWallet = `${address.substring(0, 5)}...${address.substring(
		walletAddressLength - 5,
		walletAddressLength
	)}`

	return truncatedWallet.toLowerCase()
}
