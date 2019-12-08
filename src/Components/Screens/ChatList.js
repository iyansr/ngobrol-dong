import React from 'react'
import {
	View,
	// Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	ToastAndroid,
} from 'react-native'
import {
	Container,
	Header,
	Content,
	List,
	ListItem,
	Left,
	Body,
	Right,
	Thumbnail,
	Text,
	Button,
} from 'native-base'
import CustomHeader from '../Layouts/Header'
import { colors } from '../../Theme/colors'
const ChatList = ({ navigation }) => {
	const ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	return (
		<View style={{ backgroundColor: colors.whiteChoco }}>
			<ScrollView
				contentContainerStyle={{ marginVertical: 10 }}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}>
				{ar.map((_, id) => {
					return (
						<ListItem
							avatar
							key={id}
							style={styles.listItem}
							onPress={() => navigation.navigate('Chat')}>
							<Left>
								<Button transparent onPress={() => alert('Image')}>
									<Thumbnail
										source={{
											uri:
												'https://i.pinimg.com/originals/a6/e6/dc/a6e6dc0280edc6f5dabadd3b4eb0787a.jpg',
										}}
									/>
								</Button>
							</Left>
							<Body>
								<Text>Kumar Pratik</Text>
								<Text note>
									Doing what you like will always keep you happy . .
								</Text>
							</Body>
							<Right>
								<Text note>3:43 pm</Text>
							</Right>
						</ListItem>
					)
				})}
			</ScrollView>
		</View>
	)
}

ChatList.navigationOptions = () => ({
	header: <CustomHeader headerTitle='Chat Room' />,
})

const styles = StyleSheet.create({
	listItem: {
		backgroundColor: colors.white,
		// marginVertical: 5,
		paddingHorizontal: 15,
		marginRight: 10,
		marginLeft: 10,
		// elevation: 5,
		// borderRadius: 5,
	},
})

export default ChatList
