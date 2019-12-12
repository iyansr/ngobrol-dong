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

class Chat extends Component {
	state = {
		chatTo: this.props.navigation.getParam('item'),
		user: {},
		messageList: [],
		message: '',
	}

	componentDidMount = async () => {
		try {
			const data = await AsyncStorage.getItem('@user')
			const usr = JSON.parse(data)
			this.setState({
				user: usr,
			})
			Database.ref('/messages')
				.child(this.state.user.id)
				.child(this.state.chatTo.id)
				.on('child_added', value => {
					// setMessageList(prev => GiftedChat.append(prev, value.val()))
					this.setState(prev => ({
						messageList: GiftedChat.append(prev.messageList, value.val()),
					}))
				})
		} catch (error) {
			ToastAndroid.show(error.message, ToastAndroid.LONG)
			// console.log(err)
		}
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

	onsendMsg = () => {
		if (this.state.message.length > 0) {
			let msgId = Database.ref('/messages')
				.child(this.state.user.id)
				.child(this.state.chatTo.id)
				.push().key

			let updates = {}
			let Message = {
				_id: msgId,
				text: this.state.message,
				createdAt: firebase.database.ServerValue.TIMESTAMP,
				user: {
					_id: this.state.user.id,
					name: this.state.user.name,
					avatar: this.state.user.avatar,
				},
			}

			const { user, chatTo } = this.state

			updates[`/messages/${user.id}/${chatTo.id}/${msgId}`] = Message
			updates[`/messages/${chatTo.id}/${user.id}/${msgId}`] = Message

			Database.ref().update(updates)

			this.setState({
				message: '',
			})
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
		console.log('CHAT TO', this.state.chatTo)

		return (
			<>
				<CustomHeader
					headerTitle={this.state.chatTo.name}
					showLeft={true}
					showRight={true}
					rightItem={
						<Image
							style={{ height: 40, width: 40, borderRadius: 20 }}
							source={{ uri: this.state.chatTo.avatar }}
						/>
					}
					leftPressed={() => this.props.navigation.goBack()}
				/>
				<GiftedChat
					renderBubble={this.renderBuble}
					renderSend={this.renderSend}
					text={this.state.message}
					onInputTextChanged={val => this.setState({ message: val })}
					messages={this.state.messageList}
					onSend={this.onsendMsg}
					user={{
						_id: this.state.user.id,
					}}
				/>
			</>
		)
	}
}
export default Chat
