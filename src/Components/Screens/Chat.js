import React, { Component, useState, useEffect } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	ToastAndroid,
	TouchableOpacity,
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
import { PoppinsRegular } from '../../Theme/fonts'

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
					this.setState(prev => ({
						messageList: GiftedChat.append(prev.messageList, value.val()),
					}))
				})
		} catch (error) {
			ToastAndroid.show(error.message, ToastAndroid.LONG)
		}
	}

	renderBuble = props => {
		return (
			<Bubble
				{...props}
				textStyle={{
					right: {
						fontFamily: PoppinsRegular,
					},
					left: {
						fontFamily: PoppinsRegular,
					},
				}}
				wrapperStyle={{
					right: {
						backgroundColor: colors.darkBlue,
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
						// borderTopLeftRadius: 25,
						// borderBottomLeftRadius: 25,
						marginBottom: 0,
						// marginHorizontal: 5,
						backgroundColor: colors.litBlue,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Icon
						type='FontAwesome5'
						name='fighter-jet'
						style={{ color: colors.white }}
					/>
				</View>
			</Send>
		)
	}
	render() {
		return (
			<>
				<CustomHeader
					headerTitle={this.state.chatTo.name}
					showLeft={true}
					showRight={true}
					showSubtitle={true}
					subtitle={this.state.chatTo.status}
					rightItem={
						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate('FriendsProfile', {
									user: this.state.chatTo,
								})
							}>
							<Image
								style={{ height: 40, width: 40, borderRadius: 20 }}
								source={{ uri: this.state.chatTo.avatar }}
							/>
						</TouchableOpacity>
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
