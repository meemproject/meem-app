import { useQuery } from '@apollo/client'
import {
	Center,
	Grid,
	Loader,
	Space,
	Text,
	Image,
	useMantineColorScheme
} from '@mantine/core'
import { useMeemApollo } from '@meemproject/react'
import React, { useEffect, useState } from 'react'
import { GetExtensionsQuery } from '../../../../generated/graphql'
import { GET_EXTENSIONS } from '../../../graphql/agreements'
import { Agreement } from '../../../model/agreement/agreements'
import {
	colorAshLight,
	colorDarkGrey,
	useMeemTheme
} from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
	onChosenExtensionsChanged: (chosenExtensions: string[]) => void
}

export const AgreementBlankSlateWidget: React.FC<IProps> = ({
	agreement,
	onChosenExtensionsChanged
}) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	const { anonClient } = useMeemApollo()

	const [chosenExtensions, setChosenExtensions] = useState<string[]>([])

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

	// Fetch a list of available extensions.
	const { loading, data: availableExtensionsData } =
		useQuery<GetExtensionsQuery>(GET_EXTENSIONS, {
			client: anonClient
		})

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

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
					<Grid>
						{availableExtensionsData.Extensions.map(extension => (
							<Grid.Col
								xs={4}
								sm={4}
								md={4}
								lg={4}
								xl={4}
								key={extension.id}
							>
								<div
									className={meemTheme.gridItemCenteredAsh}
									style={{
										height: '150px',
										backgroundColor: isDarkTheme
											? colorDarkGrey
											: colorAshLight,
										boxShadow: 'none',
										position: 'relative'
									}}
									onClick={() => {
										toggleExtensionSelected(extension)
									}}
								>
									<Center>
										<Image
											src={`/${
												isDarkTheme
													? `${extension.icon?.replace(
															'.png',
															'-white.png'
													  )}`
													: extension.icon
											}`}
											fit={'contain'}
											height={16}
										/>
									</Center>
									<Space h={12} />
									<Center>
										<Text className={meemTheme.tSmallBold}>
											{extension.name}
										</Text>
									</Center>
									<Space h={4} />
									<Center>
										<Text
											className={meemTheme.tExtraSmall}
											style={{
												display: '-webkit-box',
												WebkitLineClamp: '3',
												WebkitBoxOrient: 'vertical',
												overflow: 'hidden',
												textAlign: 'center'
											}}
										>
											{extension.description}
										</Text>
									</Center>
									<div
										style={{
											position: 'absolute',
											top: 8,
											left: 8
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
					<Space h={16} />
				</>
			)}
		</div>
	)
}
