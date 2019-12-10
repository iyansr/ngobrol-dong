import React, { Component } from 'react'
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

class Chat extends Component {
	state = {
		chatTo: this.props.navigation.getParam('item'),
		user: {},
		messageList: [],
		message: '',
	}

	componentDidMount = async () => {
		const userId = await AsyncStorage.getItem('userId')
		const userName = await AsyncStorage.getItem('user.name')
		const userAvatar = await AsyncStorage.getItem('user.avatar')
		this.setState({
			user: {
				userId,
				userName,
				userAvatar,
			},
		})

		Database.ref('/messages')
			.child(userId)
			.child(this.state.chatTo.id)
			.on('child_added', value => {
				this.setState(prevState => ({
					messageList: GiftedChat.append(prevState.messageList, value.val()),
				}))
			})
	}

	renderBuble = props => {
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

	onsendMsg = async () => {
		if (this.state.message.length > 0) {
			let msgId = Database.ref('/messages')
				.child(this.state.user.userId)
				.child(this.state.chatTo.id)
				.push().key

			let updates = {}
			let message = {
				_id: msgId,
				text: this.state.message,
				createdAt: firebase.database.ServerValue.TIMESTAMP,
				user: {
					_id: this.state.user.userId,
					name: this.state.user.userName,
					avatar: this.state.user.userAvatar,
				},
			}

			updates[
				`/messages/${this.state.user.userId}/${this.state.chatTo.id}/${msgId}`
			] = message
			updates[
				`/messages/${this.state.chatTo.id}/${this.state.user.userId}/${msgId}`
			] = message

			Database.ref().update(updates)
			this.setState({ message: '' })
		}
	}

	renderSend = props => {
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

	render() {
		console.log(this.state.messageList)
		const userName = this.props.navigation.getParam('item')
		console.log(userName)
		return (
			<>
				<CustomHeader
					headerTitle={userName.name}
					showLeft={true}
					showRight={true}
					rightItem={
						<Image
							style={{ height: 40, width: 40, borderRadius: 20 }}
							source={{ uri: userName.avatar }}
						/>
					}
					leftPressed={() => this.props.navigation.goBack()}
				/>
				{/* <View>
					<Text>ChatRoom</Text>
				</View> */}
				<GiftedChat
					renderBubble={this.renderBuble}
					renderSend={this.renderSend}
					text={this.state.message}
					onInputTextChanged={val => this.setState({ message: val })}
					messages={this.state.messageList}
					onSend={() => this.onsendMsg()}
					user={{
						_id: this.state.user.userId,
					}}
				/>
			</>
		)
	}

	static navigationOptions = ({ navigation }) => {
		const userName = navigation.getParam('item')
		console.log(userName)
		return {
			header: null,
		}
	}
}

export default Chat
