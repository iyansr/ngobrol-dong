import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import MainNavigation from './src/Components/Navigations/MainNavigation'
import { colors } from './src/Theme/colors'

class App extends Component {
	render() {
		console.ignoredYellowBox = true
		return (
			<>
				<StatusBar backgroundColor={colors.purple} />
				<MainNavigation />
			</>
		)
	}
}

export default App
