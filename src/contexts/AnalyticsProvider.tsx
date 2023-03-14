import { useMeemUser } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { AnalyticsBrowser } from '@segment/analytics-next'
import { NextRouter, useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'

const AnalyticsContext = React.createContext<AnalyticsBrowser | undefined>(
	undefined
)

/**
 * Track events on route changes
 * @param analytics Segment client
 * @param router Next router
 */
function useRouteChangeAnalytics(
	analytics: AnalyticsBrowser,
	router: NextRouter
) {
	const { events } = router

	const onRouteChangeComplete = useCallback(() => {
		analytics.page()
	}, [analytics])

	// Call analytics.page whenever there is a page transition
	useEffect(() => {
		events.on('routeChangeComplete', onRouteChangeComplete)
		return () => {
			events.off('routeChangeComplete', onRouteChangeComplete)
		}
	}, [events, onRouteChangeComplete])
}

/**
 * Identify the current user
 * @param analytics Segment client
 * @param user Any custom user ojbect
 */
function useUserAnalytics(
	analytics: AnalyticsBrowser,
	meemUser?: { id: string }
) {
	// Whenever the user changes call analytics.identify so that all
	// track and page calls will be associated with that user.
	useEffect(() => {
		if (meemUser) {
			// We should only call identify if the user is logged in. For anonymous users
			// this should never be called. Segment will create an anonymous ID for the user
			// and store that in local storage.
			// Calling identify in analytics.js will automatically associate all future track
			// calls with this user. This is not have the node client works.
			analytics.identify(meemUser.id)
		}
	}, [analytics, meemUser])
}

type AnalyticsProviderProps = {
	writeKey: string
	children: React.ReactNode
}

export const AnalyticsProvider = ({
	children,
	writeKey
}: AnalyticsProviderProps) => {
	const analytics = React.useMemo(
		() => AnalyticsBrowser.load({ writeKey }),
		[writeKey]
	)

	const router = useRouter()
	const meemUser = useMeemUser()

	useRouteChangeAnalytics(analytics, router)
	useUserAnalytics(analytics, meemUser.user)

	useEffect(() => {
		// Capture initial page load
		analytics.page()
	}, [analytics])

	return (
		<AnalyticsContext.Provider value={analytics}>
			{children}
		</AnalyticsContext.Provider>
	)
}

export const useAnalytics = () => {
	const result = React.useContext(AnalyticsContext)
	if (!result) {
		throw new Error('Context used outside of its Provider!')
	}
	return result
}
