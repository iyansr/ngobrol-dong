import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	Platform,
	PermissionsAndroid,
	ToastAndroid,
	Image,
} from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { Auth, Database } from '../../Configs/Firebase'
import { colors } from '../../Theme/colors'
import { PoppinsRegular } from '../../Theme/fonts'
import { mapBoxAPiKey } from '../../Configs/MapBoxAPI'
import CustomHeader from '../Layouts/Header'
import Geolocaton from 'react-native-geolocation-service'
import AsyncStorage from '@react-native-community/async-storage'

MapboxGL.setAccessToken(mapBoxAPiKey)
class MapView extends Component {
	state = {
		loading: true,
		userList: [],
		longitude: null,
		latitude: null,
		name: '',
		userId: '',
	}

	getUserList = async () => {
		try {
			const data = await AsyncStorage.getItem('@user')
			const usr = JSON.parse(data)
			console.log('USER IN CHAT LIST', data)
			this.setState({
				name: usr.name,
				userId: usr.id,
			})
			Database.ref('/user').on('child_added', value => {
				let person = value.val()
				if (data !== null && person.id !== usr.id) {
					this.setState(prev => ({
						userList: [...prev.userList, person],
					}))
				}
			})
		} catch (error) {
			ToastAndroid.show(error.message, ToastAndroid.LONG)
			console.log(error.message)
		}
	}

	hasLocationPermission = async () => {
		if (
			Platform.OS === 'ios' ||
			(Platform.OS === 'android' && Platform.Version < 23)
		)
			return true

		const hasPermision = await PermissionsAndroid.check(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		)
		if (hasPermision) return true
		const status = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		)

		if (status === PermissionsAndroid.RESULTS.GRANTED) {
			return true
		}
		if (status === PermissionsAndroid.RESULTS.DENIED) {
			ToastAndroid.show(
				'Location Permission Denied By User.',
				ToastAndroid.LONG
			)
		} else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
			ToastAndroid.show(
				'Location Permission Revoked By User.',
				ToastAndroid.LONG
			)
		}
		return false
	}

	getLocation = async () => {
		const hasLocationPermission = await this.hasLocationPermission()
		if (!hasLocationPermission) return

		Geolocaton.getCurrentPosition(
			async position => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					loading: false,
				})
				Database.ref(`/user/${this.state.userId}`).update({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				})

				const data = await AsyncStorage.getItem('@user')
				const parsedData = JSON.parse(data)

				const updatedData = {
					...parsedData,
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				}

				await AsyncStorage.setItem('@user', JSON.stringify(updatedData))
			},
			error => {
				ToastAndroid.show(error.message, ToastAndroid.LONG)
			},
			{
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 10000,
				distanceFilter: 50,
				forceRequestLocation: true,
			}
		)
	}

	componentDidMount = async () => {
		MapboxGL.setTelemetryEnabled(false)
		await this.getUserList()
		await this.getLocation()
	}

	render() {
		const { locationList, loading } = this.state
		console.log('USER MAP LIST', this.state.userList)
		if (loading) {
			return (
				<>
					<CustomHeader headerTitle='Map' />
					<View>
						<Text>Loading...</Text>
					</View>
				</>
			)
		}
		return (
			<>
				<CustomHeader headerTitle='Map' />
				<View style={styles.page}>
					<View style={styles.container}>
						<MapboxGL.MapView style={styles.map} rotateEnabled={true}>
							<MapboxGL.Camera
								zoomLevel={20}
								centerCoordinate={[this.state.longitude, this.state.latitude]}
							/>
							<MapboxGL.PointAnnotation
								// onSelected={() => alert('Hello ' + this.state.name)}
								key={'currentUser'}
								id={'currentUser'}
								coordinate={[this.state.longitude, this.state.latitude]}
								title='Point anotation'>
								<View style={styles.annotationContainer}>
									<View style={styles.annotationFill} />
									<Text
										style={{
											color: colors.darkBlue,
											fontFamily: PoppinsRegular,
											marginTop: -2,
										}}>
										You
									</Text>
								</View>
							</MapboxGL.PointAnnotation>
							{this.state.userList.map(user => {
								return (
									<MapboxGL.PointAnnotation
										onSelected={() =>
											this.props.navigation.navigate('FriendsProfile', {
												user: user,
											})
										}
										key={user.id}
										id={user.id}
										coordinate={[user.longitude || 0, user.latitude || 0]}
										title='Point anotation'>
										<View style={styles.annotationContainer}>
											<View style={styles.annotationFill} />
											<Text
												style={{
													color: colors.darkBlue,
													fontFamily: PoppinsRegular,
													marginTop: -2,
												}}>
												{user.name}
											</Text>
										</View>
									</MapboxGL.PointAnnotation>
								)
							})}
						</MapboxGL.MapView>
					</View>
				</View>
			</>
		)
	}
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	container: {
		height: '100%',
		width: '100%',
		backgroundColor: 'transparent',
	},
	map: {
		flex: 1,
	},
	annotationContainer: {
		width: 120,
		height: 120,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		borderRadius: 25,
	},
	annotationFill: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: colors.litBlue,
		transform: [{ scale: 0.6 }],
	},
})

export default MapView
