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
	mainContainer:{
		flex: 1,
		flexDirection: "row",
		backgroundColor: Color.dark,
	},
	functionListContainer:{
		justifyContent: "flex-start",
		width: 300,
		paddingLeft: 4.5,
		paddingRight: 4.5,
		backgroundColor: Color.black,
	},
	contentArea:{
		flex: 1,
		flexDirection: "column",
		alignItems: "stretch",
	},
	headArea:{
		height: Size.list_view_title_height,
		paddingTop: Size.list_view_title_padding_top,
		paddingLeft: Size.list_view_title_padding_left,
	},
	status:{
		fontSize: Size.list_view_title_font_size,
		color: Color.gray,
	},
	keypad:{
		flexDirection: "row",
		flexWrap: "wrap",
		paddingTop: 35,
		paddingLeft: 35,
	},
	key:{
		alignItems: "center",
		justifyContent: "center",
		margin: 20,
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	blueKey:{
		backgroundColor: Color.gray,
	},
	blueKeyActive:{
		backgroundColor: Color.light_blue,
	},
	blueKeyPressing:{
		backgroundColor: Color.gray,
		borderWidth: 1,
		borderColor: Color.light_blue,
	},
	yellowKey:{
		backgroundColor: Color.gray,
	},
	yellowKeyActive:{
		backgroundColor: Color.yellow,
	},
	yellowKeyPressing:{
		backgroundColor: Color.gray,
		borderWidth: 1,
		borderColor: Color.yellow,
	},
	orangeKey:{
		backgroundColor: Color.gray,
	},
	orangeKeyActive:{
		backgroundColor: Color.orange,
	},
	orangeKeyPressing:{
		backgroundColor: Color.gray,
		borderWidth: 1,
		borderColor: Color.orange,
	},
	blueHoleKey:{
		borderWidth: 1,
		borderColor: Color.gray,
	},
	blueHoleKeyActive:{
		borderWidth: 1,
		borderColor: Color.light_blue,
	},
	blueHoleKeyPressing:{
		backgroundColor: Color.light_blue,
	},
	keyIcon:{
		width: 60,
		height: 60,
	},
	keyText:{
		color: Color.white,
		fontSize: 70,
	},
	keyTextSmall:{
		color: Color.white,
		fontSize: 30,
	},
	logoutContainer:{
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems:"center",
		paddingTop: 25,
		paddingRight: 57,
	},
	logoutIcon:{
		width: 30,
		height: 30,
	},
	logoutText:{
		color: Color.yellow,
		fontSize: 12,
		fontWeight: "bold"
	}
});

module.exports = styles;