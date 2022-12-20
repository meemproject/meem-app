/* eslint-disable import/named */
import log from '@kengoldfarb/log'
import {
	Container,
	Loader,
	Image,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch,
	Select,
	SelectItem
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check } from 'tabler-icons-react'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorGreen, useMeemTheme } from '../../Styles/AgreementsTheme'

export const DiscussionSettings: React.FC = () => {
	// Default settings
	const router = useRouter()
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement, error } = useAgreement()
	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayDashboardWidget, setShouldDisplayDashboardWidget] =
		useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)

	// Discussion-specific settings
	const [shouldShowUpvotesOnWidgetTiles, setShowUpvotesOnWidgetTiles] =
		useState(true)
	const [
		shouldShowCommentCountOnWidgetTiles,
		setShowCommentCountOnWidgetTiles
	] = useState(true)
	const [shouldShowAuthorOnWidgetTiles, setShowAuthorOnWidgetTiles] =
		useState(true)

	// These are role ids
	const [newDiscussionsRole, setNewDiscussionsRole] = useState<string>()
	const [manageExtensionRole, setManageExtensionRole] = useState<string>()
	const [upvoteRole, setUpvoteRole] = useState<string>()
	const [leaveCommentsRole, setLeaveCommentsRole] = useState<string>()

	// Convert roles to Mantine SelectItems
	const [roleSelectItems, setRoleSelectItems] = useState<SelectItem[]>([])
	const [hasSetRoleSelectItems, setHasSetRoleSelectItems] = useState(false)
	useEffect(() => {
		if (
			roleSelectItems?.length === 0 &&
			agreement &&
			agreement.roles &&
			!hasSetRoleSelectItems
		) {
			const items: React.SetStateAction<SelectItem[] | undefined> = []
			agreement.roles.forEach(role => {
				const item: SelectItem = { value: role.id, label: role.name }
				items.push(item)
			})
			setRoleSelectItems(items)
			setHasSetRoleSelectItems(true)
			log.debug(`Set ${items.length} roles as dropdown options`)
		}
	}, [agreement, hasSetRoleSelectItems, roleSelectItems])

	/*
	TODO:
	Add your extension's name, which shows up as the page title.
	 */
	const extensionName = 'Discussions'

	/*
	TODO
	Add your custom extension settings layout here.
	 */
	const customExtensionSettings = () => (
		<>
			<Space h={48} />
			<Text className={meemTheme.tExtraSmallLabel}>CONFIGURE WIDGET</Text>
			<Space h={16} />
			<div>
				<Space h={4} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Show upvotes on widget tiles'}
						checked={shouldShowUpvotesOnWidgetTiles}
						onChange={value => {
							if (value) {
								setShowUpvotesOnWidgetTiles(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div>
			<div>
				<Space h={4} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Show comment count on widget tiles'}
						checked={shouldShowCommentCountOnWidgetTiles}
						onChange={value => {
							if (value) {
								setShowCommentCountOnWidgetTiles(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div>
			<div>
				<Space h={4} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Show author on widget tiles'}
						checked={shouldShowAuthorOnWidgetTiles}
						onChange={value => {
							if (value) {
								setShowAuthorOnWidgetTiles(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div>
			<Space h={16} />
		</>
	)

	/*
	TODO
	Add your custom extension permissions layout here.
	 */
	const customExtensionPermissions = () => (
		<>
			<Space h={12} />

			<Text className={meemTheme.tSmallBold}>
				Who can start new discussions?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={
					newDiscussionsRole ? newDiscussionsRole : 'agreement-member'
				}
				onChange={(value: string) => {
					setNewDiscussionsRole(value)
				}}
			/>
			<Space h={24} />
			<Text className={meemTheme.tSmallBold}>
				Who can manage extension settings?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={manageExtensionRole ? manageExtensionRole : 'admin'}
				onChange={(value: string) => {
					setManageExtensionRole(value)
				}}
			/>
			<Space h={24} />
			<Text className={meemTheme.tSmallBold}>
				Who can upvote and downvote?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={upvoteRole ? upvoteRole : 'agreement-member'}
				onChange={(value: string) => {
					setUpvoteRole(value)
				}}
			/>
			<Space h={24} />
			<Text className={meemTheme.tSmallBold}>
				Who can leave comments?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={
					leaveCommentsRole ? leaveCommentsRole : 'agreement-member'
				}
				onChange={(value: string) => {
					setLeaveCommentsRole(value)
				}}
			/>
			<Space h={24} />
			<Button
				className={meemTheme.buttonWhite}
				onClick={() => {
					router.push({
						pathname: `/${agreement?.slug}/admin`,
						query: { tab: 'roles' }
					})
				}}
			>
				Manage roles
			</Button>
		</>
	)

	/*
	TODO
	Use this function to save any specific settings you have created for this extension and make any calls you need to external APIs.
	 */
	const saveCustomChanges = async () => {}

	/*
	Boilerplate area - please don't edit the below code!
	===============================================================
	 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await saveCustomChanges()
		setIsSavingChanges(false)
	}

	const navigateToAgreementHome = () => {
		router.push({
			pathname: `/${agreement?.slug}`
		})
	}

	const navigateToAllExtensions = () => {
		router.push({
			pathname: `/${agreement?.slug}/admin`,
			query: { tab: 'extensions' }
		})
	}

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	return (
		<div>
			{agreement && !agreement?.isCurrentUserAgreementAdmin && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							Sorry, you do not have permission to view this page.
							Contact the agreement owner for help.
						</Text>
					</Center>
				</Container>
			)}

			{agreement && agreement?.isCurrentUserAgreementAdmin && (
				<div>
					<div className={meemTheme.pageHeader}>
						<div className={meemTheme.spacedRowCentered}>
							<ArrowLeft
								className={meemTheme.clickable}
								onClick={() => {
									navigateToAllExtensions()
								}}
							/>
							<Space w={24} />
							<Image
								radius={8}
								height={56}
								width={56}
								className={meemTheme.imagePixelated}
								src={agreement?.image}
							/>
							{/* <Text className={classes.headerAgreementName}>{agreementName}</Text> */}
							<div className={meemTheme.pageHeaderTitleContainer}>
								<Text className={meemTheme.tLargeBold}>
									{agreement.name}
								</Text>
								<Space h={8} />
								<div className={meemTheme.row}>
									<Text
										className={meemTheme.tExtraSmallFaded}
									>{`${window.location.origin}/${agreement.slug}`}</Text>
									<Image
										className={meemTheme.copyIcon}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${window.location.origin}/${agreement.slug}`
											)
											showNotification({
												radius: 'lg',
												title: 'Agreement URL copied',
												autoClose: 2000,
												color: colorGreen,
												icon: <Check />,

												message: `This agreement's URL was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</div>
						</div>
						<a
							className={meemTheme.pageHeaderExitButton}
							onClick={navigateToAgreementHome}
						>
							<Image src="/delete.png" width={24} height={24} />
						</a>
					</div>

					<Container>
						<Space h={16} />
						<div
							className={meemTheme.spacedRow}
							style={{ marginBottom: 32 }}
						>
							<div>
								<Text className={meemTheme.tExtraSmallLabel}>
									SETTINGS
								</Text>
								<Space h={4} />
								<div className={meemTheme.centeredRow}>
									<Text className={meemTheme.tLargeBold}>
										{extensionName}
									</Text>
								</div>
							</div>
							<Button
								disabled={isSavingChanges}
								loading={isSavingChanges}
								onClick={() => {
									saveChanges()
								}}
								className={meemTheme.buttonBlack}
							>
								Save Changes
							</Button>
						</div>
						<Divider />
						<Space h={32} />
						<Text className={meemTheme.tExtraSmallLabel}>
							DISPLAY SETTINGS
						</Text>

						<div>
							<Space h={16} />
							<div className={meemTheme.spacedRowCentered}>
								<Switch
									color={'green'}
									label={'Display dashboard widget'}
									checked={shouldDisplayDashboardWidget}
									onChange={value => {
										if (value) {
											setShouldDisplayDashboardWidget(
												value.currentTarget.checked
											)
										}
									}}
								/>
							</div>
							<Space h={16} />
							<Divider />
						</div>
						<div>
							<Space h={4} />
							<div className={meemTheme.spacedRowCentered}>
								<Switch
									color={'green'}
									label={
										'Hide widget if viewer is not a agreement member'
									}
									checked={isPrivateExtension}
									onChange={value => {
										if (value) {
											setIsPrivateExtension(
												value.currentTarget.checked
											)
										}
									}}
								/>
							</div>
							<Space h={16} />
							<Divider />
						</div>
						<Space h={16} />

						<Button
							disabled={isDisablingExtension}
							loading={isDisablingExtension}
							className={meemTheme.buttonBlue}
							onClick={disableExtension}
						>
							Disable extension
						</Button>

						{customExtensionSettings()}
						<Space h={32} />
						<Text className={meemTheme.tExtraSmallLabel}>
							PERMISSIONS
						</Text>
						<Space h={16} />

						{customExtensionPermissions()}
						<Space h={48} />
						<Button
							disabled={isSavingChanges}
							loading={isSavingChanges}
							onClick={() => {
								saveChanges()
							}}
							className={meemTheme.buttonBlack}
						>
							Save Changes
						</Button>
					</Container>
				</div>
			)}
			{isLoadingAgreement && (
				<>
					<Space h={32} />
					<Center>
						<Loader variant="oval" color="blue" />
					</Center>
				</>
			)}
			{!isLoadingAgreement && error && (
				<>
					<Space h={32} />
					<Center>
						<Text className={meemTheme.tSmall}>
							{`Error loading ${extensionName} settings!`}
						</Text>
					</Center>
				</>
			)}
		</div>
	)
}
