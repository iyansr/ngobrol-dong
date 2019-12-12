import React from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import storage from '../../Configs/Storage'

const Profile = ({ navigation }) => {
	return (
		<View>
			<Text
				onPress={async () => {
					try {
						await AsyncStorage.clear()
						navigation.replace('Login')
					} catch (error) {
						console.log(error)
					}
				}}>
				LOG OUT
			</Text>
		</View>
	)
}

export default Profile
