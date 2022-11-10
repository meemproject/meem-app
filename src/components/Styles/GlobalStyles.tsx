/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createStyles } from '@mantine/core'
import { color } from 'html2canvas/dist/types/css/types/color'

export const colorBlack = '#000000'
export const colorDarkGrey = '#444444'
export const colorGrey = '#E1E1E1'
export const colorLightGrey = '#F2F2F2'
export const colorLightestGrey = '#FAFAFA'
export const colorWhite = '#FFFFFF'
export const colorPink = '#FF6651'
export const colorLightPink = '#FFF0EE'
export const colorGreen = '#1DAD4E'

export const useGlobalStyles = createStyles(theme => ({
	// Buttons
	buttonBlack: {
		backgroundColor: colorBlack,
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	buttonGrey: {
		marginLeft: 8,
		backgroundColor: colorGrey,
		'&:hover': {
			backgroundColor: colorLightGrey
		},
		borderRadius: 24
	},
	buttonRed: {
		color: colorWhite,
		marginLeft: 8,
		backgroundColor: colorPink,
		'&:hover': {
			backgroundColor: colorLightPink
		},
		borderRadius: 24
	},
	buttonWhite: {
		borderRadius: 24,
		color: colorBlack,
		borderColor: colorBlack,
		backgroundColor: colorWhite,
		'&:hover': {
			backgroundColor: colorLightestGrey
		}
	},

	// Form Fields
	fRadio: { fontWeight: 600, fontFamily: 'Inter' },
	fTextField: {
		backgroundColor: colorLightestGrey,
		border: '0px',
		height: 60
	},
	fOrangeSelectableSpan: {
		padding: 4,
		borderRadius: 8,
		fontWeight: 'bold',
		backgroundColor: colorLightPink,
		color: colorPink,
		cursor: 'pointer'
	},

	// Layout
	clickable: {
		cursor: 'pointer'
	},
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
	invisibleContainer: { display: 'none' },
	visibleContainer: { display: 'block' },

	// Grids and items
	boxBorderedRounded: {
		border: colorGrey,
		padding: 16,
		borderRadius: 16
	},
	gridItem: {
		marginBottom: 24,
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		border: colorLightGrey,
		backgroundColor: colorLightestGrey,
		borderRadius: 16,
		padding: 16
	},
	gridItemCentered: {
		border: colorLightGrey,
		backgroundColor: colorLightestGrey,
		fontWeight: 600,
		borderRadius: 16,
		padding: 16,
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center'
	},
	connectMethodGridItem: {
		backgroundColor: colorLightestGrey,
		width: 200,
		height: 200,
		borderRadius: 20,
		border: colorGrey,
		cursor: 'pointer',
		position: 'relative'
	},
	connectMethodGridItemMobile: {
		backgroundColor: colorLightestGrey,
		display: 'flex',
		flexDirection: 'row',
		borderRadius: 32,
		padding: 8,
		border: colorGrey,
		cursor: 'pointer',
		alignItems: 'center'
	},
	connectMethodGridItemContent: {
		marginTop: 55,
		alignItems: 'center',
		textAlign: 'center'
	},
	integrationGridItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		minHeight: 110,
		marginBottom: 12,
		cursor: 'pointer',
		border: colorGrey,
		backgroundColor: colorLightestGrey,
		borderRadius: 16,
		padding: 16
	},
	integrationGridItemEnabled: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 12,
		border: colorGrey,
		backgroundColor: colorLightestGrey,
		borderRadius: 16,
		paddingTop: 16,
		position: 'relative'
	},
	integrationGridItemEnabledHeaderBackground: {
		backgroundColor: colorLightestGrey,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 53,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16
	},
	integrationGridItemActions: {
		display: 'flex',
		flexDirection: 'row',
		height: 46
	},
	integrationGridItemAction: {
		cursor: 'pointer',
		display: 'flex',
		flexDirection: 'row',
		padding: 12
	},
	integrationGridItemHeader: {
		fontWeight: 600,
		display: 'flex',
		alignItems: 'center',
		zIndex: 1
	},

	// Page Header
	pageHeader: {
		marginBottom: 32,
		display: 'flex',
		backgroundColor: colorLightestGrey,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: colorLightGrey,
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

	// Page Footer
	pageFooterContainer: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0
	},
	pageFooterBackground: {
		backgroundColor: colorWhite,
		width: '100%',
		height: 48,
		paddingTop: 8
	},

	// Modal
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
		border: `1px solid ${colorLightGrey}`,
		borderRadius: 16,
		padding: 16
	},

	// Page Panel Layout
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

	// Site header bar
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
		color: theme.colorScheme === 'dark' ? colorDarkGrey : colorBlack,
		padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
		borderRadius: theme.radius.sm,
		transition: 'background-color 100ms ease'
	},
	siteHeaderUserActive: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorWhite
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
	copyIcon: {
		marginLeft: 4,
		padding: 2,
		cursor: 'pointer'
	},
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
		backgroundColor: colorWhite,
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

	// Text styles
	tExtraExtraLarge: { fontWeight: 600, fontSize: '32px', lineHeight: '120%' },
	tExtraLarge: { fontWeight: 600, fontSize: '28px', lineHeight: '120%' },
	tLargeBold: { fontWeight: 600, fontSize: '24px', lineHeight: '120%' },
	tLarge: { fontSize: '24px', lineHeight: '120%' },
	tMediumBold: { fontWeight: 600, fontSize: '18px', lineHeight: '120%' },
	tMediumBoldFaded: {
		fontSize: 18,
		fontWeight: 600,
		lineHeight: '120%',
		opacity: 0.6
	},
	tMediumButton: { fontWeight: 500, fontSize: '18px', lineHeight: '120%' },
	tMediumFaded: { fontWeight: 400, fontSize: '18px', lineHeight: '120%' },
	tMedium: { fontWeight: 400, fontSize: '18px', lineHeight: '120%' },
	tSmallBold: { fontWeight: 600, fontSize: '16px', lineHeight: '120%' },
	tSmallBoldFaded: {
		fontWeight: 600,
		fontSize: '16px',
		lineHeight: '120%',
		opacity: 0.6
	},
	tSmallFaded: {
		fontSize: '16px',
		opacity: 0.6
	},
	tSmall: { fontWeight: 500, fontSize: '16px', lineHeight: '130%' },
	tSmallLabel: {
		fontWeight: 600,
		fontSize: '16px',
		lineHeight: '120%',
		letterSpacing: '0.05em',
		textTransform: 'uppercase'
	},
	tExtraSmallBold: {
		fontSize: '14px',
		lineHeight: '120%',
		fontWeight: 600
	},
	tExtraSmallLabel: {
		fontSize: '14px',
		lineHeight: '120%',
		fontWeight: 600,
		opacity: 0.6
	},
	tExtraSmallFaded: {
		fontWeight: 500,
		fontSize: '14px',
		lineHeight: '120%',
		opacity: 0.6
	},
	tExtraSmall: { fontWeight: 500, fontSize: '14px', lineHeight: '120%' },
	tExtraExtraSmall: { fontWeight: 500, fontSize: '12px', lineHeight: '120%' },

	// Text variants
	tLink: {
		textDecoration: 'underline',
		cursor: 'pointer',
		color: colorPink,
		fontWeight: 600
	},
	tEllipsis: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	}
}))
