import { useQuery } from '@apollo/client'
import {
	Center,
	Grid,
	Loader,
	Space,
	Text,
	Image,
	useMantineColorScheme,
	Badge
} from '@mantine/core'
import { useMeemApollo } from '@meemproject/react'
import React, { useCallback, useEffect, useState } from 'react'
import { GetExtensionsQuery } from '../../../../generated/graphql'
import { GET_EXTENSIONS } from '../../../graphql/agreements'
import { Agreement, Extension } from '../../../model/agreement/agreements'
import { DeveloperPortalButton } from '../../Developer/DeveloperPortalButton'
import { colorAsh, colorDarkerGrey, useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
	onChosenExtensionsChanged: (chosenExtensions: string[]) => void
}

interface ExtensionCategory {
	title: string
	extensions: Extension[]
}

export const AgreementBlankSlateWidget: React.FC<IProps> = ({
	agreement,
	onChosenExtensionsChanged
}) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	const { anonClient } = useMeemApollo()

	// Fetch a list of available extensions.
	const { loading, data: availableExtensionsData } =
		useQuery<GetExtensionsQuery>(GET_EXTENSIONS, {
			client: anonClient
		})

	const [chosenExtensions, setChosenExtensions] = useState<string[]>([])

	const [extensionCategories, setExtensionCategories] = useState<
		ExtensionCategory[]
	>([])

	const [hasSetInitialSearchTerm, setHasSetInitialSearchTerm] =
		useState(false)

	const toggleExtensionSelected = (extension: any) => {
		if (chosenExtensions.includes(extension.id)) {
			const newExtensionsList = [...chosenExtensions]
			const index = newExtensionsList.indexOf(extension.id) // <-- Not supported in <IE9
			if (index !== -1) {
				newExtensionsList.splice(index, 1)
			}
			setChosenExtensions(newExtensionsList)
			onChosenExtensionsChanged(newExtensionsList)
		} else {
			const newExtensionsList = [...chosenExtensions]
			newExtensionsList.push(extension.id)
			setChosenExtensions(newExtensionsList)
			onChosenExtensionsChanged(newExtensionsList)
		}
	}

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const filterExtensions = useCallback(
		(all: Extension[]) => {
			// Filter out extensions already enabled
			const available: Extension[] = []
			all.forEach(ext => {
				let isAlreadyEnabled = false
				agreement?.extensions?.forEach(enabledExt => {
					if (ext.slug === enabledExt.Extension?.slug) {
						isAlreadyEnabled = true
					}
				})
				if (!isAlreadyEnabled) {
					available.push(ext)
				}
			})

			let searched: Extension[] = []

			// Set up searched extensions
			searched = available

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
		[agreement?.extensions]
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

	return (
		<div className={meemTheme.widgetLight}>
			<Text className={meemTheme.tMediumBold}>Add extensions</Text>
			{loading && (
				<>
					<Space h={32} />
					<Center>
						<Loader variant="oval" color="blue" />
					</Center>
					<Space h={24} />
				</>
			)}
			{!loading && availableExtensionsData && (
				<>
					<Space h={24} />

					{extensionCategories.map(cat => (
						<div key={cat.title}>
							<Text className={meemTheme.tExtraSmallLabel}>
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
										<div
											style={{ position: 'relative' }}
											onClick={() => {
												toggleExtensionSelected(
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
													{extension.description}
												</Text>

												{extension.capabilities.includes(
													'widget'
												) && (
													<Badge
														gradient={{
															from: isDarkTheme
																? colorDarkerGrey
																: colorAsh,
															to: isDarkTheme
																? colorDarkerGrey
																: colorAsh,
															deg: 35
														}}
														classNames={{
															inner: meemTheme.tBadgeText
														}}
														style={{
															position:
																'absolute',
															top: 16,
															right: 16
														}}
														variant={'gradient'}
													>
														Widget
													</Badge>
												)}
											</div>
											<div
												style={{
													position: 'absolute',
													top: -6,
													left: -6
												}}
											>
												{chosenExtensions.includes(
													extension.id
												) && (
													<Image
														width={18}
														height={18}
														src={'/check.png'}
													/>
												)}
											</div>
										</div>
									</Grid.Col>
								))}
							</Grid>
							<Space h={24} />
						</div>
					))}
					<Space h={24} />
					<DeveloperPortalButton
						portalButtonText={`Don't see your app?`}
						modalTitle={'Build your own apps and extensions'}
						modalText={`We're always looking for more 3rd party apps and extensions to integrate with us. Meem is open source and ready for contributions!`}
						devDocsLink={`https://docs.meem.wtf/meem-protocol/meem-web-app/developers/building-an-extension`}
						githubLink={`https://github.com/meemproject/meem-app`}
					/>
					<Space h={16} />
				</>
			)}
		</div>
	)
}
