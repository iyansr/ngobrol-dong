import React from 'react'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'
import Login from '../Screens/Login'
import ChatList from '../Screens/ChatList'
import Chat from '../Screens/Chat'
import Register from '../Screens/Register'
import SplashScreen from '../Screens/SplashScreen'
import MapView from '../Screens/MapView'

const AppNavigator = createStackNavigator(
	{
		ChatList,
		Chat,
		MapView,
	},
	{
		transitionConfig: () => fromRight(),
	}
)

const AuthNavigator = createStackNavigator(
	{
		SplashScreen,
		Login,
		Register,
		ChatList: {
			screen: AppNavigator,
		},
	},
	{
		headerMode: 'none',
		initialRouteName: 'SplashScreen',
		transitionConfig: () => fromRight(),
	}
)

export default createAppContainer(AuthNavigator)
