"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");

var Styles = require("./style");

var {
	View,
	Text,
	Image,
	TouchableWithoutFeedback,
} = React;

var styles = Styles.ios;

var Employee = React.createClass({
	getInitialState: function(){
		return {
			name: "",
			total_score: 0,
			avatar_url: "",
		}
	},
	onPressHandler: function(){
		if(this.props.onPress){
			this.props.onPress();
		}
	},
	render: function(){
		return (
			<TouchableWithoutFeedback onPress={this.onPressHandler}>
				<View style={[styles.iconItemContainer, styles.itemOnlyButton]}>
					<Image
						style={styles.employeeAvatar}
						source={{uri: "data:image/jpeg;base64," + this.props.avatar, isStatic: true}}
					/>
					<View style={[styles.employeeNameColumn]}>
						<Text style={styles.employeeNameText}>{this.props.name}</Text>
						<Text style={styles.employeeIdText}>{this.props.idNumber}</Text>
					</View>
					<View style={styles.employeeScoreColumn}>
						<Text style={styles.employeeScoreTitleText}>{"Total Score"}</Text>
						<Text style={styles.employeeScoreText}>{this.props.totalScore}</Text>
					</View>
					{
					(!this.props.active)?
					<View style={styles.darkOverlay}></View>
					:
					null
					}
				</View>
			</TouchableWithoutFeedback>
		)
	}
});

module.exports = Employee;