import React from 'react'
import { StatusBar } from 'react-native'
import MainNavigation from './src/Components/Navigations/MainNavigation'
import { colors } from './src/Theme/colors'

const App = () => {
	console.ignoredYellowBox = true
	return (
		<>
			<StatusBar backgroundColor={colors.litBlue} />
			<MainNavigation />
		</>
	)
}

export default App
