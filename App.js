import React from 'react'
import { StatusBar } from 'react-native'
import MainNavigation from './src/Components/Navigations/MainNavigation'
import { colors } from './src/Theme/colors'

const App = () => {
	return (
		<>
			<StatusBar backgroundColor={colors.purple} />
			<MainNavigation />
		</>
	)
}

export default App
