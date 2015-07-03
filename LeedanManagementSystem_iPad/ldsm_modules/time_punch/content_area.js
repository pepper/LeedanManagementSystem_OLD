"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");

var Constant = require("../model/constant");
var Action = require("../model/action");

var Keypad = require("./keypad");

var Styles = require("./style");

var {
	Text,
	View,
	ListView,
	TouchableWithoutFeedback,
	AlertIOS,
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
	keyPress: function(key){
		switch(this.state.keypad_mode){
			case "login":
				this.state.current_input + key;
				if((this.state.current_input + key).length == 8){
					Action.employeeLogin(this.state.current_input + key);
					this.setState({
						current_input: "",
					});
				}
				else{
					this.setState({
						current_input: this.state.current_input + key,
					});
				}
				break;
			case "leave_manager":
				// break;
			case "employee":
				switch(key){
					case "上班":
						Action.addTimePunchRecord(Constant.TIME_PUNCH_ON_DUTY);
						break;
					case "下班":
						Action.addTimePunchRecord(Constant.TIME_PUNCH_OFF_DUTY);
						break;
					case "休息":
						Action.addTimePunchRecord(Constant.TIME_PUNCH_BREAK);
						break;
					case "訂餐":
						AlertIOS.alert(
							"功能尚未開通",
							"您不具備所點擊的功能操作權限，或是該功能尚未開通",
						);
						break;
				}
				break;
		}
	},
	componentWillReceiveProps: function(nextProps){
		var employee = nextProps.loginEmployee;
		if(employee){
			var managePermissionFound = employee.permission.some(function(permission){
				if(permission == "manage_leave"){
					this.setState({
						keypad_mode: "leave_manager",
					});
					return true;
				}
			}.bind(this));
			if(!managePermissionFound){
				this.setState({
					keypad_mode: "employee",
				});
			}
		}
		else{
			this.setState({
				keypad_mode: "login",
			});
		}
	},
	onLogoutPressHandler: function(){
		Action.employeeLogout();
	},
	render: function(){
		return (
			<View style={styles.contentArea}>
				<View style={styles.headArea}>
					<Text style={styles.status}>{"輸入帳號：" + this.state.current_input}</Text>
				</View>
				<Keypad mode={this.state.keypad_mode} callback={this.keyPress}></Keypad>
				<View style={styles.logoutContainer}>
					<Icon
						name={"fontawesome|sign-out"}
						size={22}
						color={Color.yellow}
						style={styles.logoutIcon}
					/>
					<TouchableWithoutFeedback onPress={this.onLogoutPressHandler}>
						<Text style={styles.logoutText}>登出</Text>
					</TouchableWithoutFeedback>
				</View>
			</View>
		);
	}
});

module.exports = ContentArea;