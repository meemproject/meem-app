import { showNotification } from '@mantine/notifications'
import React from 'react'
import { Check, X } from 'tabler-icons-react'

export function showSuccessNotification(title: string, message: string) {
	showNotification({
		title,
		color: 'green',
		icon: <Check color="white" />,
		message
	})
}

export function showErrorNotification(title: string, message: string) {
	showNotification({
		title,
		color: 'red',
		icon: <X color="white" />,
		message
	})
}
