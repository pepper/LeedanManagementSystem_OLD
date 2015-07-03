"use strict";

var React = require("react-native");

var Color = require("../basic/color_definition");
var Size = require("../basic/size_definition");
Size = Size.ios;

var {
	StyleSheet,
} = React;

var styles = {};

styles.ios = StyleSheet.create({
	messageContainer:{
		position: "absolute",
		top: 10,
		left: 10,
		width: 1004,
		backgroundColor: Color.transparent,
	},
	messageTextBox:{
		flex: 1,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: Color.white,
		backgroundColor: Color.yellow,
		padding: 5,
		marginBottom: 5,
	},
	errorTextBox:{
		backgroundColor: Color.orange,
	},
	messageText:{
		fontSize: 12,
		color: Color.dark,
		fontWeight: "bold",
	},
	errorText:{
		color: Color.white,
	},
});

module.exports = styles;