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
import { Auth, Database } from '../../Configs/Firebase'
import AsyncStorage from '@react-native-community/async-storage'
import storage from '../../Configs/Storage'

class Register extends Component {
	// const [email, setEmail] = useState('')
	// const [name, setName] = useState('')
	// const [password, setPassword] = useState('')
	// const [password2, setPassword2] = useState('')
	// const [loading, setLoading] = useState(false)
	// const [error, setError] = useState(null)

	state = {
		email: '',
		name: '',
		password: '',
		password2: '',
		loading: false,
		error: null,
	}

	onSubmit = async () => {
		const { email, name, password, password2, loading, error } = this.state
		const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
		if (email === '' && password === '' && password2 === '' && name === '') {
			this.setState({
				error: {
					name: 'Name Cannot Empty',
					email: 'Email Cannot Empty',
					password: 'Password Cannot Empty',
					password2: 'Password Cannot Empty',
				},
			})
		} else if (!pattern.test(email)) {
			this.setState({
				error: {
					name: 'Invalid Email Format',
				},
			})
		} else if (password === '') {
			this.setState({
				error: {
					password: 'Password Cannot Empty',
				},
			})
		} else if (password.length < 6) {
			this.setState({
				error: {
					password: 'Password should be atleast 6 characters',
				},
			})
		} else if (password2 !== password) {
			this.setState({
				error: {
					password2: 'Password must match',
				},
			})
		} else {
			try {
				this.setState({
					loading: true,
				})
				const response = await Auth.createUserWithEmailAndPassword(
					email,
					password
				)

				Auth.currentUser.updateProfile({
					displayName: name,
					photoURL:
						'https://res.cloudinary.com/iyansrcloud/image/upload/v1575295609/upload/genre-icon/comedy_io7bh2.png',
				})

				await Database.ref(`/user/${response.user.uid}`).set({
					id: response.user.uid,
					name,
					status: 'Online',
					email,
					avatar:
						'https://res.cloudinary.com/iyansrcloud/image/upload/v1575295609/upload/genre-icon/comedy_io7bh2.png',
				})

				await Database.ref('user/')
					.orderByChild('email/')
					.equalTo(email)
					.once('value', async result => {
						let data = result.val()
						if (data !== null) {
							let user = Object.values(data)
							await AsyncStorage.setItem(
								'@user',
								JSON.stringify({
									id: response.user.uid,
									email: user[0].email,
									name: user[0].name,
									avatar: user[0].avatar,
								})
							)
						}
					})
				ToastAndroid.show(
					'Your account is successfully registered!',
					ToastAndroid.LONG
				)
				Auth.signInWithEmailAndPassword(email, password)
				this.props.navigation.replace('ChatList')
				this.setState({
					loading: false,
					error: null,
				})
			} catch (error) {
				ToastAndroid.show(error.message, ToastAndroid.LONG)
				this.setState({
					loading: false,
					error: null,
				})
				console.log(error)
			}
		}
	}

	onClear = () => {
		this.setState({
			email: '',
			name: '',
			password: '',
			password2: '',
			loading: false,
			error: null,
		})
	}

	static navigationOptions = () => ({
		header: null,
	})

	render() {
		const { email, name, password, password2, loading, error } = this.state
		return (
			<>
				<StatusBar backgroundColor={colors.white} barStyle='dark-content' />
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.container}>
						<Text style={styles.bigText}>Hello There,</Text>
						<Text style={styles.smallText}>Sign up to continue</Text>
						<Form style={{ marginTop: 20 }}>
							<Item floatingLabel style={{ marginLeft: 0 }}>
								<Label style={styles.label}>Name</Label>
								<Input
									selectionColor={colors.purple}
									style={styles.input}
									value={name}
									keyboardType='email-address'
									onChangeText={val => this.setState({ name: val })}
								/>
							</Item>
							{error && <Text style={styles.errorMsg}>{error.name}</Text>}

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

							<Item floatingLabel style={{ marginLeft: 0 }}>
								<Label style={styles.label}>Confirm Password</Label>
								<Input
									selectionColor={colors.purple}
									style={styles.input}
									value={password2}
									secureTextEntry={true}
									onChangeText={val => this.setState({ password2: val })}
								/>
							</Item>
							{error && <Text style={styles.errorMsg}>{error.password2}</Text>}

							<View style={styles.clearContainer}>
								<Text style={styles.clear} onPress={this.onClear}>
									Clear
								</Text>
							</View>
						</Form>
						{!loading ? (
							<Button style={styles.button} onPress={this.onSubmit}>
								<Text style={styles.btnText}>Sign Up</Text>
							</Button>
						) : (
							<Button disabled={true} style={styles.buttonLoading}>
								<ActivityIndicator size='small' color={colors.white} />
								<Text style={[styles.btnText, { marginLeft: 5 }]}>
									Signing you up
								</Text>
							</Button>
						)}
						<View style={styles.textBelow}>
							<Text style={[styles.clear, { textDecorationLine: 'none' }]}>
								Already Have Account?
							</Text>
							<Text
								style={[styles.clear, { color: colors.litBlue }]}
								onPress={() => this.props.navigation.replace('Login')}>
								Login
							</Text>
						</View>
					</View>
				</ScrollView>
			</>
		)
	}
}

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
	textBelow: {
		width: '100%',
		height: 30,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		marginTop: 20,
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
export default Register
