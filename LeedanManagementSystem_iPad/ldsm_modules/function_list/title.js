"use strict";

var React = require("react-native");

var Styles = require("./style");

var {
	View,
	Text,
} = React;

var styles = Styles.ios;

var Title = React.createClass({
	render: function(){
		return (
			<View style={[styles.titleContainer, styles.item]}>
				<Text style={[styles.titleLeftColumn, styles.titleColumn]}>{this.props.leftColumn}</Text>
				<Text style={[styles.titleRightColumn, styles.titleColumn]}>{this.props.rightColumn}</Text>
			</View>
		)
	}
});

module.exports = Title;