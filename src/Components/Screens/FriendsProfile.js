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

class FriendsProfile extends Component {
	state = {
		dialogVisible: false,
		loadingVisible: false,
		showLogout: false,
		user: this.props.navigation.getParam('user'),
		location: '',
	}

	componentDidMount() {
		fetch(
			`https://us1.locationiq.com/v1/reverse.php?key=d17151587b1e23&lat=${this
				.state.user.latitude || 0}&lon=${this.state.user.longitude ||
				0}&format=json`
		)
			.then(response => response.json())
			.then(responseJson => {
				console.log(responseJson)
				this.setState({
					location: `${responseJson.address.state}`,
				})
			})
	}

	render() {
		const { avatar, name, email } = this.state.user
		return (
			<>
				<CustomHeader
					headerTitle=''
					showLeft={true}
					leftPressed={() => this.props.navigation.goBack()}
				/>
				<View
					style={{
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 75,
					}}>
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

export default FriendsProfile
