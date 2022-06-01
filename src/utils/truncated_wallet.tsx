import { providers } from 'ethers'

export async function truncatedWalletAddress(
	address: string,
	provider?: providers.Web3Provider
): Promise<string> {
	if (address.length === 0) {
		return ''
	}
	if (provider) {
		const name = await provider.lookupAddress(address)
		if (name !== null) return name
	}

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
