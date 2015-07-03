"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");

var Styles = require("./style");

var {
	View,
	Text,
} = React;

var styles = Styles.ios;

var IconItem = React.createClass({
	render: function(){
		return (
			<View style={[styles.iconItemContainer, styles.item]}>
				<Icon
					name={"fontawesome|" + this.props.icon}
					size={45}
					color={Color.white}
					style={styles.iconItemIconColumn}
				/>
				<Text style={[styles.iconItemTextColumn]}>{this.props.text}</Text>
			</View>
		)
	}
});

module.exports = IconItem;