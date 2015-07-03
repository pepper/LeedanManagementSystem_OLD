"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");

var Styles = require("./style");

var {
	View,
	Text,
	TouchableWithoutFeedback,
} = React;

var styles = Styles.ios;

var IconButton = React.createClass({
	render: function(){
		return (
			<TouchableWithoutFeedback onPress={this.props.onPress}>
				<View style={[styles.iconItemContainer, styles.item]}>
					<Icon
						name={"fontawesome|" + this.props.icon}
						size={45}
						color={Color.light_blue}
						style={styles.iconItemIconColumn}
					/>
					<Text style={[styles.iconItemTextColumn, styles.iconButtonTextColumn]}>{this.props.text}</Text>
				</View>
			</TouchableWithoutFeedback>
		)
	}
});

module.exports = IconButton;