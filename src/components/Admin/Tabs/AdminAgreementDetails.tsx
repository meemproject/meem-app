import log from '@kengoldfarb/log'
import { Text, Button, Textarea, Space, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/AgreementsTheme'
import { AgreementAdminChangesModal } from '../AgreementAdminChangesModal'
interface IProps {
	agreement: Agreement
}

export const AdminAgreementDetails: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const [agreementName, setAgreementName] = useState('')
	const [agreementDescription, setAgreementDescription] = useState('')
	const [hasLoadedAgreementData, setHasLoadedAgreementData] = useState(false)
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	useEffect(() => {
		if (!hasLoadedAgreementData) {
			setHasLoadedAgreementData(true)
			setAgreementName(agreement.name ?? '')
			setAgreementDescription(agreement.description ?? '')
		}
	}, [agreement, hasLoadedAgreementData])

	const [newAgreementData, setNewAgreementData] = useState<Agreement>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = () => {
		// Some basic validation
		if (agreementName.length < 3 || agreementName.length > 50) {
			// Agreement name invalid
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'You entered an invalid agreement name. Please choose a longer or shorter name.'
			})
			return
		}

		if (
			agreementDescription.length < 3 ||
			agreementDescription.length > 140
		) {
			// Agreement name invalid
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'You entered an invalid agreement description. Please choose a longer or shorter description.'
			})
			return
		}

		// 'save changes' modal for execution agreement settings updates
		// convert current settings and update for the modal
		const oldAgreement = JSON.stringify(agreement)
		const newAgreement = JSON.parse(oldAgreement)
		newAgreement.name = agreementName
		newAgreement.description = agreementDescription
		newAgreement.image = agreement.image

		if (oldAgreement === JSON.stringify(newAgreement)) {
			log.debug('no changes, nothing to save. Tell user.')
			setIsSavingChanges(false)
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'There are no changes to save.'
			})
			return
		} else {
			setNewAgreementData(newAgreement)
			setSaveChangesModalOpened(true)
		}
	}

	const saveChanges = async () => {
		setIsSavingChanges(true)
		openSaveChangesModal()
	}

	return (
		<div className={meemTheme.fullWidth}>
			<Space h={12} />

			<Text className={meemTheme.tLargeBold}>Agreement Profile</Text>
			<Space h={32} />

			<Text
				className={meemTheme.tMediumBold}
			>{`What's your agreement called?`}</Text>
			<Space h={12} />
			<TextInput
				radius="lg"
				size="md"
				value={agreementName}
				style={{ maxWidth: 800 }}
				onChange={event => setAgreementName(event.currentTarget.value)}
			/>
			<Space h={'xl'} />
			<Text className={meemTheme.tMediumBold}>
				In a sentence, describe what your members do together.
			</Text>
			<Space h={12} />
			<Textarea
				radius="lg"
				size="md"
				minRows={2}
				maxRows={4}
				maxLength={140}
				style={{ maxWidth: 800 }}
				value={agreementDescription}
				onChange={event =>
					setAgreementDescription(event.currentTarget.value)
				}
			/>

			<Space h={40} />
			<Button
				className={meemTheme.buttonBlack}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={64} />
			<AgreementAdminChangesModal
				agreement={newAgreementData}
				isOpened={isSaveChangesModalOpened}
				onModalClosed={() => {
					setIsSavingChanges(false)
					setSaveChangesModalOpened(false)
				}}
			/>
		</div>
	)
}
