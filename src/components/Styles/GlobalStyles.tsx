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
	fOrangeSelectableSpan: {
		padding: 4,
		borderRadius: 8,
		fontWeight: 'bold',
		backgroundColor: 'rgba(255, 102, 81, 0.1)',
		color: 'rgba(255, 102, 81, 1)',
		cursor: 'pointer'
	},

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
	footerContainer: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0
	},
	footerBackground: {
		backgroundColor: 'white',
		width: '100%',
		height: 48,
		paddingTop: 8
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
	gridItemCentered: {
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		fontWeight: 600,
		borderRadius: 16,
		padding: 16,
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center'
	},
	pageHeader: {
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
	pageHeaderTitleContainer: {
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginLeft: 16
		}
	},
	pageHeaderExitButton: {
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
	modalStepsContainer: {
		border: '1px solid rgba(204, 204, 204, 1)',
		borderRadius: 16,
		padding: 16
	},
	pagePanelLayoutContainer: {
		display: 'flex',
		width: '100%',
		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			flexDirection: 'column'
		}
	},

	pagePanelLayoutContent: {
		marginLeft: 32,
		marginRight: 32,
		width: '100%',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 8,
			width: 'auto'
		}
	},
	pagePanelLayoutNavBar: {
		minWidth: 288,
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			paddingLeft: 32
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 24
		}
	},
	pagePanelLayoutNavItem: { borderRadius: 8 },

	row: {
		display: 'flex'
	},
	rowEndAlign: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'end'
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

	// Site header bar styles
	siteHeader: {
		marginTop: 0,
		paddingTop: 8,
		paddingBottom: '-8px'
	},
	siteHeaderLeftItems: {
		marginLeft: 4,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	siteHeaderRightItems: {
		marginBottom: 4,
		marginRight: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 20
		}
	},
	siteHeaderMainLogo: {
		fontSize: 32,
		marginLeft: 16,
		marginRight: 8,
		paddingBottom: 6,
		cursor: 'pointer'
	},
	siteHeaderInner: {
		height: 56,
		marginTop: '-4px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	siteHeaderUser: {
		marginBottom: '5px',
		color:
			theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
		padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
		borderRadius: theme.radius.sm,
		transition: 'background-color 100ms ease'
	},
	siteHeaderUserActive: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
	},
	siteHeaderMenuEllipse: {
		[theme.fn.smallerThan('md')]: {
			marginLeft: 0,
			marginRight: 0
		},
		marginRight: 24,
		marginLeft: 24
	},

	// Images
	emojiCanvas: {
		position: 'absolute',
		top: 40,
		left: 0,
		marginTop: -12,
		marginBottom: -12,
		lineHeight: 1,
		fontSize: 24,
		zIndex: -1000
	},
	emojiCanvasCover: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 256,
		height: 256,
		marginTop: -12,
		marginBottom: -12,
		backgroundColor: 'white',
		zIndex: -1
	},
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
	imageClubLogoContainer: {
		marginTop: 32,
		width: 108,
		height: 100,
		position: 'relative'
	},
	imageClubLogoDeleteButton: {
		position: 'absolute',
		top: '-12px',
		right: '-105px',
		cursor: 'pointer'
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
	borderedBoxRounded: {
		border: '1px solid rgba(0, 0, 0, 0.5)',
		padding: 16,
		borderRadius: 16
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
	clubIntegrationItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		minHeight: 110,
		marginBottom: 12,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},

	enabledClubIntegrationItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 12,
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: 'white',
		borderRadius: 16,
		paddingTop: 16,
		position: 'relative'
	},
	enabledClubIntegrationItemHeaderBackground: {
		backgroundColor: '#FAFAFA',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 53,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16
	},
	integrationActions: {
		display: 'flex',
		flexDirection: 'row',
		height: 46
	},
	integrationAction: {
		cursor: 'pointer',
		display: 'flex',
		flexDirection: 'row',
		padding: 12
	},
	clubIntegrationItemHeader: {
		fontWeight: 600,
		display: 'flex',
		alignItems: 'center',
		zIndex: 1
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
	tBoldRed: {
		fontWeight: 600,
		color: 'rgba(255, 102, 81, 1)'
	},
	tBoldFaded: {
		fontWeight: 700,
		opacity: 0.6
	},
	tEllipsis: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},
	tExtraSmall: {
		fontSize: 14
	},
	tExtraSmallBold: {
		fontSize: 14,
		fontWeight: 700
	},
	tExtraSmallFaded: {
		fontSize: 14,
		opacity: 0.6
	},
	tExtraSmallBoldFaded: {
		fontSize: 14,
		fontWeight: 700,
		opacity: 0.6
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
	tMembershipSetting: {
		fontSize: 20,
		marginBottom: 8,
		lineHeight: 2,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	tMembershipSettingAdditionalRequirement: {
		fontSize: 20,
		marginBottom: 16,
		marginTop: 16,
		lineHeight: 2,
		position: 'relative',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	tModalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	tListItemTitle: {
		fontWeight: 700
	},
	tFaded: {
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
	},
	tSubtitleFadedBold: {
		fontSize: 18,
		fontWeight: 600,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	tSubtitleFaded: {
		opacity: 0.6,
		fontSize: 18
	},
	tSuccess: {
		fontWeight: 600,
		fontSize: 22,
		color: 'rgba(29, 173, 78, 1)'
	},
	tSmallSubtitle: {
		opacity: 0.6,
		fontWeight: 500,
		fontSize: 14
	}
}))
