import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	ToastAndroid,
} from 'react-native'
import { PoppinsBold, PoppinsRegular } from '../../Theme/fonts'
import { colors } from '../../Theme/colors'
import { Input, Form, Label, Item, Button } from 'native-base'

const Login = ({ navigation }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const onSubmit = () => {
		if (email === '' && password === '') {
			setError({
				email: 'Email Cannot Empty',
				password: 'Password Cannot Empty',
			})
		} else if (password === '') {
			setError({ password: 'Password Cannot Empty' })
		} else if (password.length < 6) {
			setError({ password: 'Password Should Greater Than 6' })
		} else {
			ToastAndroid.show('Succes', ToastAndroid.SHORT)
			navigation.navigate('ChatList')
			console.log(email)
		}
	}

	const onClear = () => {
		setError(null)
		setEmail('')
		setPassword('')
	}

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.container}>
				<Text style={styles.bigText}>Welcome Back,</Text>
				<Text style={styles.smallText}>Sign in to continue</Text>
				<Form style={{ marginTop: 20 }}>
					<Item floatingLabel style={{ marginLeft: 0 }}>
						<Label style={styles.label}>Email</Label>
						<Input
							selectionColor={colors.purple}
							style={styles.input}
							value={email}
							keyboardType='email-address'
							onChangeText={val => setEmail(val.toLowerCase())}
						/>
					</Item>
					{error && <Text style={styles.errorMsg}>{error.email}</Text>}
					<Item floatingLabel style={{ marginLeft: 0 }}>
						<Label style={styles.label}>Password</Label>
						<Input
							selectionColor={colors.purple}
							style={styles.input}
							value={password}
							secureTextEntry={true}
							onChangeText={val => setPassword(val)}
						/>
					</Item>
					{error && <Text style={styles.errorMsg}>{error.password}</Text>}
					<View style={styles.clearContainer}>
						<Text style={styles.clear} onPress={onClear}>
							Clear
						</Text>
					</View>
				</Form>
				{!loading ? (
					<Button style={styles.button} onPress={onSubmit}>
						<Text style={styles.btnText}>Sign In</Text>
					</Button>
				) : (
					<Button disabled={true} style={styles.buttonLoading}>
						<Text style={styles.btnText}>Sign In</Text>
					</Button>
				)}
			</View>
		</ScrollView>
	)
}

Login.navigationOptions = () => ({
	header: null,
})

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
	container: {
		paddingVertical: 70,
		paddingHorizontal: 30,
		backgroundColor: colors.white,
		width,
		height,
		alignContent: 'center',
		justifyContent: 'center',
	},
	clearContainer: {
		width: '100%',
		height: 20,
		flexDirection: 'row-reverse',
		marginTop: 10,
	},
	clear: {
		textDecorationLine: 'underline',
		fontFamily: PoppinsRegular,
		color: colors.grey,
		fontSize: 13,
	},
	button: {
		height: 40,
		width: 300,
		backgroundColor: colors.purple,
		marginTop: 20,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		elevation: 10,
	},
	buttonLoading: {
		height: 40,
		width: 300,
		backgroundColor: colors.grey,
		marginTop: 20,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		elevation: 0,
	},
	btnText: {
		fontFamily: PoppinsBold,
		color: colors.whiteChoco,
	},
	errorMsg: {
		color: 'red',
		fontFamily: PoppinsRegular,
		fontSize: 13,
	},
	label: {
		fontFamily: PoppinsRegular,
		color: colors.grey,
	},
	input: {
		width: null,
		fontSize: 16,
		color: colors.black,
		fontFamily: PoppinsRegular,
	},
	bigText: {
		fontFamily: PoppinsBold,
		color: colors.black,
		fontSize: 28,
	},
	smallText: {
		fontSize: 20,
		fontFamily: PoppinsRegular,
		color: colors.grey,
	},
})
export default Login
