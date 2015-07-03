"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Action = require("../model/action");
var Color = require("../basic/color_definition");

var WorkingItemList = require("./working_item_list");

var Styles = require("./style");

var {
	Text,
	View,
	ListView,
	AlertIOS,
	TouchableWithoutFeedback,
} = React;

var styles = Styles.ios;

var ContentArea = React.createClass({
	getInitialState: function(){
		return {
			current_input: "",
			login_state: false,
			employee: null,
			keypad_mode: "login", 
		}
	},
	onPressCancelHandler: function(){

	},
	onPressSubmitHandler: function(){
		Action.addWorkingRecord();
	},
	render: function(){
		return (
			<View style={styles.contentArea}>
				<View style={styles.headArea}>
					<View style={[styles.workingItemColumn1]}>
						<Text style={styles.headAreaText}>{"工作項目名稱"}</Text>
					</View>
					<View style={[styles.workingItemColumn2]}>
						<Text style={styles.headAreaText}>{"當日累計"}</Text>
					</View>
					<View style={[styles.workingItemColumn3]}>
						<Text style={styles.headAreaText}>{"年度累計"}</Text>
					</View>
				</View>
				<WorkingItemList />
				<View style={styles.footArea}>
					<View style={styles.footLeftColumn}>
						<TouchableWithoutFeedback onPress={this.onPressSubmitHandler}>
							<View style={styles.footButton}>
								<Icon
									name={"fontawesome|check-circle-o"}
									size={25}
									color={Color.yellow}
									style={styles.footButtonIcon}
								/>
								<Text style={styles.footButtonText}>{"確認"}</Text>
							</View>
						</TouchableWithoutFeedback>
					</View>
					<View style={styles.footRightColumn}>
						<TouchableWithoutFeedback onPress={this.onPressCancelHandler}>
							<View style={styles.footButton}>
								<Icon
									name={"fontawesome|sign-out"}
									size={25}
									color={Color.yellow}
									style={styles.footButtonIcon}
								/>
								<Text style={styles.footButtonText}>{"登出"}</Text>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</View>
			</View>
		);
	}
});

module.exports = ContentArea;