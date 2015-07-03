"use strict";

var React = require("react-native");

var Styles = require("./style");

var {
	View,
} = React;

var styles = Styles.ios;

var Empty = React.createClass({
	render: function(){
		return (
			<View style={[styles.iconItemContainer, styles.itemOnlyButton]}></View>
		)
	}
});

module.exports = Empty;