"use strict";

var React = require("react-native");

var Action = require("../model/action");

var Styles = require("./style");

var {
	Text,
	View,
	TouchableWithoutFeedback,
} = React;

var styles = Styles.ios;

var NoPanelHeader = React.createClass({
	render: function(){
		return (
			<Text style={styles.titleText}>{"系統顯示的 Panel 不存在"}</Text>
		);
	}
});

var NoPanelContent = React.createClass({
	getInitialState: function(){
		return {}
	},
	render: function(){
		return (
			<View>
				<Text>{"這是一個系統呼叫了不存在的 Panel 所造成的錯誤，請將操作行為記錄下來，並聯絡程式管理員"}</Text>
			</View>
		);
	}
});

var NoPanelFooter = React.createClass({
	getInitialState: function(){
		return {
			pressing: false,
		}
	},
	render: function(){
		return (
			<View style={styles.footer}>
				<TouchableWithoutFeedback onPress={Action.hidePanel}>
					<View style={styles.button}>
						<Text style={styles.buttonText}>{"關閉"}</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
});

module.exports = {
	header: NoPanelHeader,
	content: NoPanelContent,
	footer: NoPanelFooter,
}