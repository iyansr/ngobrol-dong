import React, { Component, useState, useEffect } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	ToastAndroid,
	Image,
} from 'react-native'
import CustomHeader from '../Layouts/Header'
import { GiftedChat, Bubble, Composer, Send } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage'
import { Database } from '../../Configs/Firebase'
import { colors } from '../../Theme/colors'
import { Icon } from 'native-base'
import firebase from 'firebase'
import storage from '../../Configs/Storage'

// class Chat extends Component {
const Chat = ({ navigation }) => {
	// state = {
	// 	chatTo: this.props.navigation.getParam('item'),
	// 	user: {},
	// 	messageList: [],
	// 	message: '',
	// }
	const chatTo = navigation.getParam('item')
	const [user, setUser] = useState({})
	const [messageList, setMessageList] = useState([])
	const [message, setmessage] = useState('')

	const getUser = () => {
		storage
			.load({
				key: 'USER',
				autoSync: true,
				syncInBackground: true,
			})
			.then(data => {
				console.log(data)
				setUser(data)
				Database.ref('/messages')
					.child(data.id)
					.child(chatTo.id)
					.on('child_added', value => {
						setMessageList(prev => GiftedChat.append(prev, value.val()))
					})
			})
			.catch(err => {
				ToastAndroid.show(err.message, ToastAndroid.LONG)
				console.log(err.message)
			})
		// 	AsyncStorage.getItem('USER')
		// 		.then(u => {
		// 			const thisUser = JSON.parse(u)
		// 			setUser(thisUser)
		// 			Database.ref('/messages')
		// 				.child(thisUser.id)
		// 				.child(chatTo.id)
		// 				.on('child_added', value => {
		// 					setMessageList(prev => GiftedChat.append(prev, value.val()))
		// 				})
		// 		})
		// 		.catch(error => {
		// 			ToastAndroid.show(error.message, ToastAndroid.LONG)
		// 		})
		// }
		// 		.child(thisUser.id)
		// 		.child(chatTo.id)
		// 		.on('child_added', value => {
		// 			setMessageList(prev => GiftedChat.append(prev, value.val()))
		// 		})
		// 	const thisUser = JSON.parse(data)
		// 	setUser(thisUser)
		// 	Database.ref('/messages')
		// 		.child(thisUser.id)
		// 		.child(chatTo.id)
		// 		.on('child_added', value => {
		// 			setMessageList(prev => GiftedChat.append(prev, value.val()))
		// 		})
		// } catch (error) {
		// 	ToastAndroid.show(error.message, ToastAndroid.LONG)
	}

	useEffect(() => {
		// AsyncStorage.getItem('USER')
		// 	.then(u => {
		// 		const USER = JSON.parse(u)
		// 		setUser(USER)
		// 		Database.ref('/messages')
		// 			.child(USER.id)
		// 			.child(chatTo.id)
		// 			.on('child_added', value => {
		// 				setMessageList(prev => GiftedChat.append(prev, value.val()))
		// 			})
		// 	})
		// 	.catch(e => ToastAndroid.show(e.message, ToastAndroid.LONG))
		// getUser()
		getUser()
	}, [])

	const renderBuble = props => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: colors.litBlue,
						borderTopLeftRadius: 7,
						borderTopRightRadius: 7,
						borderBottomRightRadius: 7,
						borderBottomLeftRadius: 0,
					},
					left: {
						borderTopLeftRadius: 7,
						borderTopRightRadius: 7,
						borderBottomRightRadius: 7,
						borderBottomLeftRadius: 0,
					},
				}}
			/>
		)
	}

	const onsendMsg = () => {
		// AsyncStorage.getItem('USER')
		// 	.then(u => {
		// 		const USER = JSON.parse(u)
		// 		setUser(USER)
		// 		// Database.ref('/messages')
		// 		// 	.child(USER.id)
		// 		// 	.child(chatTo.id)
		// 		// 	.on('child_added', value => {
		// 		// 		setMessageList(prev => GiftedChat.append(prev, value.val()))
		// 		// 	})
		if (message.length > 0) {
			let msgId = Database.ref('/messages')
				.child(user.id)
				.child(chatTo.id)
				.push().key

			let updates = {}
			let Message = {
				_id: msgId,
				text: message,
				createdAt: firebase.database.ServerValue.TIMESTAMP,
				user: {
					_id: user.id,
					name: user.name,
					avatar: user.avatar,
				},
			}

			updates[`/messages/${user.id}/${chatTo.id}/${msgId}`] = Message
			updates[`/messages/${chatTo.id}/${user.id}/${msgId}`] = Message

			Database.ref().update(updates)
			// this.setState({ message: '' })
			setmessage('')
		}
		// })
		// .catch(e => ToastAndroid.show(e.message, ToastAndroid.LONG))
	}

	const renderSend = props => {
		return (
			<Send {...props}>
				<View
					style={{
						width: 54,
						height: 44,
						borderTopLeftRadius: 25,
						borderBottomLeftRadius: 25,
						marginBottom: 0,
						marginHorizontal: 5,
						backgroundColor: '#694be2',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Icon name={'ios-send'} size={28} color={'white'} />
				</View>
			</Send>
		)
	}

	// render() {
	// console.log(messageList)
	// const userName = this.props.navigation.getParam('item')
	// console.log(userName)
	return (
		<>
			<CustomHeader
				headerTitle={chatTo.name}
				showLeft={true}
				showRight={true}
				rightItem={
					<Image
						style={{ height: 40, width: 40, borderRadius: 20 }}
						source={{ uri: chatTo.avatar }}
					/>
				}
				leftPressed={() => navigation.goBack()}
			/>
			{/* <View>
					<Text>ChatRoom</Text>
				</View> */}
			<GiftedChat
				renderBubble={renderBuble}
				renderSend={renderSend}
				text={message}
				onInputTextChanged={val => setmessage(val)}
				messages={messageList}
				onSend={onsendMsg}
				user={{
					_id: user.id,
				}}
			/>
		</>
	)
}

// static navigationOptions = ({ navigation }) => {
// 	const userName = navigation.getParam('item')
// 	console.log(userName)
// 	return {
// 		header: null,
// }
// }
// }

export default Chat
