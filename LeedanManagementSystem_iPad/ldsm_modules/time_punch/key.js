"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");

var Styles = require("./style");

var {
	View,
	Text,
	TouchableWithoutFeedback,
} = React;

var styles = Styles.ios;

var Key = React.createClass({
	getInitialState: function(){
		return {
			pressing: false,
		};
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
		if(this.props.active){
			this.props.callback(this.props.text);
		}
	},
	render: function(){
		var content;
		var style = [styles.numberKey];
		switch(this.props.type){
			case "blue":
				style = [styles.key, styles.blueKey];
				if(this.props.active){
					style.push(styles.blueKeyActive);
					if(this.state.pressing){
						style.push(styles.blueKeyPressing);
					}
				}
				break;
			case "yellow":
				style = [styles.key, styles.yellowKey];
				if(this.props.active){
					style.push(styles.yellowKeyActive);
					if(this.state.pressing){
						style.push(styles.yellowKeyPressing);
					}
				}
				break;
			case "orange":
				style = [styles.key, styles.orangeKey];
				if(this.props.active){
					style.push(styles.orangeKeyActive);
					if(this.state.pressing){
						style.push(styles.orangeKeyPressing);
					}
				}
				break;
			case "blueHole":
				style = [styles.key, styles.blueHoleKey];
				if(this.props.active){
					style.push(styles.blueHoleKeyActive);
					if(this.state.pressing){
						style.push(styles.blueHoleKeyPressing);
					}
				}
				break;
		}
		if(this.props.icon){
			content = <Icon
				name={"fontawesome|" + this.props.icon}
				size={60}
				color={Color.white}
				style={styles.keyIcon}
			/>
		}
		else if(this.props.text){
			content = <Text style={(this.props.small)?styles.keyTextSmall:styles.keyText}>{this.props.text}</Text>
		}
		return (
			<TouchableWithoutFeedback onPressIn={this.onPressInHandler} onPressOut={this.onPressOutHandler} onPress={this.onPressHandler}>
				<View style={style}>
					{content}
				</View>
			</TouchableWithoutFeedback>
		);
	}
});

module.exports = Key;