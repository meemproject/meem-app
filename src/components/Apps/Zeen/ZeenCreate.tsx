/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Center,
	Image,
	Loader,
	Button,
	Textarea,
	TextInput,
	Space,
	Modal
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import * as meemContracts from '@meemproject/meem-contracts'
import { useWallet } from '@meemproject/react'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { GetClubQuery, MeemContracts } from '../../../../generated/graphql'
import { GET_CLUB } from '../../../graphql/clubs'
import clubFromMeemContract, { Club } from '../../../model/club/club'
import { CookieKeys } from '../../../utils/cookies'
import ClubClubContext from '../../Detail/ClubClubProvider'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'end',
		flexDirection: 'row',
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 12,
			paddingBottom: 12,
			paddingLeft: 16
		}
	},
	headerArrow: {
		marginRight: 32,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 16
		}
	},
	headerPrompt: {
		fontSize: 16,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 0
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 20
		}
	},
	namespaceTextInputContainer: {
		position: 'relative'
	},
	namespaceTextInput: {
		paddingLeft: 154,
		paddingBottom: 3
	},
	namespaceTextInputUrlPrefix: {
		position: 'absolute',
		top: 8,
		left: 24,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	clubNamespaceHint: {
		paddingLeft: 0,
		paddingBottom: 16,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	clubDescriptionPrompt: { fontSize: 18, marginBottom: 0, fontWeight: 600 },
	clubLogoPrompt: {
		marginTop: 32,
		fontSize: 18,
		marginBottom: 8,
		fontWeight: 600
	},
	clubLogoInfo: {
		fontWeight: 500,
		fontSize: 14,
		maxWidth: 650,
		color: 'rgba(45, 28, 28, 0.6)',
		marginBottom: 16
	},
	buttonUpload: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	buttonCreate: {
		marginTop: 48,
		marginBottom: 48,

		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},
	clubLogoImageContainer: {
		marginTop: 24,
		width: 108,
		height: 100,
		position: 'relative'
	},
	clubLogoDeleteButton: {
		position: 'absolute',
		top: '-12px',
		right: '-105px',
		cursor: 'pointer'
	},
	uploadOptions: { display: 'flex' },
	emojiCanvas: {
		position: 'absolute',
		top: 40,
		left: 0,
		marginTop: -12,
		marginBottom: -12,
		lineHeight: 1,
		fontSize: 24,
		zIndex: -1000
	}
}))

interface IProps {
	slug: string
}

export const CreateZeenComponent: React.FC<IProps> = ({ slug }) => {
	const router = useRouter()
	const { classes } = useStyles()

	const [zeenName, setZeenName] = useState(``)
	const [zeenDescription, setZeenDescription] = useState('')
	const clubclub = useContext(ClubClubContext)

	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

	const [isLoading, setIsLoading] = useState(false)
	const wallet = useWallet()

	const {
		loading,
		error,
		data: clubData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { slug }
	})
	const [isLoadingClub, setIsLoadingClub] = useState(true)
	const [club, setClub] = useState<Club>()

	useEffect(() => {
		async function getClub(data: GetClubQuery) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setZeenName(`${possibleClub.name}'s Zeen`)
				setClub(possibleClub)
			}
			setIsLoadingClub(false)
		}
		if (!loading && !error && !club && clubData) {
			getClub(clubData)
		}
	}, [
		club,
		clubData,
		error,
		loading,
		wallet,
		wallet.accounts,
		wallet.isConnected
	])

	useEffect(() => {
		if (club) {
			if (
				// Note: walletContext thinks logged in = LoginState.unknown, using cookies here
				Cookies.get('meemJwtToken') === undefined ||
				Cookies.get('walletAddress') === undefined
			) {
				router.push({
					pathname: '/authenticate',
					query: {
						return: `/${club.slug}/zeen/create`
					}
				})
			}
		}
	}, [club, router])

	// Club logo
	const [smallZeenLogo, setSmallZeenlogo] = useState('')
	const [
		openFileSelector,
		{ filesContent: zeenLogo, loading: isLoadingImage }
	] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		limitFilesConfig: { max: 1 },
		multiple: false,
		maxFileSize: 10
	})

	const resizeFile = (file: any) =>
		new Promise(resolve => {
			Resizer.imageFileResizer(
				file,
				24,
				24,
				'PNG',
				100,
				0,
				uri => {
					resolve(uri)
				},
				'base64'
			)
		})

	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
	const openEmojiPicker = () => {
		setIsEmojiPickerOpen(true)
	}

	function timeout(delay: number) {
		return new Promise(res => setTimeout(res, delay))
	}

	const onEmojiClick = async (event: any, emojiObject: any) => {
		setChosenEmoji(emojiObject)
		setIsEmojiPickerOpen(false)
		await timeout(100)
		// emojiCanvas is a hidden div element containing the chosen emoji
		const element = document.querySelector('#emojiCanvas')
		if (element) {
			log.debug('found emojiCanvas')

			const canvas = await html2canvas(element as HTMLElement)
			const image = canvas.toDataURL('image/png', 1.0)
			const zeenLogoBlob = base64StringToBlob(
				image.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(zeenLogoBlob)
			setSmallZeenlogo(file as string)
		} else {
			log.debug('no emojiCanvas found')
		}
	}

	const navigateToClubAdmin = () => {
		if (club) {
			router.push({ pathname: `/${club.slug}/admin` })
		}
	}

	useEffect(() => {
		const createResizedFile = async () => {
			const zeenLogoBlob = base64StringToBlob(
				zeenLogo[0].content.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(zeenLogoBlob)
			setSmallZeenlogo(file as string)
		}
		if (zeenLogo.length > 0) {
			log.debug('Found an image...')
			log.debug(zeenLogo[0].content)

			createResizedFile()
		} else {
			log.debug('no current club image')
		}
	}, [zeenLogo, router])

	const deleteImage = () => {
		setSmallZeenlogo('')
	}

	const launchZeen = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			await wallet.connectWallet()
			router.reload()
			return
		}

		// Some basic validation
		if (!zeenName || zeenName.length < 3 || zeenName.length > 50) {
			// Club name invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid club name. Please choose a longer or shorter name.'
			})
			return
		}

		if (zeenDescription.length < 3 || zeenDescription.length > 140) {
			// Club name invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid club description. Please choose a longer or shorter description.'
			})
			return
		}

		if (smallZeenLogo.length === 0) {
			showNotification({
				title: 'Oops!',
				message: 'Please provide a club logo.'
			})
		}

		if (!clubclub.isMember) {
			showNotification({
				title: 'No Club Club membership found.',
				message: `Join Club Club to continue.`
			})
			router.push({ pathname: '/' })
			return
		}

		// TODO: Launch zeen
		setIsLoading(true)
		router.push({
			pathname: `/${club?.slug}/zeen/test-zeen/admin`
		})
	}

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
				</Container>
			)}
			{!isLoadingClub && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && club?.name && (
				<>
					<div className={classes.header}>
						<a onClick={navigateToClubAdmin}>
							<ArrowLeft
								className={classes.headerArrow}
								size={32}
							/>
						</a>
						<div>
							<>
								<Text className={classes.headerPrompt}>
									Create a zeen
								</Text>
								{zeenName.length === 0 && (
									<Text className={classes.headerClubName}>
										{' '}
									</Text>
								)}
							</>
							<Text className={classes.headerClubName}>
								{zeenName}
							</Text>
						</div>
					</div>

					<Container>
						<Text className={classes.clubDescriptionPrompt}>
							{`What's your zeen called?`}
						</Text>
						<Space h={8} />

						<TextInput
							radius="lg"
							size="md"
							value={zeenName}
							maxLength={30}
							onChange={event =>
								setZeenName(event.currentTarget.value)
							}
						/>
						<Space h={32} />

						<Text className={classes.clubDescriptionPrompt}>
							In a sentence or two, how would you describe your
							zeen to your community?
						</Text>
						<Space h={8} />

						<Textarea
							radius="lg"
							size="md"
							autosize
							minRows={2}
							maxRows={4}
							maxLength={140}
							onChange={event =>
								setZeenDescription(event.currentTarget.value)
							}
						/>

						<Text className={classes.clubLogoPrompt}>
							Set a thumbnail image for your zeen.
						</Text>
						<Text className={classes.clubLogoInfo}>
							Icons should be square and either JPG or PNG files.
							Note that all uploads will be rendered at 24x24 px.
						</Text>
						{smallZeenLogo.length === 0 && !isLoadingImage && (
							<div className={classes.uploadOptions}>
								<Button
									leftIcon={<Upload size={14} />}
									className={classes.buttonUpload}
									onClick={() => openFileSelector()}
								>
									Upload
								</Button>
								<Space w={'xs'} />
								<Button
									leftIcon={<Text>😈</Text>}
									className={classes.buttonUpload}
									onClick={() => openEmojiPicker()}
								>
									Choose emoji
								</Button>
							</div>
						)}
						{isLoadingImage && <Loader />}
						{!isLoadingImage && smallZeenLogo.length > 0 && (
							<div className={classes.clubLogoImageContainer}>
								<Image
									className={classes.clubLogoImage}
									src={smallZeenLogo}
									width={200}
									height={200}
									fit={'contain'}
								/>
								<a onClick={deleteImage}>
									<Image
										className={classes.clubLogoDeleteButton}
										src="/delete.png"
										width={24}
										height={24}
									/>
								</a>
							</div>
						)}
					</Container>
					<div id="emojiCanvas" className={classes.emojiCanvas}>
						{chosenEmoji && <>{chosenEmoji.emoji}</>}
					</div>

					<Center>
						<Button
							onClick={() => {
								launchZeen()
							}}
							loading={isLoading}
							disabled={
								zeenDescription.length === 0 ||
								smallZeenLogo.length === 0 ||
								isLoading
							}
							className={classes.buttonCreate}
						>
							Launch zeen
						</Button>
					</Center>
					<Modal
						withCloseButton={false}
						padding={8}
						size={296}
						opened={isEmojiPickerOpen}
						onClose={() => {
							setIsEmojiPickerOpen(false)
						}}
					>
						<EmojiPicker onEmojiClick={onEmojiClick} />
					</Modal>
				</>
			)}
		</>
	)
}
