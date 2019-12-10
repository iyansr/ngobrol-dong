import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Dimensions, Text } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { Auth, Database } from '../../Configs/Firebase'
import { colors } from '../../Theme/colors'
import { PoppinsRegular } from '../../Theme/fonts'
import { mapBoxAPiKey } from '../../Configs/MapBoxAPI'

const MapView = () => {
	MapboxGL.setAccessToken(mapBoxAPiKey)

	const [locationList, setLocationList] = useState([
		{
			id: 'ugmMap',
			name: 'Iyan',
			longitude: 110.3772568,
			latitude: -7.7728579,
		},
		{
			id: 'meHere',
			name: 'Kenzo',
			longitude: 110.37,
			latitude: -7.75,
		},
	])

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		MapboxGL.setTelemetryEnabled(false)
		setLoading(false)
	}, [])

	/* //[logitute, latitude] */

	if (loading) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		)
	}

	return (
		<View style={styles.page}>
			<View style={styles.container}>
				<MapboxGL.MapView
					style={styles.map}
					zoomLevel={12}
					rotateEnabled={true}
					centerCoordinate={[110.37, -7.75]}>
					{locationList.map(location => (
						<MapboxGL.PointAnnotation
							onSelected={() => alert(location.name)}
							key={location.id}
							id={location.id}
							coordinate={[location.longitude, location.latitude]}
							title='Point anotation'>
							<View style={styles.annotationContainer}>
								<View style={styles.annotationFill} />
								<Text
									style={{
										color: colors.darkBlue,
										fontFamily: PoppinsRegular,
										marginTop: -2,
									}}>
									{location.name}
								</Text>
							</View>
						</MapboxGL.PointAnnotation>
					))}
				</MapboxGL.MapView>
			</View>
		</View>
	)
}

MapView.navigationOptions = {
	header: null,
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
		backgroundColor: 'tomato',
	},
	map: {
		flex: 1,
	},
	annotationContainer: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		borderRadius: 25,
	},
	annotationFill: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: 'blue',
		transform: [{ scale: 0.6 }],
	},
})

export default MapView
