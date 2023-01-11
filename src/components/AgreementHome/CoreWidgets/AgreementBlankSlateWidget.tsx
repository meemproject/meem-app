import { useQuery } from '@apollo/client'
import { Button, Center, Space, Text } from '@mantine/core'
import { useMeemApollo } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { GetExtensionsQuery } from '../../../../generated/graphql'
import { GET_EXTENSIONS } from '../../../graphql/agreements'
import { Agreement } from '../../../model/agreement/agreements'
import { colorBlack, useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementBlankSlateWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()

	useEffect(() => {}, [agreement])

	const { anonClient } = useMeemApollo()

	// Fetch a list of available extensions.
	const {
		loading,
		error,
		data: availableExtensionsData
	} = useQuery<GetExtensionsQuery>(GET_EXTENSIONS, {
		client: anonClient
	})

	return (
		<div className={meemTheme.widgetLight}>
			<Text className={meemTheme.tMediumBold}>Add extensions</Text>
			<Space h={8} />
		</div>
	)
}
