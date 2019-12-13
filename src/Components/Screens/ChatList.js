import React, { Component } from 'react'
import { View, Dimensions, ToastAndroid, RefreshControl } from 'react-native'

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
		refresh: false,
		userId: null,
	}

	getUser = async () => {
		try {
			const data = await AsyncStorage.getItem('@user')
			const usr = JSON.parse(data)
			this.setState({
				name: usr.name,
				userId: usr.id,
			})
			Database.ref('/user').on('child_added', value => {
				let person = value.val()
				if (person.id !== this.state.userId) {
					this.setState(prev => {
						return {
							userList: [...prev.userList, person],
							refreshing: false,
						}
					})
				}
			})
		} catch (error) {
			ToastAndroid.show(error.message, ToastAndroid.LONG)
			this.setState({ refreshing: false })
			console.log(error.message)
		}
		this.setState({ refreshing: false })
	}

	componentDidMount = async () => {
		await this.getUser()
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
						refreshControl={
							<RefreshControl
								onRefresh={async () => {
									if (this.state.userList.length > 0) {
										this.setState({
											userList: [],
										})
									}
									this.setState({ refresh: true })
									await this.getUser()
									this.setState({ refresh: false })
								}}
								refreshing={this.state.refresh}
							/>
						}
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
