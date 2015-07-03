"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");

var Key = require("./key.js");

var Styles = require("./style");

var {
	View,
} = React;

var styles = Styles.ios;

var Keypad = React.createClass({
	getInitialState: function(){
		return {
			number: false,
			leave: false,
			duty: false,
			lunch: false,
		};
	},
	componentWillMount: function(){
		this.prepareState(this.props);
	},
	componentWillReceiveProps: function(newProps){
		this.prepareState(newProps);
	},
	prepareState: function(props){
		switch(props.mode){
			case "login":
				this.setState({
					number: true,
					leave: false,
					duty: false,
					lunch: false,
				});
				break;
			case "employee":
				this.setState({
					number: false,
					leave: false,
					duty: true,
					lunch: true,
				});
				break;
			case "leave_manager":
				this.setState({
					number: false,
					leave: true,
					duty: true,
					lunch: true,
				});
				break;
		}
	},
	keyPressHandle: function(key){
		this.props.callback(key);
	},
	render: function(){
		var keyList = [];
		var types = [];
		types["number"] = "blue";
		types["duty"] = "yellow";
		types["leave"] = "blueHole";
		types["lunch"] = "orange";

		var smalls = [];
		smalls["number"] = false;
		smalls["duty"] = true;
		smalls["leave"] = true;
		smalls["lunch"] = false;

		var keyList = [
			{ type: "number", text: "1" },
			{ type: "number", text: "2" },
			{ type: "number", text: "3" },
			{ type: "duty", text: "上班" },
			{ type: "number", text: "4" },
			{ type: "number", text: "5" },
			{ type: "number", text: "6" },
			{ type: "duty", text: "休息" },
			{ type: "number", text: "7" },
			{ type: "number", text: "8" },
			{ type: "number", text: "9" },
			{ type: "duty", text: "下班" },
			{ type: "leave", text: "事假" },
			{ type: "leave", text: "病假" },
			{ type: "leave", text: "特休" },
			{ type: "lunch", text: "訂餐", icon: "cutlery" },
		];

		keyList = keyList.map(function(key){
			return {
				key: "Key" + key.text,
				type: types[key.type],
				icon: key.icon,
				text: key.text,
				small: smalls[key.type],
				active: this.state[key.type],
				callback: this.keyPressHandle,
			}
		}.bind(this));

		keyList = keyList.map(function(key){
			return <Key {...key}></Key>
		});

		return (
			<View style={styles.keypad}>
				{keyList}
			</View>
		);
	}
});

module.exports = Keypad;