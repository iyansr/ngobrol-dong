import React, { Component, useState, useEffect } from 'react'
import {
	View,
	FlatList,
	TouchableOpacity,
	Image,
	StyleSheet,
	ToastAndroid,
	ActivityIndicator,
	RefreshControl,
} from 'react-native'
import { Text } from 'native-base'
import { Database } from '../../Configs/Firebase'
import { colors } from '../../Theme/colors'
import AsyncStorage from '@react-native-community/async-storage'
import storage from '../../Configs/Storage'

class ChatListItem extends Component {
	// state = {
	// 	userList: [],
	// 	refreshing: true,
	// 	userId: null,
	// }

	// componentDidMount = async () => {
	// 	try {
	// 		const data = await AsyncStorage.getItem('@user')
	// 		console.log('USER IN CHATLIST ITEM', data)
	// 		const usr = JSON.parse(data)
	// 		this.setState({
	// 			userId: usr.id,
	// 		})
	// 		Database.ref('/user').on('child_added', value => {
	// 			let person = value.val()
	// 			if (person.id !== this.state.userId) {
	// 				this.setState(prev => ({
	// 					userList: [...prev.userList, person],
	// 					refreshing: false,
	// 				}))
	// 			}
	// 		})
	// 	} catch (error) {
	// 		ToastAndroid.show(error.message, ToastAndroid.LONG)
	// 		console.log(error)
	// 	}
	// }

	// console.log(userId)
	render() {
		return this.props.refreshing ? (
			<ActivityIndicator
				size='large'
				color='#05A0E4'
				style={{ marginTop: 150 }}
			/>
		) : (
			this.props.userList.length > 0 && (
				<FlatList
					keyExtractor={(_, index) => `${index}`}
					data={this.props.userList}
					renderItem={({ item }) => (
						<View>
							<TouchableOpacity onPress={() => this.props.changePage(item)}>
								<View style={styles.row}>
									<Image source={{ uri: item.avatar }} style={styles.pic} />
									<View>
										<View style={styles.nameContainer}>
											<Text
												style={styles.nameTxt}
												numberOfLines={1}
												ellipsizeMode='tail'>
												{item.name}
											</Text>
											{item.status == 'Online' ? (
												<View style={{ flexDirection: 'row', paddingTop: 10 }}>
													<Text style={styles.on}>{item.status}</Text>
												</View>
											) : (
												<View style={{ flexDirection: 'row', paddingTop: 10 }}>
													<Text style={styles.off}>{item.status}</Text>
												</View>
											)}
										</View>
										<View style={styles.msgContainer}>
											<Text style={styles.status}>{item.email}</Text>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					)}
				/>
			)
		)
	}
}

const styles = StyleSheet.create({
	listItem: {
		backgroundColor: colors.white,
		marginVertical: 5,
		marginRight: 10,
		marginLeft: 10,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.white,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#DCDCDC',
		backgroundColor: colors.white,
		borderBottomWidth: 1,
		padding: 10,
		paddingTop: 15,
	},
	pic: {
		borderRadius: 30,
		width: 60,
		height: 60,
	},
	nameContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 80,
	},
	nameTxt: {
		marginLeft: 15,
		fontWeight: '600',
		color: '#222',
		fontSize: 18,
		width: 200,
	},
	status: {
		fontWeight: '200',
		color: '#ccc',
		fontSize: 13,
	},
	on: {
		fontWeight: '200',
		color: 'green',
		fontSize: 13,
		paddingRight: 10,
	},
	off: {
		fontWeight: '200',
		color: '#C0392B',
		fontSize: 13,
		paddingRight: 10,
	},
	msgContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 15,
	},
	email: {
		fontWeight: '400',
		color: '#008B8B',
		fontSize: 12,
		marginLeft: 15,
	},
})

export default ChatListItem
