import React from 'react'

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { fromRight } from 'react-navigation-transitions'
import Login from '../Screens/Login'
import ChatList from '../Screens/ChatList'
import Chat from '../Screens/Chat'
import Register from '../Screens/Register'
import SplashScreen from '../Screens/SplashScreen'
import MapView from '../Screens/MapView'
import Profile from '../Screens/Profile'
import { Icon } from 'native-base'
import { colors } from '../../Theme/colors'

const AppNavigator = createStackNavigator(
	{
		ChatList,
		Chat,
	},
	{
		headerMode: 'none',
		transitionConfig: () => fromRight(),
	}
)

const MainNavigation = createBottomTabNavigator(
	{
		App: {
			screen: AppNavigator,
			navigationOptions: {
				tabBarLabel: 'Chat',
				tabBarIcon: ({ tintColor }) => (
					<Icon
						type='FontAwesome5'
						name='comments'
						style={{ color: tintColor, fontSize: 23 }}
					/>
				),
			},
		},
		MapView: {
			screen: MapView,
			navigationOptions: {
				tabBarLabel: 'Map',
				tabBarIcon: ({ tintColor }) => (
					<Icon
						type='FontAwesome5'
						name='map'
						style={{ color: tintColor, fontSize: 23 }}
					/>
				),
			},
		},
		Profile: {
			screen: Profile,
			navigationOptions: {
				tabBarLabel: 'Profile',
				tabBarIcon: ({ tintColor }) => (
					<Icon
						type='FontAwesome5'
						name='user'
						style={{ color: tintColor, fontSize: 23 }}
					/>
				),
			},
		},
	},

	{
		tabBarOptions: {
			activeTintColor: colors.litBlue,
			inactiveTintColor: colors.grey,
			style: {
				backgroundColor: 'white',
				borderTopWidth: 0,
				shadowOffset: { width: 5, height: 3 },
				shadowColor: 'black',
				shadowOpacity: 0.5,
				elevation: 5,
			},
		},
	}
)

const AuthNavigator = createStackNavigator(
	{
		SplashScreen,
		Login,
		Register,
		ChatList: {
			screen: MainNavigation,
		},
	},
	{
		headerMode: 'none',
		initialRouteName: 'SplashScreen',
		transitionConfig: () => fromRight(),
	}
)

export default createAppContainer(AuthNavigator)
