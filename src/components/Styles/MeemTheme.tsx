import { createStyles } from '@mantine/core'

// Primary Palette
export const colorBlack = '#000000'
export const colorDarkerGrey = '#222222'
export const colorDarkGrey = '#444444'
export const colorGrey = '#E1E1E1'
export const colorLightGrey = '#F2F2F2'
export const colorLightestGrey = '#FAFAFA'
export const colorWhite = '#FFFFFF'
export const colorBlue = '#7da6c4'
export const colorBlueHover = '#EFF7FF'
export const colorLightBlue = '#EFF7FF'
export const colorDarkBlue = '#26699D'
export const colorLightYellow = `#FEFFE5`
export const colorYellow = '#F9FF15'
export const colorTransparentYellow = '#f9ff1599'
export const colorDarkYellow = '#e0e810'
export const colorDarkerYellow = '#4d4f08'
export const colorOrangeRed = '#FF6651'
export const colorRed = '#D95C4B'
export const colorDarkRed = '#c35244'
export const colorAsh = '#BFCDD8'
export const colorAshHover = '#b0c1cf'
export const colorAshLight = '#F4F7F8'

// Utility colors
export const colorGreen = '#1DAD4E'
export const colorVerified = 'rgba(62, 162, 255, 1)'
export const colorSiteDarkModeBg = '#1A1C1E'

export const useMeemTheme = createStyles(theme => ({
	// Buttons
	buttonTransparent: {
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: 'transparent'
		},
		'&:loading': {
			backgroundColor: 'transparent'
		},
		'&:disabled': {
			backgroundColor: 'transparent'
		},
		color: colorBlack,
		borderRadius: 24
	},
	buttonBlack: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorBlack,
		'&:hover': {
			backgroundColor: colorDarkGrey
		},
		'&:loading': {
			backgroundColor: colorDarkGrey
		},
		'&:disabled': {
			backgroundColor: colorDarkGrey
		},
		borderRadius: 24
	},
	buttonAsh: {
		backgroundColor: colorAsh,
		'&:hover': {
			backgroundColor: colorAshHover
		},
		'&:loading': {
			backgroundColor: colorAshHover
		},
		'&:disabled': {
			backgroundColor: colorAshHover
		},
		color: colorBlack,
		borderRadius: 24
	},
	buttonGrey: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey,
		'&:hover': {
			backgroundColor: colorLightGrey
		},
		'&:loading': {
			backgroundColor: colorLightGrey
		},
		'&:disabled': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorDarkGrey : colorLightGrey
		},
		color: theme.colorScheme === 'dark' ? colorWhite : colorBlack,
		borderRadius: 24
	},
	buttonDarkGrey: {
		backgroundColor: colorDarkGrey,
		'&:hover': {
			backgroundColor: colorDarkerGrey
		},
		'&:loading': {
			backgroundColor: colorDarkerGrey
		},
		'&:disabled': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorDarkGrey : colorLightGrey
		},
		color: colorWhite,
		borderRadius: 24
	},
	buttonBlue: {
		color: colorWhite,
		backgroundColor: colorBlue,
		'&:hover': {
			backgroundColor: colorDarkBlue
		},
		'&:loading': {
			backgroundColor: colorDarkBlue
		},
		'&:disabled': {
			backgroundColor: colorDarkBlue
		},
		borderRadius: 24
	},
	buttonDarkBlue: {
		color: colorWhite,
		backgroundColor: colorDarkBlue,
		'&:hover': {
			backgroundColor: colorBlue
		},
		'&:loading': {
			backgroundColor: colorBlue
		},
		'&:disabled': {
			backgroundColor: colorBlue
		},
		borderRadius: 24
	},
	buttonDiscordBlue: {
		color: colorWhite,
		backgroundColor: '#5865F2',
		'&:hover': {
			backgroundColor: '#7289da'
		},
		'&:loading': {
			backgroundColor: '#7289da'
		},
		'&:disabled': {
			backgroundColor: '#7289da'
		},
		borderRadius: 24
	},
	buttonYellow: {
		color: colorBlack,
		backgroundColor: colorYellow,
		'&:hover': {
			backgroundColor: colorDarkYellow
		},
		'&:loading': {
			backgroundColor: colorDarkYellow
		},
		'&:disabled': {
			backgroundColor: colorDarkYellow,
			color: colorBlack
		},
		borderRadius: 24
	},
	buttonRed: {
		color: colorWhite,
		backgroundColor: colorRed,
		'&:hover': {
			backgroundColor: colorDarkRed
		},
		'&:loading': {
			backgroundColor: colorDarkRed
		},
		'&:disabled': {
			backgroundColor: colorDarkRed,
			color: colorBlack
		},
		borderRadius: 24
	},
	buttonYellowSolidBordered: {
		color: colorBlack,
		backgroundColor: colorYellow,
		'&:hover': {
			backgroundColor: colorDarkYellow
		},
		'&:loading': {
			backgroundColor: colorDarkYellow
		},
		'&:disabled': {
			backgroundColor: colorDarkYellow,
			color: colorBlack
		},
		border: `1px solid ${colorBlack}`,
		borderRadius: 24
	},
	buttonYellowBordered: {
		color: colorYellow,
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: colorDarkerGrey
		},
		'&:loading': {
			backgroundColor: colorDarkerGrey
		},
		'&:disabled': {
			backgroundColor: colorDarkerGrey
		},
		border: `2px solid ${colorYellow}`,
		borderRadius: 24
	},
	buttonOrangeRedBordered: {
		color: colorOrangeRed,
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorDarkerGrey : colorLightGrey
		},
		'&:loading': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorDarkerGrey : colorLightGrey
		},
		'&:disabled': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorDarkerGrey : colorLightGrey
		},
		border: `2px solid ${colorOrangeRed}`,
		borderRadius: 24
	},
	buttonWhite: {
		borderRadius: 24,
		color: theme.colorScheme === 'dark' ? colorWhite : colorBlack,
		borderColor: colorBlack,
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkerGrey : colorWhite,
		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorBlack : colorLightGrey
		},
		'&:loading': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorBlack : colorLightGrey
		},
		'&:disabled': {
			backgroundColor:
				theme.colorScheme === 'dark' ? colorDarkGrey : colorLightGrey
		}
	},

	// Form Fields
	fRadio: { fontWeight: 600, fontFamily: 'Inter' },
	fTextField: {
		border: '0px',
		height: 60,
		backgroundColor: theme.colorScheme === 'dark' ? '' : colorLightestGrey
	},
	fBlueSelectableSpan: {
		padding: 4,
		borderRadius: 8,
		fontWeight: 'bold',
		backgroundColor: colorLightBlue,
		color: colorDarkBlue,
		cursor: 'pointer'
	},
	fRichTextEditorContainer: {
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`,
		lineHeight: 1.4,
		borderRadius: 16
	},
	fRichTextEditorToolbar: {
		border: 'none',
		borderRadius: 24,
		lineHeight: 1.4,
		marginBottom: 10
	},
	fRichTextEditorContent: {
		lineHeight: 1.4
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
		[`@media (max-width: 1000px)`]: {
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
	visibleDesktopOnly: {
		display: 'block',
		[`@media (max-width: 1000px)`]: {
			display: 'none'
		}
	},
	visibleMobileOnly: {
		display: 'none',
		[`@media (max-width: 1000px)`]: {
			display: 'block'
		}
	},

	// Grids and items
	boxBorderedRounded: {
		border: `1px solid ${colorGrey}`,
		padding: 16,
		borderRadius: 16
	},
	gridItem: {
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		boxShadow:
			theme.colorScheme === 'dark'
				? ''
				: '5px 5px 30px rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		width: '100%',
		backgroundColor: theme.colorScheme === 'dark' ? colorBlack : colorWhite,
		padding: 24
	},
	gridItemCenteredAsh: {
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		boxShadow:
			theme.colorScheme === 'dark'
				? ''
				: '5px 5px 30px rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		width: '100%',
		backgroundColor: colorAsh,
		alignItems: 'center',
		padding: 24
	},
	gridItemCentered: {
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`,
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		fontWeight: 600,
		borderRadius: 16,
		padding: 16,
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center'
	},
	gridResponsive800Width: {
		[`@media (min-width: ${theme.breakpoints.sm}px)`]: {
			width: 800
		},
		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			maxWidth: 800,
			marginLeft: 16,
			marginRight: 16
		}
	},
	greyContentBox: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightGrey,
		borderRadius: 16,
		padding: 16
	},
	connectMethodGridItem: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		width: 150,
		height: 100,
		borderRadius: 16,
		boxShadow:
			theme.colorScheme === 'dark'
				? ''
				: '5px 5px 30px rgba(0, 0, 0, 0.1)',
		cursor: 'pointer',
		position: 'relative'
	},
	connectMethodGridItemMobile: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		display: 'flex',
		flexDirection: 'row',
		borderRadius: 32,
		padding: 8,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`,
		cursor: 'pointer',
		alignItems: 'center'
	},
	connectMethodGridItemContent: {
		paddingTop: 20,
		alignItems: 'center',
		textAlign: 'center'
	},
	gridItemFlat: {
		cursor: 'pointer',
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`,
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		borderRadius: 8,
		padding: 16
	},
	gridItemFlowTemplate: {
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`,
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		borderRadius: 8,
		padding: 16
	},
	gridItemBlue: {
		cursor: 'pointer',
		border: `1px solid ${colorBlue}`,
		alignItems: 'center',
		borderRadius: 8,
		padding: 16
	},
	gridItemFlatSelected: {
		cursor: 'pointer',
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorWhite : colorBlack
		}`,
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		borderRadius: 8,
		padding: 16
	},
	extensionGridItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		fontWeight: 600,
		minHeight: 110,
		marginBottom: 12,
		cursor: 'pointer',
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`,
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		borderRadius: 8,
		padding: 16
	},
	extensionGridItemEnabled: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 12,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`,
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightestGrey,
		borderRadius: 16,
		paddingTop: 16,
		position: 'relative'
	},
	extensionGridItemEnabledHeaderBackground: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorWhite,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 48,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16
	},
	extensionGridItemActions: {
		display: 'flex',
		flexDirection: 'row',
		height: 46
	},
	extensionGridItemAction: {
		cursor: 'pointer',
		display: 'flex',
		flexDirection: 'row',
		padding: 12
	},
	extensionGridItemHeader: {
		fontWeight: 600,
		display: 'flex',
		alignItems: 'center',
		zIndex: 1
	},

	// Page Header
	pageHeader: {
		marginBottom: 32,
		display: 'flex',
		backgroundColor:
			theme.colorScheme === 'dark' ? colorBlack : colorLightestGrey,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey,
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		[`@media (max-width: 1000px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 16,
			paddingTop: 16
		}
	},
	pageHeaderTitleContainer: {},
	pageHeaderImage: {
		marginRight: 32,
		[`@media (max-width: 1000px)`]: {
			marginRight: 16
		}
	},
	pageHeaderExitButton: {
		marginRight: 32,
		marginLeft: 'auto',
		[`@media (max-width: 1000px)`]: {
			display: 'none'
		},
		cursor: 'pointer'
	},
	pageHeaderExtension: {
		marginBottom: 32,
		display: 'flex',
		backgroundColor: colorBlack,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 40,
		borderBottomColor:
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey,
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 40,
		[`@media (max-width: 1000px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 16,
			paddingTop: 16
		}
	},

	// Page Footer
	pageFooterContainer: {},
	pageFooterBackground: {
		backgroundColor: colorBlack,
		width: '100%',
		paddingTop: 8
	},
	pageZeroPaddingMobileContainer: {
		[`@media (max-width: 1000px)`]: {
			padding: 0
		}
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
		border: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorLightGrey
		}`,
		borderRadius: 16,
		padding: 16
	},

	// Agreements Home Columns Layout
	pageResponsiveContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 0,
		[`@media (max-width: 1000px)`]: {
			flexDirection: 'column',
			marginTop: 0
		}
	},
	pageLeftColumn: {
		width: 320,
		paddingRight: 32,
		marginTop: 32,
		[`@media (max-width: 1000px)`]: {
			width: '100%',
			paddingRight: 0
		}
	},
	pageLeftWideColumn: {
		width: 600,
		paddingRight: 32,
		[`@media (max-width: 1000px)`]: {
			width: '100%',
			paddingRight: 0
		}
	},
	pageRightColumn: {
		backgroundColor:
			theme.colorScheme === 'dark' ? 'transparent' : colorLightestGrey
	},

	pageRightColumnInner: {
		width: 680,
		marginTop: 32,
		paddingLeft: 40,
		[`@media (max-width: 1000px)`]: {
			width: '100%'
		}
	},
	pageRightNarrowColumnInner: {
		width: 400,
		paddingLeft: 40,
		[`@media (max-width: 1000px)`]: {
			width: '100%',
			paddingLeft: 0
		}
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
		paddingLeft: 32,
		paddingRight: 32,
		width: '100%',
		maxWidth: 800,
		[`@media (max-width: 1000px)`]: {
			paddingTop: 8
		}
	},
	pagePanelLayoutNavBar: {
		minWidth: 288,
		[`@media (min-width: 1000px)`]: {
			paddingLeft: 32
		},
		[`@media (max-width: 1000px)`]: {
			paddingTop: 24
		}
	},
	pagePanelLayoutNavItem: { borderRadius: 8, marginBottom: 16 },

	// Site header bar
	siteHeader: {
		backgroundColor: theme.colorScheme === 'dark' ? colorBlack : colorWhite,
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? colorDarkGrey : colorGrey
		}`
	},
	siteHeaderLeftItems: {
		marginLeft: 16,
		paddingTop: 2,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	siteHeaderRightItems: {
		paddingTop: 10,
		marginBottom: 4,
		marginRight: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		[`@media (max-width: 1000px)`]: {
			marginRight: 20
		}
	},
	siteHeaderMainLogo: {
		fontSize: 32,
		marginLeft: 16,
		marginRight: 8,
		paddingBottom: 6,
		color: theme.colorScheme === 'dark' ? colorWhite : colorBlack,
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
		color: theme.colorScheme === 'dark' ? colorLightGrey : colorBlack,
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

	// Widgets
	widgetDark: {
		backgroundColor: colorBlack,
		color: 'white',
		position: 'relative',
		padding: 24,
		width: '100%',
		borderRadius: 16,

		marginBottom: 24,
		[`@media (max-width: 1000px)`]: {
			borderRadius: 0,
			boxShadow: '',
			marginBottom: 0
		}
	},
	widgetAsh: {
		borderRadius: 12,
		width: '100%',
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkerGrey : colorAshLight,
		padding: 24,
		marginBottom: 24,
		[`@media (max-width: 1000px)`]: {
			borderRadius: 0,
			boxShadow: 'none',
			marginBottom: 0,
			borderBottom: `8px solid ${
				theme.colorScheme === 'dark' ? colorDarkerGrey : colorLightGrey
			}`
		}
	},
	widgetExtension: {
		boxShadow:
			theme.colorScheme === 'dark'
				? ''
				: '5px 5px 30px rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		width: '100%',
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkerGrey : colorWhite,
		marginBottom: 24,
		[`@media (max-width: 1000px)`]: {
			borderRadius: 0,
			boxShadow: 'none',
			marginBottom: 0,
			borderBottom: `8px solid ${
				theme.colorScheme === 'dark' ? colorDarkerGrey : colorLightGrey
			}`
		}
	},
	widgetLink: {
		boxShadow:
			theme.colorScheme === 'dark'
				? ''
				: '5px 5px 30px rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		width: '100%',
		backgroundColor: theme.colorScheme === 'dark' ? colorBlack : colorWhite,
		padding: 24,
		marginBottom: 24,
		[`@media (max-width: 1000px)`]: {
			marginLeft: 16,
			marginRight: 16,
			marginTop: 16
		}
	},
	widgetMeem: {
		boxShadow:
			theme.colorScheme === 'dark'
				? ''
				: '5px 5px 30px rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		width: '100%',
		background:
			'linear-gradient(117deg, rgba(227,255,191,1) 0%, rgba(229,255,183,0.8477984943977591) 3%, rgba(247,254,113,0.8534007352941176) 31%, rgba(177,220,255,0.8505996148459384) 66%, rgba(133,139,33,0.4724483543417367) 100%)',
		padding: 24,
		marginBottom: 24,
		[`@media (max-width: 1000px)`]: {
			borderRadius: 0,
			boxShadow: 'none',
			marginBottom: 0,
			borderBottom: `8px solid ${
				theme.colorScheme === 'dark' ? colorDarkerGrey : colorLightGrey
			}`
		}
	},
	widgetMeemFlat: {
		width: '100%',
		background:
			'linear-gradient(117deg, rgba(227,255,191,1) 0%, rgba(229,255,183,0.8477984943977591) 3%, rgba(247,254,113,0.8534007352941176) 31%, rgba(177,220,255,0.8505996148459384) 66%, rgba(133,139,33,0.4724483543417367) 100%)',
		padding: 24
	},
	widgetAccordion: {
		paddingLeft: 8,
		paddingRight: 8
	},
	widgetAccordionBackground: {
		backgroundColor:
			theme.colorScheme === 'dark' ? colorDarkerGrey : colorWhite
	},

	// Images
	copyIcon: {
		marginLeft: 4,
		cursor: 'pointer'
	},
	emojiCanvas: {
		position: 'absolute',
		top: 40,
		left: 0,
		marginTop: -12,
		marginBottom: -12,
		lineHeight: 1,
		fontSize: 120,
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
		backgroundColor:
			theme.colorScheme === 'dark' ? colorSiteDarkModeBg : colorWhite,
		zIndex: -1
	},
	imageAgreementLogo: {
		width: 80,
		height: 80,
		[`@media (max-width: 1000px)`]: {
			width: 40,
			height: 40,
			minHeight: 40,
			minWidth: 40
		}
	},
	imageAgreementLogoContainer: {
		marginTop: 32,
		width: 108,
		height: 100,
		position: 'relative'
	},
	imageAgreementLogoDeleteButton: {
		position: 'absolute',
		top: '-12px',
		right: '-105px',
		cursor: 'pointer'
	},
	imagePixelated: {},

	// Misc
	backArrow: {
		cursor: 'pointer',
		paddingTop: 4,
		[`@media (max-width: 1000px)`]: {
			display: 'none'
		}
	},
	backgroundMeem: {
		background:
			'linear-gradient(235deg,hsl(67deg 85% 76%) 0%,hsl(67deg 86% 83%) 14%,hsl(67deg 85% 90%) 29%,hsl(68deg 88% 97%) 43%,hsl(132deg 20% 95%) 57%,hsl(125deg 17% 85%) 71%,hsl(128deg 18% 75%) 86%,hsl(126deg 18% 66%) 100%)'
	},
	backgroundTransparentYellow: {
		backgroundColor: colorTransparentYellow
	},
	badge: {
		paddingLeft: 8,
		paddingRight: 8
	},
	communityLaunchHeader: {
		paddingTop: 24,
		paddingBottom: 24,
		[`@media (max-width: 1000px)`]: {
			paddingTop: 16,
			paddingBottom: 16
		},
		background:
			'linear-gradient(117deg, rgba(227,255,191,1) 0%, rgba(229,255,183,0.8477984943977591) 3%, rgba(247,254,113,0.8534007352941176) 31%, rgba(177,220,255,0.8505996148459384) 66%, rgba(133,139,33,0.4724483543417367) 100%)',
		width: '100%'
	},
	iconDarkThemeToggle: {
		marginTop: -4,
		[`@media (max-width: 1000px)`]: {
			marginRight: 20
		}
	},
	textInputCreate: {
		width: 600,
		[`@media (max-width: 1000px)`]: {
			paddingLeft: 16,
			paddingRight: 16
		}
	},
	unstyledLink: {
		all: 'unset'
	},
	paragraphIntTextInput: {
		paddingLeft: 142
	},

	// Text styles
	tExtraExtraLarge: { fontWeight: 600, fontSize: '32px', lineHeight: 1.4 },
	tExtraLarge: { fontWeight: 600, fontSize: '28px', lineHeight: 1.4 },
	tLargeBold: { fontWeight: 600, fontSize: '22px', lineHeight: 1.4 },
	tLarge: { fontSize: '22px', lineHeight: 1.4 },
	tMediumBold: { fontWeight: 600, fontSize: '18px', lineHeight: 1.4 },
	tMediumBoldFaded: {
		fontSize: 18,
		fontWeight: 600,
		lineHeight: 1.4,
		opacity: 0.6
	},
	tMediumButton: { fontWeight: 500, fontSize: '18px', lineHeight: 1.4 },
	tMediumFaded: { fontWeight: 400, fontSize: '18px', lineHeight: 1.4 },
	tMedium: { fontWeight: 400, fontSize: '18px', lineHeight: 1.4 },
	tSmallBold: { fontWeight: 600, fontSize: '16px', lineHeight: 1.4 },
	tSmallBoldFaded: {
		fontWeight: 600,
		fontSize: '16px',
		lineHeight: 1.4,
		opacity: 0.6
	},
	tSmallFaded: {
		fontSize: '16px',
		opacity: 0.6
	},
	tSmall: { fontWeight: 500, fontSize: '16px', lineHeight: 1.4 },
	tSmallLabel: {
		fontWeight: 600,
		fontSize: '16px',
		lineHeight: 1.4,
		letterSpacing: '0.05em',
		textTransform: 'uppercase'
	},
	tExtraSmallBold: {
		fontSize: '14px',
		lineHeight: 1.4,
		fontWeight: 600
	},
	// Special case for badges
	tExtraSmallBoldBlack: {
		fontSize: '14px',
		lineHeight: 1.4,
		fontWeight: 600,
		color: colorBlack
	},
	tExtraSmallLabel: {
		fontSize: '14px',
		lineHeight: 1.4,
		fontWeight: 600,
		letterSpacing: 1.2,
		opacity: 0.6
	},
	tExtraSmallFaded: {
		fontWeight: 600,
		fontSize: '14px',
		lineHeight: 1.4,
		opacity: 0.6
	},
	tExtraSmall: { fontWeight: 500, fontSize: '14px', lineHeight: 1.4 },
	tExtraExtraSmall: { fontWeight: 500, fontSize: '12px', lineHeight: 1.4 },

	// Text variants
	tBadgeText: {
		fontWeight: 600,
		fontSize: '12px',
		color: theme.colorScheme === 'dark' ? colorWhite : colorBlack
	},
	tBadgeTextSmall: {
		fontWeight: 600,
		fontSize: '10px',
		color: theme.colorScheme === 'dark' ? colorWhite : colorBlack
	},
	tBadgeTextWhite: { fontWeight: 600, fontSize: '12px', color: colorWhite },

	tLink: {
		textDecoration: 'underline',
		cursor: 'pointer',
		color: colorBlue,
		fontWeight: 600
	},
	tLinkified: {
		fontWeight: 500,
		fontSize: '14px',
		lineHeight: 1.4,
		a: {
			textDecoration: 'underline',
			cursor: 'pointer',
			color: colorDarkBlue,
			fontWeight: 600
		}
	},

	tEllipsis: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	}
}))
