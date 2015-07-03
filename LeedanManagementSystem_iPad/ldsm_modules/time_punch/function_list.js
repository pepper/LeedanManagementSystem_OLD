"use strict";

var React = require("react-native");

var Action = require("../model/action");

var Title = require("../function_list/title");
var IconItem = require("../function_list/icon_item");
var IconButton = require("../function_list/icon_button");
var EmployeeList = require("../function_list/employee_list");
var Empty = require("../function_list/empty")

var Styles = require("./style");

var {
	View,
	ListView,
	AlertIOS,
} = React;

var styles = Styles.ios;

var FunctionList = React.createClass({
	getInitialState: function(){
		return {
			manage_employee: null,
			manage_leave: null,
			no_manage_employee: false,
		}
	},
	componentWillReceiveProps: function(nextProps){
		var newState = {
			no_manage_employee: false,
			manage_employee: null,
			manage_leave: null,
		};

		// Get employee list
		if(nextProps.employeeList){
			var found = nextProps.employeeList.some(function(employee){
				if(employee.permission.indexOf("manage_employee") >= 0){
					return true;
				}
			});
			if(!found){
				newState.no_manage_employee = true;
			}
		}

		// Get current login employee
		var employee = nextProps.loginEmployee;
		if(employee){
			employee.permission.forEach(function(permission){
				if(permission == "manage_leave"){
					newState.manage_leave = true;
				}
				if(permission == "manage_employee"){
					newState.manage_employee = true;
				}
			});
		}
		this.setState(newState);
	},
	render: function(){
		var addEmployeeButton;
		if(this.state.manage_employee || this.state.no_manage_employee){
			addEmployeeButton = (
				<IconButton icon="plus-circle" text="新增員工" onPress={() => Action.showCreateEmployeePanel()}/>
			)
		}
		var manageEmployeeButton;
		if(this.state.manage_employee){
			manageEmployeeButton = (
				<View>
					<IconButton icon="cogs" text="打卡模組設定" onPress={() => AlertIOS.alert(
						"功能尚未開通",
						"未來可以使用此區塊設定正常上下班時間",
					)}/>
					<IconButton icon="users" text="員工資料管理" onPress={() => AlertIOS.alert(
						"功能尚未開通",
						"未來可以使用此區塊編輯員工基本資料",
					)}/>
				</View>
			)
		}
		var leaveButton;
		if(this.state.manage_leave){
			leaveButton = (
				<IconButton icon="clock-o" text="請假寫入" />
			)
		}
		return (
			<View style={styles.functionListContainer}>
				<Title leftColumn="員工列表" rightColumn="總積分" />
				{manageEmployeeButton}
				{addEmployeeButton}
				{leaveButton}
				<EmployeeList employeeList={this.props.employeeList} loginEmployee={this.props.loginEmployee} />
			</View>
		);
	}
});

module.exports = FunctionList;