import React, { Component } from 'react'
import {
	View,
	Text,
	Image,
	Dimensions,
	TouchableHighlight,
	TouchableOpacity,
	ActivityIndicator,
	PermissionsAndroid,
	ToastAndroid,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import storage from '../../Configs/Storage'
import { colors } from '../../Theme/colors'
import { PoppinsBold, PoppinsRegular } from '../../Theme/fonts'
import { Icon, Button } from 'native-base'
import Dialog from 'react-native-dialog'
import { Database, Auth } from '../../Configs/Firebase'
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker'
import firebase from 'firebase'
import CustomHeader from '../Layouts/Header'
import Axios from 'axios'

class Profile extends Component {
	state = {
		dialogVisible: false,
		loadingVisible: false,
		showLogout: false,
		user: {},
		location: '',
	}
	showDialog = () => {
		this.setState({ dialogVisible: true })
	}

	handleCancel = () => {
		this.setState({ dialogVisible: false, loadingVisible: false })
	}

	handleDelete = () => {
		this.setState({ dialogVisible: false, loadingVisible: true })
	}

	componentDidMount = async () => {
		const user = await AsyncStorage.getItem('@user')
		const parsedUser = JSON.parse(user)
		console.log(parsedUser)
		this.setState({ user: parsedUser })

		try {
			const response = await Axios.get(
				`https://us1.locationiq.com/v1/reverse.php?key=d17151587b1e23&lat=${parsedUser.latitude ||
					0}&lon=${parsedUser.longitude || 0}&format=json`
			)

			this.setState({
				location: `${response.data.address.state}`,
			})
		} catch (error) {
			console.log(error)
		}
	}

	editName = async () => {
		try {
			this.setState({ loadingVisible: true, dialogVisible: false })
			await Database.ref(`/user/${this.state.user.id}`).update({
				name: this.state.user.name,
			})
			await Auth.currentUser.updateProfile({
				displayName: this.state.user.name,
			})

			const data = await AsyncStorage.getItem('@user')
			const parsedData = JSON.parse(data)

			const updatedData = {
				...parsedData,
				name: this.state.user.name,
			}

			await AsyncStorage.setItem('@user', JSON.stringify(updatedData))

			this.setState({ loadingVisible: false })
		} catch (error) {
			console.log(error.message)
			this.setState({ loadingVisible: false })
		}
	}

	loadingDialog() {
		return (
			<Dialog.Container visible={this.state.loadingVisible}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: 15,
					}}>
					<ActivityIndicator size='large' color={colors.litBlue} />
					<Text style={{ fontFamily: PoppinsRegular, marginLeft: 20 }}>
						Loading..
					</Text>
				</View>
			</Dialog.Container>
		)
	}
	editDialog() {
		return (
			<Dialog.Container visible={this.state.dialogVisible}>
				<Dialog.Title style={{ fontFamily: PoppinsBold }}>
					Edit Name
				</Dialog.Title>

				<Dialog.Input
					onChangeText={val =>
						this.setState(prev => ({ user: { ...prev.user, name: val } }))
					}
					style={{ borderBottomWidth: 0.3, fontFamily: PoppinsRegular }}
					value={this.state.user.name}
				/>
				<Dialog.Button
					label='Cancel'
					onPress={this.handleCancel}
					style={{ color: colors.litBlue, fontFamily: PoppinsRegular }}
				/>
				<Dialog.Button
					label='Edit'
					onPress={this.editName}
					style={{ color: colors.litBlue, fontFamily: PoppinsRegular }}
				/>
			</Dialog.Container>
		)
	}

	requestCameraPermission = async () => {
		try {
			const granted = await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.CAMERA,
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			])
			return granted === PermissionsAndroid.RESULTS.GRANTED
		} catch (err) {
			console.log(err)
			return false
		}
	}

	changeImage = async type => {
		const Blob = RNFetchBlob.polyfill.Blob
		const fs = RNFetchBlob.fs
		window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
		window.Blob = Blob

		const options = {
			title: 'Select Avatar',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
			mediaType: 'photo',
		}

		let cameraPermission =
			(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
			PermissionsAndroid.check(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
			) &&
			PermissionsAndroid.check(
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
			)
		if (!cameraPermission) {
			console.log('camera')
			cameraPermission = await this.requestCameraPermission()
		} else {
			console.log('image')
			ImagePicker.showImagePicker(options, response => {
				this.setState({ loadingVisible: true })
				let uploadBob = null
				const imageRef = firebase
					.storage()
					.ref('avatar/' + this.state.user.id)
					.child('avatar')
				fs.readFile(response.path, 'base64')
					.then(data => {
						return Blob.build(data, { type: `${response.mime};BASE64` })
					})
					.then(blob => {
						uploadBob = blob
						return imageRef.put(blob, { contentType: `${response.mime}` })
					})
					.then(() => {
						uploadBob.close()
						return imageRef.getDownloadURL()
					})
					.then(async url => {
						firebase
							.database()
							.ref('user/' + this.state.user.id)
							.update({ avatar: url })

						const data = await AsyncStorage.getItem('@user')
						const parsedData = JSON.parse(data)

						this.setState(prev => ({ user: { ...prev.user, avatar: url } }))

						const updatedData = {
							...parsedData,
							name: this.state.user.name,
							avatar: url,
						}

						await AsyncStorage.setItem('@user', JSON.stringify(updatedData))
						this.setState({ loadingVisible: false })
					})

					.catch(err => {
						console.log(err)

						this.setState({ loadingVisible: false })
					})
			})
		}
	}

	handleLogOut = async () => {
		//
		await AsyncStorage.clear()

		await Auth.signOut()
		this.setState({ showLogout: false })
		await Database.ref(`/user/${this.state.user.id}`).update({
			status: 'Offline',
		})
		this.props.navigation.replace('SplashScreen')
	}

	dialogLogOut() {
		return (
			<Dialog.Container visible={this.state.showLogout}>
				<Dialog.Title style={{ fontFamily: PoppinsBold }}>
					Confirm Sign Out ?
				</Dialog.Title>

				<Dialog.Description>Are You Sure Want To Sign Out ?</Dialog.Description>

				<Dialog.Button
					label='Cancel'
					onPress={() => this.setState({ showLogout: false })}
					style={{ color: colors.litBlue, fontFamily: PoppinsRegular }}
				/>
				<Dialog.Button
					label='Yes'
					onPress={this.handleLogOut}
					style={{ color: colors.litBlue, fontFamily: PoppinsRegular }}
				/>
			</Dialog.Container>
		)
	}

	render() {
		console.log(this.state.user)
		const { avatar, name, email } = this.state.user
		return (
			<>
				{this.loadingDialog()}
				{this.editDialog()}
				{this.dialogLogOut()}

				<CustomHeader
					headerTitle='Profile'
					showLeft={true}
					showRight={true}
					rightItem={
						<TouchableOpacity
							onPress={() => this.setState({ showLogout: true })}>
							<Icon
								type='FontAwesome5'
								name='sign-out-alt'
								style={{ color: colors.white, fontSize: 21 }}
							/>
						</TouchableOpacity>
					}
				/>
				<View
					style={{
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 75,
					}}>
					<TouchableOpacity onPress={this.changeImage}>
						<Image
							source={{
								uri: avatar,
							}}
							style={{
								width: 180,
								height: 180,
								borderRadius: 180 / 2,
							}}
						/>
					</TouchableOpacity>
				</View>
				<View
					style={{
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 10,
					}}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
						}}>
						<Text
							style={{
								fontFamily: PoppinsBold,
								fontSize: 20,
							}}>
							{name}
						</Text>
						<TouchableOpacity onPress={this.showDialog}>
							<Icon
								type='FontAwesome5'
								name='pencil-alt'
								style={{ fontSize: 13, marginLeft: 10, marginTop: 7 }}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ padding: 20 }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginTop: 15,
						}}>
						<Text style={{ fontFamily: PoppinsRegular, fontSize: 16 }}>
							{email}
						</Text>

						<Icon
							type='FontAwesome5'
							name='envelope'
							style={{ fontSize: 17, marginLeft: 10, marginTop: 7 }}
						/>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginTop: 15,
						}}>
						<Text style={{ fontFamily: PoppinsRegular, fontSize: 16 }}>
							{this.state.location === 'undefined' ? '-' : this.state.location}
						</Text>
						<Icon
							type='FontAwesome5'
							name='map-marked'
							style={{ fontSize: 17, marginLeft: 10, marginTop: 7 }}
						/>
					</View>
				</View>
				{/* </View> */}
			</>
		)
	}
}

export default Profile
