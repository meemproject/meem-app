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
	buttonRed: {
		color: 'white',
		marginLeft: 8,
		backgroundColor: 'rgba(217, 92, 75, 1)',
		'&:hover': {
			backgroundColor: theme.colors.red[8]
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
	centered: {
		alignItems: 'center',
		textAlign: 'center'
	},
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
	headerTitleContainer: {
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginLeft: 16
		}
	},
	headerExitButton: {
		marginRight: 48,
		marginLeft: 'auto',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		},
		cursor: 'pointer'
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
	panelLayoutContainer: {
		display: 'flex',
		width: '100%',
		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			flexDirection: 'column'
		}
	},

	panelLayoutContent: {
		marginLeft: 32,
		marginRight: 32,
		width: '100%',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 8,
			width: 'auto'
		}
	},
	panelLayoutNavBar: {
		minWidth: 288,
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			paddingLeft: 32
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 24
		}
	},
	panelLayoutNavItem: { borderRadius: 8 },

	row: {
		display: 'flex'
	},
	// A row which turns into a column when display is narrow enough
	rowResponsive: {
		display: 'flex',
		flexDirection: 'row',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			flexDirection: 'column'
		}
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

	// Images
	imageClubLogo: {
		imageRendering: 'pixelated',
		width: 80,
		height: 80,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 40,
			height: 40,
			minHeight: 40,
			minWidth: 40,
			marginLeft: 16,
			marginRight: 16
		}
	},

	// Misc
	backArrow: {
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	badge: {
		paddingLeft: 8,
		paddingRight: 8
	},
	clickable: {
		cursor: 'pointer'
	},
	connectMethodButton: {
		backgroundColor: '#FAFAFA',
		width: 200,
		height: 200,
		borderRadius: 20,
		border: '1px solid rgba(0, 0, 0, 0.1)',
		cursor: 'pointer',
		position: 'relative'
	},
	connectMethodButtonSmall: {
		backgroundColor: '#FAFAFA',
		display: 'flex',
		flexDirection: 'row',
		borderRadius: 32,
		padding: 8,
		border: '1px solid rgba(0, 0, 0, 0.1)',
		cursor: 'pointer',
		alignItems: 'center'
	},
	connectMethodButtonContent: {
		marginTop: 55,
		alignItems: 'center',
		textAlign: 'center'
	},

	copyIcon: {
		marginLeft: 4,
		padding: 2,
		cursor: 'pointer'
	},
	invisibleContainer: { display: 'none' },
	visibleContainer: { display: 'block' },

	// Text
	tBadge: {
		color: '#FF6651'
	},

	tBold: {
		fontWeight: 700
	},

	tHeaderTitleText: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
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
	tPanelLayoutNavHeader: {
		fontWeight: 600,
		opacity: 0.5
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
	tSmall: {
		fontSize: 16
	},
	tTitle: {
		fontWeight: 600,
		fontSize: 24
	},
	tSubtitle: {
		fontWeight: 600,
		fontSize: 18
	},
	tSmallSubtitle: {
		opacity: 0.6,
		fontWeight: 500,
		fontSize: 14
	}
}))
