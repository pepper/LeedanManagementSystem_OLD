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

	// Content Area
	contentArea:{
		flex: 1,
		flexDirection: "column",
		alignItems: "stretch",
	},
	headArea:{
		flexDirection: "row",
		alignItems: "stretch",
		height: Size.list_view_title_height,
		paddingTop: Size.list_view_title_padding_top,
	},
	headAreaText:{
		color: Color.white,
		fontSize: Size.list_view_title_font_size,
		paddingLeft: Size.list_view_title_padding_left,
	},
	workingItemColumn1:{
		flex: 704,
	},
	workingItemColumn2:{
		flex: 281,
	},
	workingItemColumn3:{
		flex: 281,
	},

	// Working Item
	workingItem:{
		flexDirection: "column",
	},
	workingItemTitle:{
		flexDirection: "row",
		height: Size.list_view_row_height,
	},
	workingItemTitleColumn:{
		justifyContent: "center",
		backgroundColor: Color.dark_blue,
		borderRightWidth: 0.5,
		borderRightColor: Color.dark,
		borderBottomWidth: 0.5,
		borderBottomColor: Color.dark,
		paddingLeft: Size.list_view_title_padding_left,
	},
	workingItemTitleColumnEdit:{
		backgroundColor: Color.light_blue,
	},
	workingItemNumberContainer:{
		flexDirection: "row",
		height: Size.list_view_row_height,
		backgroundColor: Color.light_blue,
		paddingLeft: Size.list_view_title_padding_left,
		paddingTop: Size.list_view_title_padding_left,
	},
	workingItemActionContainer:{
		flexDirection: "row",
		justifyContent: "center",
	},
	workingItemTextTitle:{
		fontSize: 20,
		fontWeight: "bold",
	},
	workingItemTextLastRecordDatetime:{
		marginTop: 5,
		fontSize: 12,
	},
	workingItemTextTodaysRecord:{
		fontSize: 13,
		fontWeight: "bold",
	},
	workingItemTextScore:{
		fontSize: 30,
		fontWeight: "bold",
	},
	workingItemText:{
		color: Color.gray,
	},
	workingItemTextEdit:{
		color: Color.white,
	},
	workingItemActionButton:{
		alignItems: "center",
	},
	workingItemActionButtonFirst:{
		marginRight: 35,
	},
	workingItemActionIcon:{
		width: 25,
		height: 25,
	},
	workingItemActionText:{
		fontSize: 12,
	},

	// Number Button
	numberButton:{
		width: 46,
		height: 46,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderRadius: 23,
		borderColor: Color.white,
		marginLeft: Size.list_view_title_padding_left,
	},
	numberButtonPressing:{
		backgroundColor: Color.white,
	},
	numberButtonText:{
		fontSize: 30,
		color: Color.white,
	},
	numberButtonTextPressing:{
		color: Color.light_blue,
	},

	// Footer
	footArea:{
		flexDirection: "row",
		height: Size.list_view_row_height,
	},
	footLeftColumn:{
		flexDirection: "row",
		flex: 1,
		justifyContent: "flex-start",
		paddingTop: 15,
		paddingLeft: 25,
		alignItems: "center",
	},
	footRightColumn:{
		flexDirection: "row",
		flex: 1,
		justifyContent: "flex-end",
		paddingRight: 25,
	},
	footColumn:{
		flex: 1,
	},
	footButton:{
		alignItems: "center",
		justifyContent: "center",
	},
	footButtonIcon:{
		width: 25,
		height: 25,
		marginBottom: 5,
	},
	footButtonText:{
		color: Color.yellow,
		fontSize: 10,
	},
});

module.exports = styles;