"use strict";

var React = require("react-native");

var Config = require("../config");
var Color = require("../basic/color_definition");
var Size = require("../basic/size_definition");
var Action = require("../model/action");
// var Styles = require("./style");
// var styles = Styles.ios;

var {
	TextInput,
	View,
	StyleSheet,
} = React;

var Login = React.createClass({
	getInitialState: function(){
		return {
			username: "",
			password: ""
		}
	},
	onSubmitEditingHandler: function(){
		Action.companyLogin(this.state.username, this.state.password);
	},
	render: function(){
		return (
			<View style={style.loginContainer}>
				<TextInput style={style.textInput} onChangeText={(text) => this.setState({username: text})} placeholder={"Please enter your company username."} />
				<TextInput style={style.textInput} onChangeText={(text) => this.setState({password: text})} placeholder={"Please enter your password."} password={true} onSubmitEditing={this.onSubmitEditingHandler}/>
			</View>
		);
	},
});

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
var style = styles[Config.getPlatform()];

module.exports = Login;