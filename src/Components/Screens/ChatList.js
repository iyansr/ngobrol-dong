import React, { Component } from 'react'
import { View, Dimensions, ToastAndroid } from 'react-native'

import CustomHeader from '../Layouts/Header'
import { colors } from '../../Theme/colors'
import ChatListItem from '../Layouts/ChatListItem'
import storage from '../../Configs/Storage'
import AsyncStorage from '@react-native-community/async-storage'
import { Database } from '../../Configs/Firebase'

class ChatList extends Component {
	state = {
		name: '',
		userList: [],
		refreshing: true,
		userId: null,
	}

	componentDidMount = async () => {
		try {
			const data = await AsyncStorage.getItem('@user')
			const usr = JSON.parse(data)
			console.log('USER IN CHAT LIST', data)
			this.setState({
				name: usr.name,
				userId: usr.id,
			})
			Database.ref('/user').on('child_added', value => {
				let person = value.val()
				if (person.id !== this.state.userId) {
					this.setState(prev => ({
						userList: [...prev.userList, person],
						refreshing: false,
					}))
				}
			})
		} catch (error) {
			ToastAndroid.show(error.message, ToastAndroid.LONG)
			console.log(error.message)
		}
	}

	render() {
		return (
			<>
				<CustomHeader headerTitle={`Hi, ${this.state.name}`} />
				<View
					style={{
						backgroundColor: colors.white,
						height: Dimensions.get('window').height,
					}}>
					<ChatListItem
						userList={this.state.userList}
						refreshing={this.state.refreshing}
						changePage={item =>
							this.props.navigation.navigate('Chat', { item })
						}
					/>
				</View>
			</>
		)
	}
}

export default ChatList
