import React, { useEffect } from 'react'
import {
	View,
	Text,
	StatusBar,
	Dimensions,
	StyleSheet,
	Image,
} from 'react-native'
import { colors } from '../../Theme/colors'
import { PoppinsRegular, PoppinsBold } from '../../Theme/fonts'
import { Auth } from '../../Configs/Firebase'

const SplashScreen = ({ navigation }) => {
	useEffect(() => {
		Auth.onAuthStateChanged(user => {
			if (!user) {
				navigation.replace('Login')
			} else {
				navigation.replace('ChatList')
			}
		})
	}, [])

	return (
		<>
			<StatusBar backgroundColor={colors.litBlue} />
			<View style={styles.container}>
				<Image
					source={require('../../Theme/splashImg.png')}
					style={{ width: 400, height: 400 }}
				/>
				<Text style={{ fontFamily: PoppinsBold, color: colors.white }}>
					v 0.0.1
				</Text>
			</View>
		</>
	)
}

const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.litBlue,
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default SplashScreen
