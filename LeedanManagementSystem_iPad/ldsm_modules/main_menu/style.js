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
	container:{
		width: 90,
		backgroundColor: Color.yellow,
	},
	logoContainer:{
		width: 90,
		height: Size.list_view_title_height,
		borderColor: Color.light_yellow,
		borderBottomWidth: 0.5,
		alignItems: "center",
		paddingTop: Size.list_view_title_padding_top,
	},
	logoImage:{
		width: 72.5,
		height: 20,
	},
	menuItem:{
		alignItems: "center",
		justifyContent: "center",
		height: Size.list_view_row_height,
		borderColor: Color.light_yellow,
		borderBottomWidth: 0.5,
	},
	menuItemIcon:{
		width: 40,
		height: 40,
		marginBottom: 5,
	},
	menuItemText:{
		fontSize: 10,
		color: Color.gray,
	},
	selectedItem:{
		color: Color.black,
	},
});

module.exports = styles;