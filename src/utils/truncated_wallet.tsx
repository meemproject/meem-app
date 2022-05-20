export function truncatedWalletAddress(address: string): string {
	if (address.length === 0) {
		return ''
	}

	const walletAddressLength = address.length
	const truncatedWallet = `${address.substring(0, 5)}...${address.substring(
		walletAddressLength - 5,
		walletAddressLength
	)}`

	return truncatedWallet.toLowerCase()
}
