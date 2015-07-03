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
	item:{
		borderColor: Color.yellow,
		borderBottomWidth: 0.5,
		borderRightWidth: 0.5,
		borderLeftWidth: 0.5,
	},
	itemOnlyButton:{
		borderColor: Color.yellow,
		borderBottomWidth: 0.5,
	},

	//Title
	titleContainer:{
		alignItems: "flex-start",
		flexDirection: "row",
		height: Size.list_view_title_height,
	},
	titleColumn:{
		paddingTop: Size.list_view_title_padding_top,
		paddingLeft: 10,
		color: Color.white,
		fontSize: Size.list_view_title_font_size,
	},
	titleLeftColumn:{
		width: 167,
	},

	//Icon Item
	iconItemContainer:{
		flexDirection: "row",
		alignItems: "center",
		height: Size.list_view_row_height,
	},
	iconItemIconColumn:{
		height: 69.5,
		width: 70,
	},
	iconItemTextColumn:{
		color: Color.white,
		fontSize: 18,
		fontWeight: "bold",
	},

	//Icon Button
	iconButtonTextColumn:{
		color: Color.light_blue,
	},

	//Employee List
	employeeListView:{
		borderLeftWidth: 0.5,
		borderRightWidth: 0.5,
		borderColor: Color.yellow,
	},

	//Employee
	darkOverlay:{
		position: "absolute",
		top: 0,
		left: 0,
		width: 290,
		height: 70,
		backgroundColor: Color.transparent_black,
	},
	employeeContainer:{
		flexDirection: "row",
		height: Size.list_view_row_height,
	},
	employeeAvatar:{
		height: 50,
		width: 50,
		marginLeft: 10,
		borderRadius: 25,
	},
	employeeNameColumn:{
		flexDirection: "column",
		width: 117,
		paddingLeft: 10,
	},
	employeeNameText:{
		color: Color.white,
		marginBottom: 5,
		fontSize: 18,
	},
	employeeIdText:{
		color: Color.white,
		fontSize: 16,
		fontWeight: "bold",
	},
	employeeScoreColumn:{
		flexDirection: "column",
		width: 100,
		paddingTop: 3,
	},
	employeeScoreTitleText:{
		color: Color.light_blue,
		fontSize: 11,
		fontWeight: "bold",
	},
	employeeScoreText:{
		color: Color.light_blue,
		fontSize: 30,
		fontWeight: "bold",
	},
});

module.exports = styles;