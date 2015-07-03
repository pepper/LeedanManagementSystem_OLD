"use strict";

var React = require("react-native");
var CompanyStore = require("../model/company_store");

var Title = require("../function_list/title");
var IconItem = require("../function_list/icon_item");
var IconButton = require("../function_list/icon_button");
var Employee = require("../function_list/employee");
var EmployeeList = require("../function_list/employee_list");
var Empty = require("../function_list/empty");

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
			login_employee: null,
			login_administrator: null,
			employee_list: CompanyStore.getEmployeeList(),
		}
	},
	componentWillReceiveProps: function(nextProps){
		// var newState = {
		// 	no_manage_employee: false,
		// 	manage_employee: null,
		// 	manage_leave: null,
		// };

		// // Get employee list
		// if(nextProps.employeeList){
		// 	var found = nextProps.employeeList.some(function(employee){
		// 		if(employee.permission.indexOf("manage_employee") >= 0){
		// 			return true;
		// 		}
		// 	});
		// 	if(!found){
		// 		newState.no_manage_employee = true;
		// 	}
		// }

		// // Get current login employee
		// var employee = nextProps.loginEmployee;
		// if(employee){
		// 	employee.permission.forEach(function(permission){
		// 		if(permission == "manage_leave"){
		// 			newState.manage_leave = true;
		// 		}
		// 		if(permission == "manage_employee"){
		// 			newState.manage_employee = true;
		// 		}
		// 	});
		// }
		// this.setState(newState);
	},
	render: function(){
		return (
			<View style={styles.functionListContainer}>
				<Title leftColumn="員工列表" rightColumn="總積分" />
				<IconButton icon="th-list" text="工作項目紀錄" />
				<IconButton icon="line-chart" text="工作記錄圖表" />
				<EmployeeList employeeList={this.props.employeeList} loginEmployee={this.props.loginEmployee} />
			</View>
		);
	}
});

module.exports = FunctionList;