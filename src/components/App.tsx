import React from 'react'

export interface IProps {
	children: React.ReactNode
}

export const App: React.FC<IProps> = ({ children }) => {
	return <>{children}</>
}
