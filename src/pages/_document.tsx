import { createGetInitialProps } from '@mantine/next'
import Document from 'next/document'

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	static getInitialProps = getInitialProps
}
