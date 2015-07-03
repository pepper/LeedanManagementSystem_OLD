"use strict";

var React = require("react-native");

var Color = require("../basic/color_definition");

var Styles = require("./style");

var {
	Text,
	View,
	TouchableWithoutFeedback,
} = React;

var styles = Styles.ios;

var NumberButton = React.createClass({
	getInitialState: function(){
		return {
			pressing: false,
		}
	},
	onPressInHandler: function(){
		this.setState({
			pressing: true,
		});
	},
	onPressOutHandler: function(){
		this.setState({
			pressing: false,
		});
	},
	onPressHandler: function(){
		if(this.props.callback){
			this.props.callback(this.props.number);
		}
	},
	render: function(){
		return (
			<TouchableWithoutFeedback onPressIn={this.onPressInHandler} onPressOut={this.onPressOutHandler} onPress={this.onPressHandler}>
				<View style={[styles.numberButton, (this.state.pressing && styles.numberButtonPressing)]}>
					<Text style={[styles.numberButtonText, (this.state.pressing && styles.numberButtonTextPressing)]}>{this.props.number}</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}
});

module.exports = NumberButton;