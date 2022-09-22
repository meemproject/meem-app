/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createStyles } from '@mantine/core'

export const useGlobalStyles = createStyles(theme => ({
	// Buttons
	buttonBlack: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	buttonGrey: {
		marginLeft: 8,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	buttonWhite: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},

	// Form Fields
	fRadio: { fontWeight: 600, fontFamily: 'Inter' },
	fTextField: {
		backgroundColor: '#FAFAFA',
		border: '0px',
		height: 60
	},
	fTextFieldRoot: {},

	// Layout
	centeredRow: {
		display: 'flex',
		alignItems: 'center'
	},
	centeredRowClickable: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer'
	},
	fullWidth: {
		width: '100%'
	},
	gridItem: {
		marginBottom: 24,
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	header: {
		marginBottom: 32,
		display: 'flex',
		backgroundColor: '#FAFAFA',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 8,
			paddingTop: 16
		}
	},
	modalHeader: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		position: 'relative'
	},
	row: {
		display: 'flex'
	},
	spacedRowCentered: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	spacedRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},

	// Misc
	backArrow: {
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	clickable: {
		cursor: 'pointer'
	},
	copyIcon: {
		marginLeft: 4,
		padding: 2,
		cursor: 'pointer'
	},

	// Text
	tBold: {
		fontWeight: 700
	},
	tLink: {
		textDecoration: 'underline',
		cursor: 'pointer',
		color: 'rgba(255, 102, 81, 1)',
		fontWeight: 700
	},
	tModalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	tListItemTitle: {
		fontWeight: 700
	},
	tListItemSubtitle: {
		opacity: 0.6,
		fontSize: 14
	},
	tPartialTransparent: {
		opacity: 0.6
	},
	tSectionTitleSmall: {
		fontSize: 14,
		opacity: 0.58,
		fontWeight: 600,
		letterSpacing: 1.05
	},
	tSectionTitle: {
		fontWeight: 600,
		fontSize: 20
	},
	tTitle: {
		fontWeight: 600,
		fontSize: 24
	},
	tSubtitle: {
		fontWeight: 600,
		fontSize: 18
	}
}))
