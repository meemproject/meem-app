import log from '@kengoldfarb/log'
import { Button, Select, Switch, TextInput } from '@mantine/core'
import {
	deployProxy,
	initProxy,
	versions,
	upgrade
} from '@meemproject/meem-contracts'
import { Chain } from '@meemproject/meem-contracts/dist/src/lib/meemStandard'
import { useWallet } from '@meemproject/react'
// import { Contract } from 'ethers'
import React, { useState } from 'react'

export const CreatePage: React.FC = () => {
	// const [proxyContract, setProxyContract] = useState<Contract | undefined>()
	const [proxyAddress, setProxyAddress] = useState<string>('')
	const [fromVersion, setFromVersion] = useState<string>('latest')
	const [toVersion, setToVersion] = useState<string>('latest')
	const [status, setStatus] = useState<string>('Not created')
	const [txLog, setTxLog] = useState<string[]>([])
	const [shouldShowUpgrade, setShouldShowUpgrade] = useState(false)

	const { web3Provider } = useWallet()

	const handleCreate = async () => {
		if (!web3Provider) {
			return
		}

		setTxLog([...txLog, 'Creating proxy...'])

		const contract = await deployProxy({
			provider: web3Provider
		})
		// setProxyContract(contract)
		setProxyAddress(contract.address)
		setTxLog([...txLog, `Deployed proxy at ${contract.address}`])
		log.debug(
			`Deployed proxy at ${contract.address} w/ tx: ${contract.deployTransaction.hash}`
		)
		setStatus('Created')
	}

	const handleInit = async () => {
		if (!web3Provider || !proxyAddress) {
			return
		}

		setTxLog([...txLog, `Initializing proxy...`])

		const tx = await initProxy({
			provider: web3Provider,
			proxyContractAddress: proxyAddress,
			name: 'Test',
			symbol: 'TEST',
			contractURI:
				'{"name": "Test","description": "testing","image": "","external_link": ""}',
			chain: Chain.Rinkeby,
			version: fromVersion
		})

		log.debug(tx)

		setTxLog([...txLog, `Initialized proxy w/ tx: ${tx.hash}`])

		setStatus('Created and initialized')
	}

	const handleUpgrade = async () => {
		if (!web3Provider) {
			return
		}

		setTxLog([
			...txLog,
			`Upgrading proxy from version: ${fromVersion} to version: ${toVersion}...`
		])

		const tx = await upgrade({
			provider: web3Provider,
			proxyContractAddress: proxyAddress,
			chain: Chain.Rinkeby,
			fromVersion,
			toVersion
		})

		setTxLog([...txLog, `Upgraded proxy w/ tx ${tx.hash}`])
	}

	const displayVersions = [
		{
			version: 'latest',
			displayName: `latest (${versions[Chain.Rinkeby].latest})`
		},
		{
			version: 'beta',
			displayName: `beta (${versions[Chain.Rinkeby].beta})`
		},
		{
			version: 'alpha',
			displayName: `alpha (${versions[Chain.Rinkeby].alpha})`
		},
		...Object.keys(versions[Chain.Rinkeby].history).map(k => ({
			version: k,
			displayName: k
		}))
	]

	return (
		<>
			<h1>{shouldShowUpgrade ? 'Upgrade a club' : 'Create a club'}</h1>
			<Switch
				label={shouldShowUpgrade ? 'Create a club' : 'Upgrade a club'}
				checked={shouldShowUpgrade}
				onChange={event => setShouldShowUpgrade(event.currentTarget.checked)}
				size="lg"
			/>
			<div>
				<Select
					label={shouldShowUpgrade ? 'From version' : 'Version'}
					onChange={v => setFromVersion(v ?? 'latest')}
					data={displayVersions.map(dv => ({
						value: dv.version,
						label: dv.displayName
					}))}
					defaultValue="latest"
				/>
			</div>
			{shouldShowUpgrade && (
				<div>
					<Select
						label="To version"
						onChange={v => setToVersion(v ?? 'latest')}
						data={displayVersions.map(dv => ({
							value: dv.version,
							label: dv.displayName
						}))}
						defaultValue="latest"
					/>
				</div>
			)}
			<div>
				<Button onClick={shouldShowUpgrade ? handleUpgrade : handleCreate}>
					{shouldShowUpgrade ? 'Upgrade Club' : '1. Create Club'}
				</Button>
			</div>
			{!shouldShowUpgrade && (
				<div>
					<Button onClick={handleInit} disabled={proxyAddress.length === 0}>
						2. Initialize Club
					</Button>
				</div>
			)}
			<div>
				{/* <input
					type="text"
					value={proxyAddress}
					onChange={e => setProxyAddress(e.target.value)}
				/> */}
				<TextInput
					label="Contract Address"
					placeholder="0x..."
					value={proxyAddress}
					onChange={event => setProxyAddress(event.currentTarget.value)}
				/>
			</div>
			{/* <button onClick={handleInit} disabled={!proxyContract}>
				3. Mint
			</button> */}
			<p>Club status: {status}</p>
			{txLog.map(l => (
				<p key={l}>{l}</p>
			))}
		</>
	)
}
