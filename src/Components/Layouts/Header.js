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
} from 'native-base'
import { StatusBar, StyleSheet } from 'react-native'
import { colors } from '../../Theme/colors'
import { PoppinsBold } from '../../Theme/fonts'
import PropTypes from 'prop-types'

const CustomHeader = ({
	leftPressed,
	showLeft,
	showRight,
	headerTitle,
	rightItem,
}) => {
	return (
		<Header style={{ backgroundColor: colors.litBlue }}>
			<StatusBar backgroundColor={colors.litBlue} />
			{showLeft && (
				<Left>
					<Button transparent onPress={leftPressed}>
						<Icon type='FontAwesome5' name='chevron-left' />
					</Button>
				</Left>
			)}
			<Body>
				<Title style={styles.title}>{headerTitle}</Title>
			</Body>
			{showRight && <Right>{rightItem}</Right>}
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
