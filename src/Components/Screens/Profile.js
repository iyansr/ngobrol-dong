import React from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import storage from '../../Configs/Storage'

const Profile = ({ navigation }) => {
	return (
		<View>
			<Text
				onPress={async () => {
					await AsyncStorage.clear()
					storage.remove({ key: 'USER' }).then(() => {
						navigation.replace('Login')
					})
					// navigation.replace('Login')
				}}>
				LOG OUT
			</Text>
		</View>
	)
}

export default Profile
