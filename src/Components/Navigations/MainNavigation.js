import React from 'react'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'
import Login from '../Screens/Login'
import ChatList from '../Screens/ChatList'
import Chat from '../Screens/Chat'
import Register from '../Screens/Register'

const AppNavigator = createStackNavigator(
	{
		ChatList,
		Chat,
	},
	{
		transitionConfig: () => fromRight(),
	}
)

const AuthNavigator = createStackNavigator(
	{
		Login,
		Register,
		ChatList: {
			screen: AppNavigator,
		},
	},
	{
		headerMode: 'none',
		initialRouteName: 'Register',
		transitionConfig: () => fromRight(),
	}
)

export default createAppContainer(AuthNavigator)
