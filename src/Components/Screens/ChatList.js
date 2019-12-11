import React, { useEffect, useState } from 'react'
import { View, Dimensions, ToastAndroid, AsyncStorage } from 'react-native'

import CustomHeader from '../Layouts/Header'
import { colors } from '../../Theme/colors'
import ChatListItem from '../Layouts/ChatListItem'
import storage from '../../Configs/Storage'
// import AsyncStorage from '@react-native-community/async-storage'

const ChatList = ({ navigation }) => {
	const [name, setName] = useState('')

	const setUserName = async () => {
		// AsyncStorage.getItem('USER')
		// 	.then(u => {
		// 		const user = JSON.parse(u)
		// 		console.log('USER IN CHAT LIST', user)
		// 		setName(user.name)
		// 	})
		// 	.catch(error => {
		// 		ToastAndroid.show(error.message, ToastAndroid.LONG)
		// 	})
		// storage
		// 	.load({
		// 		key: 'USER',
		// 		autoSync: true,
		// 		syncInBackground: true,
		// 	})
		// 	.then(data => {
		// 		console.log('USER IN CHAT LIST', data)
		// 		setName(data.name)
		// 	})
		// 	.catch(err => {
		// 		ToastAndroid.show(err.message, ToastAndroid.LONG)
		// 		console.log(err.message)
		// 	})
		try {
			const data = await storage.load({
				key: 'USER',
				autoSync: true,
				syncInBackground: true,
			})
			console.log('USER IN CHAT LIST', data)
			setName(data.name)
		} catch (error) {
			ToastAndroid.show(err.message, ToastAndroid.LONG)
			console.log(err.message)
		}
	}

	useEffect(() => {
		storage
			.load({
				key: 'USER',
				autoSync: true,
				syncInBackground: true,
			})
			.then(data => {
				console.log('USER IN CHAT LIST', data)
				setName(data.name)
			})
			.catch(error => {
				ToastAndroid.show(error.message, ToastAndroid.LONG)
				console.log(error.message)
			})
		return () => {
			setName('')
		}
	}, [])

	return (
		<>
			<CustomHeader headerTitle={`Hi, ${name.split(' ')[0]}`} />
			<View
				style={{
					backgroundColor: colors.white,
					height: Dimensions.get('window').height,
				}}>
				<ChatListItem
					changePage={item => navigation.navigate('Chat', { item })}
				/>
			</View>
		</>
	)
}

// ChatList.navigationOptions = () => ({
// 	header: ,
// })

export default ChatList
