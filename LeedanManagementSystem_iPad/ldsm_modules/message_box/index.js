"use strict";

var React = require("react-native");
var TimerMixin = require("react-timer-mixin");

var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");
var Animation = require("../basic/animation_definition");

var MessageStore = require("../model/message_store");
var Action = require("../model/action");

var Styles = require("./style");
var styles = Styles.ios;

var {
	View,
	Text,
	LayoutAnimation,
} = React;

var MessageBox = React.createClass({
	getInitialState: function(){
		return {
			error_list: [],
			message_list: [],
		};
	},
	componentDidMount: function(){
		MessageStore.addChangeListener(this.onMessageStoreChange);
	},
	componentWillUnmount: function() {
		MessageStore.removeChangeListener(this.onMessageStoreChange);
	},
	onMessageStoreChange: function(){
		// LayoutAnimation.configureNext(Animation.spring);
		var newErrorList = MessageStore.getUnshowError();
		var newMessageList = MessageStore.getUnshowMessage();
		if(newErrorList.length > this.state.error_list.length){
			setTimeout(function(){
				// LayoutAnimation.configureNext(Animation.spring);
				Action.clearError(1);
			}.bind(this), 5000);
		}
		if(newMessageList.length > this.state.message_list.length){
			setTimeout(function(){
				// LayoutAnimation.configureNext(Animation.spring);
				Action.clearMessage(1);
			}.bind(this), 5000);
		}
		this.setState({
			error_list: MessageStore.getUnshowError(),
			message_list: MessageStore.getUnshowMessage(),
		});
	},
	render: function(){
		return (
			<View style={styles.messageContainer}>
				{ this.state.message_list.map(function(message, index){
					return (
						<View style={styles.messageTextBox} key={"Message" + index}>
							<Text style={styles.messageText}>{ message }</Text>
						</View>
					)
				}) }
				{ this.state.error_list.map(function(error, index){
					return (
						<View style={[styles.messageTextBox, styles.errorTextBox]} key={"Error" + error.message}>
							<Text style={[styles.messageText, styles.errorText]}>{ error.toString() }</Text>
						</View>
					)
				}) }
			</View>
		)
	}
});

module.exports = MessageBox;