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
	loginContainer:{
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	textInput:{
		width: 400,
		height: 40,
		backgroundColor: Color.white,
		alignSelf: "center",
		marginBottom: 10,
		paddingLeft: 10,
		borderRadius: 10,
	},
});

module.exports = styles;