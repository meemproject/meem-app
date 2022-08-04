import { createGetInitialProps } from '@mantine/next'
import Document from 'next/document'

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
	public static getInitialProps = getInitialProps
}
