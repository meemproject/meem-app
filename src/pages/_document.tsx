import { ServerStyles, createStylesServer } from '@mantine/next'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	render() {
		return (
			<Html lang="en">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

MyDocument.getInitialProps = async ctx => {
	const initialProps = await Document.getInitialProps(ctx)
	const stylesServer = createStylesServer()

	return {
		...initialProps,
		styles: [
			...React.Children.toArray(initialProps.styles),
			(<ServerStyles html={initialProps.html} server={stylesServer} />) as any
		]
	}
}
