/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Image,
	Space,
	TextInput,
	Grid,
	Divider,
	Loader,
	useMantineColorScheme,
	Center,
	Modal
} from '@mantine/core'
import { useMeemApollo, useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Settings } from 'tabler-icons-react'
import { GetExtensionsQuery } from '../../../../generated/graphql'
import { GET_EXTENSIONS as GET_EXTENSIONS } from '../../../graphql/agreements'
import { Agreement, Extension } from '../../../model/agreement/agreements'
import { colorGrey, useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AdminAgreementExtensions: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const { sdk } = useSDK()
	const { anonClient } = useMeemApollo()

	// Fetch a list of available extensions.
	const {
		loading,
		error,
		data: availableExtensionsData
	} = useQuery<GetExtensionsQuery>(GET_EXTENSIONS, {
		client: anonClient
	})

	// Lists of extensions
	const [searchedExtensions, setSearchedExtensions] = useState<Extension[]>(
		availableExtensionsData?.Extensions ?? []
	)
	// Current search term
	const [currentSearchTerm, setCurrentSearchTerm] = useState('')
	const [isEnablingExtension, setIsEnablingExtension] = useState(false)
	const [enablingExtensionName, setEnablingExtensionName] = useState('')
	const [hasSetInitialSearchTerm, setHasSetInitialSearchTerm] =
		useState(false)

	const filterExtensions = useCallback(
		(available: Extension[]) => {
			const search = currentSearchTerm
			const filteredExtensions: Extension[] = []

			if (currentSearchTerm.length > 0) {
				available.forEach(ext => {
					if (ext.name.toLowerCase().includes(search)) {
						filteredExtensions.push(ext)
					}
				})
				setSearchedExtensions(filteredExtensions)
			} else {
				setSearchedExtensions(available)
			}
		},
		[currentSearchTerm]
	)

	useEffect(() => {
		if (availableExtensionsData && !loading && !hasSetInitialSearchTerm) {
			setHasSetInitialSearchTerm(true)
			filterExtensions(availableExtensionsData.Extensions)
		}
	}, [
		availableExtensionsData,
		filterExtensions,
		hasSetInitialSearchTerm,
		loading
	])

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const enableExtension = async (extension: Extension) => {
		setEnablingExtensionName(extension?.name ?? '')
		setIsEnablingExtension(true)
		await sdk.agreementExtension.createAgreementExtension({
			agreementId: agreement?.id ?? '',
			extensionId: extension.id
		})
		setIsEnablingExtension(false)
	}

	const navigateToExtensionSettings = (slug: string) => {
		router.push(`/${agreement.slug}/e/${slug}/settings`)
	}

	const navigateToExtensionHome = (slug: string) => {
		router.push(`/${agreement.slug}/e/${slug}`)
	}

	log.debug('EXTENSIONS YO', availableExtensionsData)

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={meemTheme.tLargeBold}>
					Community Extensions
				</Text>
				<Space h={32} />

				{agreement.extensions && agreement.extensions.length > 0 && (
					<>
						<Text
							className={meemTheme.tMediumBold}
						>{`Enabled extensions (${agreement.extensions.length})`}</Text>
						<Space h={12} />
						<Grid>
							{agreement.extensions.map(extension => {
								let isExtensionBeingEnabled = false
								if (
									Array.isArray(
										extension.metadata?.transactions
									)
								) {
									extension.metadata?.transactions.forEach(
										(tx: {
											status: MeemAPI.TransactionStatus
										}) => {
											if (
												tx.status ===
												MeemAPI.TransactionStatus
													.Pending
											) {
												isExtensionBeingEnabled = true
											}
										}
									)
								}
								return (
									<Grid.Col
										xs={8}
										sm={8}
										md={4}
										lg={4}
										xl={4}
										key={extension.id}
									>
										<div
											className={
												meemTheme.extensionGridItemEnabled
											}
										>
											<div
												className={
													meemTheme.extensionGridItemEnabledHeaderBackground
												}
											/>
											<div
												className={
													meemTheme.extensionGridItemHeader
												}
											>
												<Image
													src={`/${isDarkTheme
															? `${(
																extension
																	.Extension
																	?.icon ??
																''
															).replace(
																'.png',
																'-white.png'
															)}`
															: extension
																.Extension
																?.icon
														}`}
													width={16}
													height={16}
													fit={'contain'}
												/>
												<Space w={8} />
												<Text>{`${extension.Extension?.name}`}</Text>
												{isExtensionBeingEnabled && (
													<>
														<Space w={8} />
														<Loader
															color="red"
															variant="oval"
															size={16}
														/>
													</>
												)}
												{/* {extension.isVerified && (
												<>
													<Space w={12} />
													<Image
														src="/icon-verified.png"
														width={16}
														height={16}
													/>
													<Space w={4} />
													<Text
														color={'#3EA2FF'}
														size={'sm'}
													>
														Verified
													</Text>
												</>
											)} */}
											</div>
											<div
												style={{
													width: '100%'
												}}
											>
												<Space h={16} />
												<Divider color={colorGrey} />
											</div>
											<div
												className={meemTheme.row}
												style={{
													height: 46
												}}
											>
												<a
													onClick={() => {
														navigateToExtensionHome(
															extension.Extension
																?.slug ?? ''
														)
													}}
												>
													<div
														className={
															meemTheme.row
														}
														style={{
															cursor: 'pointer',
															padding: 12
														}}
													>
														<ExternalLink
															size={20}
														/>
														<Space w={4} />
														<Text
															className={
																meemTheme.tExtraSmall
															}
														>
															Homepage
														</Text>
													</div>
												</a>
												<Space w={4} />
												<Divider orientation="vertical" />
												<Space w={4} />

												<a
													onClick={() => {
														if (
															extension.Extension
														) {
															navigateToExtensionSettings(
																extension
																	.Extension
																	?.slug ?? ''
															)
														}
													}}
												>
													<div
														className={
															meemTheme.row
														}
														style={{
															cursor: 'pointer',
															padding: 12
														}}
													>
														<Settings size={20} />
														<Space w={4} />
														<Text
															className={
																meemTheme.tExtraSmall
															}
														>
															Settings
														</Text>
													</div>
												</a>
											</div>
										</div>
									</Grid.Col>
								)
							})}
						</Grid>
						<Space h={32} />
					</>
				)}
				{!loading && availableExtensionsData && (
					<>
						<Text
							className={meemTheme.tMediumBold}
						>{`Available extensions (${searchedExtensions?.length})`}</Text>
						<Space h={8} />

						<TextInput
							radius={16}
							size={'md'}
							onChange={event => {
								if (event.target.value) {
									setCurrentSearchTerm(event.target.value)
									filterExtensions(
										availableExtensionsData.Extensions
									)
								} else {
									setSearchedExtensions(
										availableExtensionsData.Extensions
									)
								}
							}}
							placeholder="Search Apps"
						/>
						<Space h={24} />
						<Grid>
							{searchedExtensions.map(extension => (
								<Grid.Col
									xs={8}
									sm={8}
									md={4}
									lg={4}
									xl={4}
									key={extension.name}
								>
									<a
										onClick={() => {
											enableExtension(extension)
										}}
									>
										<div
											className={
												meemTheme.extensionGridItem
											}
										>
											<div
												className={
													meemTheme.extensionGridItemHeader
												}
											>
												<Image
													src={`/${isDarkTheme
															? `${extension.icon?.replace(
																'.png',
																'-white.png'
															)}`
															: extension.icon
														}`}
													width={16}
													height={16}
													fit={'contain'}
												/>
												<Space w={8} />
												<Text>{`${extension.name}`}</Text>
											</div>
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{ marginTop: 6 }}
											>
												{extension.description}
											</Text>
										</div>
									</a>
								</Grid.Col>
							))}
						</Grid>
					</>
				)}
				{loading && (
					<>
						<Loader color="blue" variant="oval" />
					</>
				)}
				{!loading && error && (
					<>
						<Text>Unable to load available extensions.</Text>
					</>
				)}

				<Space h="xl" />
				<Modal
					centered
					radius={16}
					overlayBlur={8}
					size={'60%'}
					padding={'lg'}
					withCloseButton={false}
					opened={isEnablingExtension}
					onClose={() => { }}
				>
					<Center>
						<Text className={meemTheme.tLargeBold}>
							Please wait...
						</Text>
					</Center>
					<Space h={24} />

					<Center>
						<Text>{`Enabling ${enablingExtensionName}`}</Text>
					</Center>
					<Space h={24} />

					<Center>
						<Loader variant="oval" color="blue" />
					</Center>
				</Modal>
			</div>
		</>
	)
}
