import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	ToastAndroid,
} from 'react-native'
import CustomHeader from '../Layouts/Header'
const Chat = () => {
	return (
		<View>
			<Text>ChatRoom</Text>
		</View>
	)
}

Chat.navigationOptions = ({ navigation }) => ({
	header: (
		<CustomHeader
			headerTitle='Chat'
			showLeft={true}
			showRight={true}
			leftPressed={() => navigation.goBack()}
		/>
	),
})

export default Chat
