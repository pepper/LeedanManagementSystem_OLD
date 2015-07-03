"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Styles = require("./style");

var styles = Styles.ios;

var Color = require("../basic/color_definition");

var {
	StyleSheet,
	Text,
	View,
	TouchableWithoutFeedback,
} = React;

var MenuItem = React.createClass({
	onPressButton: function(){
		this.props.callback(this.props.id);
	},
	render: function(){
		return (
			<TouchableWithoutFeedback onPress={this.onPressButton}>
				<View style={styles.menuItem}>
					<Icon
						name={"fontawesome|" + this.props.icon}
						size={40}
						color={(this.props.selected)?Color.black:Color.gray}
						style={styles.menuItemIcon}
					/>
					<Text style={[styles.menuItemText, this.props.selected && styles.selectedItem]}>{this.props.text}</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}
});

module.exports = MenuItem;