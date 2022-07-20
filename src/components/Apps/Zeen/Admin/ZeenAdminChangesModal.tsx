/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Image,
	Space,
	Modal,
	Divider,
	Stepper,
	MantineProvider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { Chain, Permission } from '@meemproject/meem-contracts'
import * as meemContracts from '@meemproject/meem-contracts'
import { useWallet } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber, ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Zeen } from '../../../../model/apps/zeen/zeen'

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubName: {
		fontSize: 16,
		marginLeft: 16
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 40,
		height: 40,
		minHeight: 40,
		minWidth: 40
	},
	stepsContainer: {
		borderRadius: 16,
		marginBottom: 24
	},
	buttonConfirm: {
		paddingTop: 8,
		paddingLeft: 16,
		paddingBottom: 8,
		paddingRight: 16,
		color: 'white',
		backgroundColor: 'black',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	stepDescription: {
		fontSize: 14
	}
}))

interface IProps {
	zeen?: Zeen
	isOpened: boolean
	onModalClosed: () => void
}

enum Step {
	Start,
	Saving,
	Saved
}

export const ZeenAdminChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	zeen
}) => {
	const router = useRouter()

	const { web3Provider, accounts, signer, meemContract } = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)

	const saveChanges = async () => {
		if (!web3Provider || !zeen) {
			return
		}

		setStep(Step.Saving)
	}

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				size={'lg'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>Confirm changes</Text>
				}
				onClose={() => onModalClosed()}
			>
				<Divider />
				<Space h={12} />
				<div className={classes.header}>
					<div className={classes.headerTitle}>
						<Image
							className={classes.clubLogoImage}
							src={zeen?.image}
						/>
						<Text className={classes.headerClubName}>
							{zeen?.name}
						</Text>
					</div>
				</div>
				<Space h={12} />

				<div className={classes.stepsContainer}>
					<MantineProvider
						theme={{
							colors: {
								brand: [
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E'
								]
							},
							primaryColor: 'brand'
						}}
					>
						<Stepper
							size="md"
							color="green"
							orientation="vertical"
							active={
								step === Step.Start || step === Step.Saved
									? 0
									: 1
							}
						>
							<Stepper.Step
								label={
									step === Step.Saving
										? 'Please wait...'
										: 'Tap below to confirm'
								}
								loading={step === Step.Saving}
								description={
									<>
										{step === Step.Start && (
											<div>
												<Space h={12} />
												<a
													onClick={saveChanges}
													className={
														classes.buttonConfirm
													}
												>
													Confirm changes
												</a>
											</div>
										)}

										{step === Step.Saved && (
											<div>
												<Space h={12} />
												<Text>Done!</Text>
											</div>
										)}
									</>
								}
							/>
						</Stepper>
					</MantineProvider>
				</div>
			</Modal>
		</>
	)
}
