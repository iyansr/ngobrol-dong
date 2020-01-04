import React from 'react'
import {
	Container,
	Header,
	Left,
	Body,
	Right,
	Button,
	Icon,
	Title,
	Subtitle,
} from 'native-base'
import { StatusBar, StyleSheet } from 'react-native'
import { colors } from '../../Theme/colors'
import { PoppinsBold, PoppinsRegular } from '../../Theme/fonts'
import PropTypes from 'prop-types'

const CustomHeader = ({
	leftPressed,
	showLeft,
	showRight,
	headerTitle,
	rightItem,
	showSubtitle,
	subtitle,
}) => {
	return (
		<Header style={{ backgroundColor: colors.litBlue }}>
			<StatusBar backgroundColor={colors.litBlue} />
			{showLeft && (
				<Left style={{ flex: 1 }}>
					<Button transparent onPress={leftPressed}>
						<Icon type='FontAwesome5' name='chevron-left' />
					</Button>
				</Left>
			)}
			<Body
				style={{
					alignContent: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
				}}>
				<Title style={styles.title}>{headerTitle}</Title>
				{showSubtitle && (
					<Subtitle style={{ fontFamily: PoppinsRegular, fontSize: 12 }}>
						{subtitle}
					</Subtitle>
				)}
			</Body>
			{showRight && <Right style={{ flex: 1 }}>{rightItem}</Right>}
		</Header>
	)
}

CustomHeader.defaultProps = {
	showLeft: false,
	showRight: false,
}

CustomHeader.propTypes = {
	leftPressed: PropTypes.func,
	showLeft: PropTypes.bool,
	showRight: PropTypes.bool,
	headerTitle: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
	title: {
		fontFamily: PoppinsBold,
		color: colors.white,
	},
})

export default CustomHeader
