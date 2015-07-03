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
	panelContainer:{
		position: "absolute",
		top: 0,
		left: 0,
		width: 1024,
		height: 768,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Color.transparent_black,
	},
	panel:{
		width: 660,
		height: 500,
		backgroundColor: Color.white,
		borderRadius: 10,
	},
	titleContainer:{
		height: 55,
		borderBottomWidth: 0.5,
		borderBottomColor: Color.dark,
		padding: 15,
		backgroundColor: Color.transparent,
	},
	titleText:{
		fontSize: 25,
		fontWeight: "bold",
	},
	contentContainer:{
		flex: 1,
		padding: 15,
		backgroundColor: Color.transparent,
	},
	footerContainer:{
		height: 55,
		borderTopWidth: 0.5,
		borderTopColor: Color.dark,
		padding: 10,
		backgroundColor: Color.transparent,
	},
	footer:{
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	button:{
		height: 35,
		width: 100,
		backgroundColor: Color.dark,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 10,
	},
	buttonText:{
		color: Color.white,
		fontSize: 16,
	},
	inputRowContainer:{
		flex: 1,
		flexDirection: "column",
	},
	fullWidthTextInput:{
		flex: 1,
		height: 40,
		borderWidth: 0.5,
		borderColor: Color.dark,
		padding: 5,
		paddingLeft: 15,
		marginBottom: 10,
	},
	fullWidthSegmented:{
		flex: 1,
		height: 40,
		marginBottom: 10,
	},
	inputRowTitle:{
		flex: 1,
	},
	inputRowContent:{
		flex: 2,
	},
	avatarContainer:{
		flexDirection: "row",
	},
	cameraContainer:{
		width: 160,
		height: 160,
		marginRight: 20,
	},
	cameraView:{
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		borderWidth: 0.5,
		borderColor: Color.dark,
		borderRadius: 80,
		backgroundColor: Color.transparent,
		overflow: "hidden",
	},
	avatarImage:{
		flex: 1,
		borderWidth: 0.5,
		borderColor: Color.dark,
		borderRadius: 80,
	},
	takePhotoButton:{
		width: 20,
		height: 20,
		marginBottom: 10,
	},
});

module.exports = styles;