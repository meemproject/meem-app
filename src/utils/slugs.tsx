// Convenience functions for getting slugs from the URL path for components

export const getClubSlug = (): string => {
	const fullUrl = window.location.href
	const split = fullUrl.split('/')
	return split[3]
}
