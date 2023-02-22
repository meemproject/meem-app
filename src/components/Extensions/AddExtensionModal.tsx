/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import {
	Text,
	Image,
	Space,
	TextInput,
	Grid,
	Loader,
	useMantineColorScheme,
	Center,
	Modal
} from '@mantine/core'
import { useMeemApollo, useSDK } from '@meemproject/react'
import React, { useCallback, useEffect, useState } from 'react'
import { GetExtensionsQuery } from '../../../generated/graphql'
import { GET_EXTENSIONS as GET_EXTENSIONS } from '../../graphql/agreements'
import { Agreement, Extension } from '../../model/agreement/agreements'
import { DeveloperPortalButton } from '../Developer/DeveloperPortalButton'
import { useMeemTheme } from '../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
	isOpened: boolean
	onModalClosed: () => void
}

interface ExtensionCategory {
	title: string
	extensions: Extension[]
}

export const AddExtensionModal: React.FC<IProps> = ({
	agreement,
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { anonClient } = useMeemApollo()

	// Fetch a list of available extensions.
	const {
		loading,
		error,
		data: availableExtensionsData
	} = useQuery<GetExtensionsQuery>(GET_EXTENSIONS, {
		client: anonClient,
		skip: !isOpened
	})

	// Lists of extensions
	const [extensionCategories, setExtensionCategories] = useState<
		ExtensionCategory[]
	>([])

	// Current search term
	const [currentSearchTerm, setCurrentSearchTerm] = useState('')
	const [isEnablingExtension, setIsEnablingExtension] = useState(false)
	const [enablingExtensionName, setEnablingExtensionName] = useState('')
	const [hasSetInitialSearchTerm, setHasSetInitialSearchTerm] =
		useState(false)

	const filterExtensions = useCallback(
		(all: Extension[], search: string) => {
			// Filter out extensions already enabled
			const available: Extension[] = []
			all.forEach(ext => {
				let alreadyEnabled = false
				agreement?.extensions?.forEach(enabledExt => {
					if (ext.slug === enabledExt.Extension?.slug) {
						alreadyEnabled = true
					}
				})
				if (!alreadyEnabled) {
					available.push(ext)
				}
			})

			const filteredExtensions: Extension[] = []
			let searched: Extension[] = []

			// Set up searched extensions
			if (currentSearchTerm.length > 0) {
				available.forEach(ext => {
					if (ext.name.toLowerCase().includes(search.toLowerCase())) {
						filteredExtensions.push(ext)
					}
				})
				searched = filteredExtensions
			} else {
				searched = available
			}

			// Now sort searched extensions into categories
			const categories: ExtensionCategory[] = []
			searched.forEach(ext => {
				let existingCategory: any = undefined

				// Check if the category already exists
				categories.forEach(cat => {
					if (cat.title === ext.category) {
						existingCategory = cat
					}
				})

				if (existingCategory) {
					existingCategory.extensions.push(ext)
				} else {
					categories.push({
						title: ext.category ?? 'basic',
						extensions: [ext]
					})
				}
			})
			setExtensionCategories(categories)
		},
		[agreement?.extensions, currentSearchTerm]
	)

	useEffect(() => {
		if (availableExtensionsData && !loading && !hasSetInitialSearchTerm) {
			setHasSetInitialSearchTerm(true)
			filterExtensions(availableExtensionsData.Extensions, '')
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
			extensionId: extension.id,
			isInitialized: true,
			isSetupComplete: !extension.isSetupRequired
		})
		// Required to avoid a race condition where the extension has not
		// yet been enabled on the database
		await new Promise(f => setTimeout(f, 2000))
		onModalClosed()
		setHasSetInitialSearchTerm(false)
		setIsEnablingExtension(false)
	}

	return (
		<>
			<Modal
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						Add Extensions
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<div>
					{!loading && extensionCategories.length > 0 && (
						<>
							<TextInput
								radius={16}
								size={'md'}
								onChange={event => {
									setCurrentSearchTerm(
										event.target.value ?? ''
									)
									if (availableExtensionsData?.Extensions) {
										filterExtensions(
											availableExtensionsData.Extensions,
											event.target.value ?? ''
										)
									}
								}}
								placeholder="Search Extensions"
							/>
							<Space h={32} />

							{extensionCategories.map(cat => (
								<div key={cat.title}>
									<Text
										className={meemTheme.tExtraSmallLabel}
									>
										{`${cat.title.toUpperCase()}`}
									</Text>
									<Space h={16} />
									<Grid>
										{cat.extensions.map(extension => (
											<Grid.Col
												xs={8}
												sm={8}
												md={6}
												lg={6}
												xl={6}
												key={extension.name}
											>
												<a
													onClick={() => {
														enableExtension(
															extension
														)
													}}
												>
													<div
														className={
															meemTheme.extensionGridItem
														}
														style={{
															position: 'relative'
														}}
													>
														<div
															className={
																meemTheme.extensionGridItemHeader
															}
														>
															<Image
																src={`/${
																	isDarkTheme
																		? `${extension.icon?.replace(
																				'.png',
																				'-white.png'
																		  )}`
																		: extension.icon
																}`}
																width={24}
																height={24}
																fit={'contain'}
															/>
															<Space w={8} />
															<Text>{`${extension.name}`}</Text>
														</div>

														<Text
															className={
																meemTheme.tExtraSmallFaded
															}
															style={{
																marginTop: 12
															}}
														>
															{
																extension.description
															}
														</Text>
													</div>
												</a>
											</Grid.Col>
										))}
									</Grid>
									<Space h={24} />
								</div>
							))}
						</>
					)}
					{!loading && extensionCategories.length === 0 && (
						<>
							<Center>
								<Text>
									No additional extensions are available for
									this community.
								</Text>
							</Center>
						</>
					)}
					{loading && (
						<>
							<Center>
								<Loader color="cyan" variant="oval" />
							</Center>
						</>
					)}
					{!loading && error && (
						<>
							<Center>
								<Text>
									Unable to load available extensions.
								</Text>
							</Center>
						</>
					)}

					<DeveloperPortalButton
						portalButtonText={`Don't see your app?`}
						modalTitle={'Build your own apps and extensions'}
						modalText={`We're always looking for more 3rd party apps and extensions to integrate with us. Meem is open source and ready for contributions! Pull Requests are always welcome.`}
						devDocsLink={`https://docs.meem.wtf/meem-protocol/meem-web-app/developers/building-an-extension`}
						githubLink={`https://github.com/meemproject/meem-app`}
					/>

					<Modal
						centered
						radius={16}
						overlayBlur={8}
						size={'60%'}
						padding={'lg'}
						withCloseButton={false}
						opened={isEnablingExtension}
						onClose={() => {}}
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
							<Loader variant="oval" color="cyan" />
						</Center>
					</Modal>
				</div>
			</Modal>
		</>
	)
}