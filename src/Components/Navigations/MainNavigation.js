import React from 'react'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'
import Login from '../Screens/Login'
import ChatList from '../Screens/ChatList'
import Chat from '../Screens/Chat'

const AuthNavigator = createStackNavigator(
	{
		Login,
		ChatList,
		Chat,
	},
	{
		initialRouteName: 'ChatList',
		transitionConfig: () => fromRight(),
	}
)

export default createAppContainer(AuthNavigator)
