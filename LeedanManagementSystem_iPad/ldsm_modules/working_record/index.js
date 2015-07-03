"use strict";

var React = require("react-native");

var CompanyStore = require("../model/company_store");
var EmployeeStore = require("../model/employee_store");

var Styles = require("./style");
var FunctionList = require("./function_list");
var ContentArea = require("./content_area");

var {
	StyleSheet,
	Text,
	Image,
	View,
	ScrollView,
	ListView,
	TouchableWithoutFeedback,
} = React;

var styles = Styles.ios;

var WorkingRecord = React.createClass({
	getInitialState: function(){
		return {
			login_employee: null,
			employee_list: [],
		}
	},
	componentDidMount: function(){
		CompanyStore.addChangeListener(this.onStoreChange);
		EmployeeStore.addChangeListener(this.onStoreChange);
		this.onStoreChange();
	},
	componentWillUnmount: function() {
		CompanyStore.removeChangeListener(this.onStoreChange);
		EmployeeStore.removeChangeListener(this.onStoreChange);
	},
	onStoreChange: function(){
		var newState = {
			employee_list: [],
			login_employee: false,
		};

		// Get employee list
		var employeeList = CompanyStore.getEmployeeList();
		if(employeeList){
			newState = {
				employee_list: employeeList,
			};
		}

		// Get current login employee
		var employee = EmployeeStore.getCurrentLoginEmployee();
		if(employee){
			newState.login_employee = employee;
		}
		this.replaceState(newState);
	},
	render: function(){
		return (
			<View style={styles.mainContainer}>
				<FunctionList employeeList={this.state.employee_list} loginEmployee={this.state.login_employee} />
				<ContentArea />
			</View>
		)
	}
});

module.exports = WorkingRecord;