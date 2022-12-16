/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import {
	Text,
	Image,
	Space,
	TextInput,
	Grid,
	Divider,
	Loader,
	useMantineColorScheme
} from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Settings } from 'tabler-icons-react'
import { GetExtensionsQuery } from '../../../../generated/graphql'
import { GET_EXTENSIONS as GET_EXTENSIONS } from '../../../graphql/clubs'
import { Club, Extension } from '../../../model/club/club'
import { colorGrey, useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const CAClubExtensions: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()

	// Fetch a list of available extensions.
	const {
		loading,
		error,
		data: availableExtensionsData
	} = useQuery<GetExtensionsQuery>(GET_EXTENSIONS)

	// Lists of extensions
	const [searchedExtensions, setSearchedExtensions] = useState<Extension[]>(
		availableExtensionsData?.Extensions ?? []
	)
	// Current search term
	const [currentSearchTerm, setCurrentSearchTerm] = useState('')
	const [isEnablingExtension, setIsEnablingExtension] = useState(false)
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

	const enableExtension = async (extention: Extension) => {
		// TODO
		setIsEnablingExtension(true)
		setIsEnablingExtension(false)
	}

	const navigateToExtensionSettings = (slug: string) => {
		router.push(`${club.slug}/e/${slug}/settings`)
	}

	return (
		<>
			<div>
				<Space h={12} />

				<Text className={clubsTheme.tLargeBold}>Club Extensions</Text>
				<Space h={32} />

				{club.extensions && club.extensions.length > 0 && (
					<>
						<Text
							className={clubsTheme.tMediumBold}
						>{`Enabled extensions (${club.extensions.length})`}</Text>
						<Space h={12} />
						<Grid>
							{club.extensions.map(extension => (
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
											clubsTheme.extensionGridItemEnabled
										}
									>
										<div
											className={
												clubsTheme.extensionGridItemEnabledHeaderBackground
											}
										/>
										<div
											className={
												clubsTheme.extensionGridItemHeader
											}
										>
											<Image
												src={`/${
													isDarkTheme
														? `${(
																extension
																	.Extension
																	?.icon ?? ''
														  ).replace(
																'.png',
																'-white.png'
														  )}`
														: extension.Extension
																?.icon
												}`}
												width={16}
												height={16}
												fit={'contain'}
											/>
											<Space w={8} />
											<Text>{`${extension.Extension?.name}`}</Text>
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
											className={clubsTheme.row}
											style={{
												height: 46
											}}
										>
											<a onClick={() => {}}>
												<div
													className={clubsTheme.row}
													style={{
														cursor: 'pointer',
														padding: 12
													}}
												>
													<ExternalLink size={20} />
													<Space w={4} />
													<Text
														className={
															clubsTheme.tExtraSmall
														}
													>
														Launch App
													</Text>
												</div>
											</a>
											<Space w={4} />
											<Divider orientation="vertical" />
											<Space w={4} />

											<a
												onClick={() => {
													if (extension.Extension) {
														navigateToExtensionSettings(
															extension.Extension
																?.slug ?? ''
														)
													}
												}}
											>
												<div
													className={clubsTheme.row}
													style={{
														cursor: 'pointer',
														padding: 12
													}}
												>
													<Settings size={20} />
													<Space w={4} />
													<Text
														className={
															clubsTheme.tExtraSmall
														}
													>
														Settings
													</Text>
												</div>
											</a>
										</div>
									</div>
								</Grid.Col>
							))}
						</Grid>
						<Space h={32} />
					</>
				)}
				{!loading && availableExtensionsData && (
					<>
						<Text
							className={clubsTheme.tMediumBold}
						>{`Available apps (${searchedExtensions?.length})`}</Text>
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
												clubsTheme.extensionGridItem
											}
										>
											<div
												className={
													clubsTheme.extensionGridItemHeader
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
													width={16}
													height={16}
													fit={'contain'}
												/>
												<Space w={8} />
												<Text>{`${extension.name}`}</Text>
											</div>
											<Text
												className={
													clubsTheme.tExtraSmall
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
						<Loader color="red" variant="oval" />
					</>
				)}
				{!loading && error && (
					<>
						<Text>Unable to load available extensions.</Text>
					</>
				)}

				<Space h="xl" />
			</div>
		</>
	)
}
