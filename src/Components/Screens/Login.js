import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	ToastAndroid,
	StatusBar,
	ActivityIndicator,
} from 'react-native'
import { PoppinsBold, PoppinsRegular } from '../../Theme/fonts'
import { colors } from '../../Theme/colors'
import { Input, Form, Label, Item, Button } from 'native-base'
import { Database, Auth } from '../../Configs/Firebase'
import AsyncStorage from '@react-native-community/async-storage'
import storage from '../../Configs/Storage'

class Login extends Component {
	// const [email, setEmail] = useState('')
	// const [password, setPassword] = useState('')
	// const [loading, setLoading] = useState(false)
	// const [error, setError] = useState(null)

	state = {
		email: '',
		password: '',
		loading: false,
		error: null,
	}

	onSubmit = async () => {
		const { email, password, loading, error } = this.state

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
			try {
				this.setState({ loading: true })
				const response = await Auth.signInWithEmailAndPassword(email, password)
				Database.ref(`/user/${response.user.uid}`).update({
					status: 'Online',
				})

				Database.ref('user/')
					.orderByChild('/email')
					.equalTo(email)
					.once('value', async result => {
						let data = result.val()
						if (data !== null) {
							let user = Object.values(data)
							try {
								await AsyncStorage.setItem(
									'@user',
									JSON.stringify({
										id: response.user.uid,
										email: user[0].email,
										name: user[0].name,
										avatar: user[0].avatar,
									})
								)
								ToastAndroid.show('Welcome back!', ToastAndroid.LONG)
								this.props.navigation.replace('ChatList')
								this.setState({ loading: false, error: null })
							} catch (error) {
								console.log('ERROR ASYNCSTOREAGE LOGIN', error)
							}
						}
					})
			} catch (error) {
				ToastAndroid.show(error.message, ToastAndroid.LONG)
				this.setState({ loading: false, error: null })
			}
		}
	}

	onClear = () => {
		this.setState({
			email: '',
			password: '',
			loading: false,
			error: null,
		})
	}
	render() {
		const { email, password, loading, error } = this.state
		return (
			<>
				<StatusBar backgroundColor={colors.white} barStyle='dark-content' />
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
									onChangeText={val =>
										this.setState({ email: val.toLowerCase() })
									}
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
									onChangeText={val => this.setState({ password: val })}
								/>
							</Item>
							{error && <Text style={styles.errorMsg}>{error.password}</Text>}
							<View style={styles.clearContainer}>
								<Text style={styles.clear} onPress={this.onClear}>
									Clear
								</Text>
							</View>
						</Form>
						{!loading ? (
							<Button style={styles.button} onPress={this.onSubmit}>
								<Text style={styles.btnText}>Sign In</Text>
							</Button>
						) : (
							<Button disabled={true} style={styles.buttonLoading}>
								<ActivityIndicator size='small' color={colors.white} />
								<Text style={[styles.btnText, { marginLeft: 5 }]}>Sign In</Text>
							</Button>
						)}
						<View style={styles.textBelow}>
							<Text style={[styles.clear, { textDecorationLine: 'none' }]}>
								Don't Have Account?
							</Text>
							<Text
								style={[styles.clear, { color: colors.litBlue }]}
								onPress={() => this.props.navigation.replace('Register')}>
								Register
							</Text>
						</View>
					</View>
				</ScrollView>
			</>
		)
	}
}

Login.navigationOptions = () => ({
	header: null,
})

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
	textBelow: {
		width: '100%',
		height: 30,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
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
		width: '100%',
		backgroundColor: colors.litBlue,
		marginTop: 20,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		elevation: 10,
	},
	buttonLoading: {
		height: 40,
		width: '100%',
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
		color: colors.white,
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
