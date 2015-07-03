var AppDispatcher = require("./dispatcher");
var Constant = require("./constant");
var ErrorDefinition = require("../basic/error_definition");
var CompanyStore = require("./company_store");
var EmployeeStore = require("./employee_store");
var WorkingRecordStore = require("./working_record_store");
var API = require("./ldsm_api");

var BasicAction = {
	// Basic
	companyCheckLogin: function(){
		API.checkCompanyLogin().then(function(companyId){
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOGIN_COMPANY_CACHE_SUCCESS,
				data: {
					companyId: companyId
				}
			});
			// Tranmit property because this is not sync
			Action.loadCompany(companyId);
			Action.addDebugMessage("Set currentLoginCompanyID: " + companyId);
		}).catch(ErrorDefinition.NotExistError, function(){
			Action.addMessage("Current not login, please login by company username and password.");
			Action.companyLogout();
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOGIN_COMPANY_CACHE_FAIL,
			});
		}).catch(function(err){
			Action.addError(err);
			Action.companyLogout();
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOGIN_COMPANY_CACHE_FAIL,
			});
		});
	},
	companyLogin: function(username, password){
		API.loginCompany(username, password).then(function(companyId){
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOGIN_COMPANY_BACKEND_SUCCESS,
				data: {
					companyId: companyId
				}
			});
			Action.loadCompany(companyId);
			Action.addDebugMessage("Set currentLoginCompanyID: " + companyId);
		}).catch(function(err){
			Action.addError(err);
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOGIN_COMPANY_BACKEND_FAIL,
			});
		});
	},
	companyLogout: function(){
		console.log("companyLogout");
		AppDispatcher.handleViewAction({
			actionType: Constant.LOGOUT_COMPANY,
			data: null,
		});
		API.logoutCompany().then(function(){
			MessageAction.addDebugMessage("Clear cache data success");
		}).catch(function(err){
			MessageAction.addError(err);
		});
	},
	loadCompany: function(companyId){
		// Tranmit property because this is not sync
		API.loadCompany(companyId).then(function(company){
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOAD_COMPANY_BACKEND_SUCCESS,
				data: {
					company: company
				}
			});
			Action.addDebugMessage("Load company data success: " + company.title);
		}).catch(function(err){
			MessageAction.addError(err);
			Action.companyLogout();
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOAD_COMPANY_BACKEND_FAIL,
			});
		});
	},
	createEmployee: function(name, idNumber, passcode, permission, avatar){
		MessageAction.addMessage("Start create employee: " + name);
		var companyId = CompanyStore.getCurrentLoginCompanyID();
		API.createEmployee(companyId, name, idNumber, passcode, permission, avatar).then(function(employee){
			Action.loadCompany(companyId);
		}).catch(function(err){
			MessageAction.addError(err);
			AppDispatcher.handleRequestAction({
				actionType: Constant.CREATE_EMPLOYEE_BACKEND_FAIL,
			});
		});
	},
	employeeLogin: function(employeeIdOrPasscode){
		var company = CompanyStore.getCompany();
		console.log("1");
		var employeeList = CompanyStore.getEmployeeList();
		if(employeeList){
			console.log("2");
			var resultEmployee = null;
			var found = employeeList.some(function(employee){
				if(employee._id == employeeIdOrPasscode || employee.passcode == employeeIdOrPasscode){
					resultEmployee = employee;
					return true;
				}
			});
			console.log("3");
			if(found){
				console.log("4");
				return API.loadEmployee(company, resultEmployee._id).then(function(employee){
					console.log("5");
					AppDispatcher.handleRequestAction({
						actionType: Constant.LOGIN_EMPLOYEE_BACKEND_SUCCESS,
						data:{
							employee: employee
						},
					});
					MessageAction.addMessage(employee.name + " login success.");
				}).catch(function(err){
					console.log(err.message);
					console.log(err.stack);

					MessageAction.addError(err);
				});
			}
		}
		MessageAction.addError(new ErrorDefinition.NotExistError("Employee not found."));
	},
	employeeLogout: function(){
		AppDispatcher.handleViewAction({
			actionType: Constant.EMPLOYEE_LOGOUT,
			data: null,
		});
	},
	addTimePunchRecord: function(type){
		var companyId = CompanyStore.getCurrentLoginCompanyID();
		var employee = EmployeeStore.getCurrentLoginEmployee();
		API.addTimePunchRecord(companyId, employee._id, type).then(function(employee){
			Action.loadCompany(companyId);
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOAD_EMPLOYEE_BACKEND_SUCCESS,
				data: {
					employee: employee
				}
			});
			MessageAction.addMessage(employee.name + " add time punch record success.");
		}).catch(function(err){
			MessageAction.addError(err);
		});
	},
	addWorkingRecord: function(){
		var companyId = CompanyStore.getCurrentLoginCompanyID();
		var employee = EmployeeStore.getCurrentLoginEmployee();
		var workingItemToAddList = WorkingRecordStore.getWorkingItemToAddList();
		API.addWorkingRecord(companyId, employee._id, workingItemToAddList).then(function(employee){
			Action.loadCompany(companyId);
			AppDispatcher.handleRequestAction({
				actionType: Constant.LOAD_EMPLOYEE_BACKEND_SUCCESS,
				data: {
					employee: employee
				}
			});
			MessageAction.addMessage(employee.name + " add working record success.");
		}).catch(function(err){
			MessageAction.addError(err);
		});
	},
	addCurrentWorkingItem: function(title, point){
		AppDispatcher.handleRequestAction({
			actionType: Constant.ADD_CURRENT_WORKING_ITEM,
			data: {
				title: title,
				point: point,
			}
		});
	},
}

var MessageAction = {
	addError: function(err){
		AppDispatcher.handleViewAction({
			actionType: Constant.ADD_ERROR,
			data: {
				error: err,
			},
		});
	},
	clearError: function(index){
		AppDispatcher.handleViewAction({
			actionType: Constant.CLEAR_ERROR,
			data: {
				index: index,
			},
		});
	},
	addDebugMessage: function(message){
		AppDispatcher.handleViewAction({
			actionType: Constant.ADD_MESSAGE,
			data: {
				message: message,
			},
		});
	},
	addMessage: function(message){
		AppDispatcher.handleViewAction({
			actionType: Constant.ADD_MESSAGE,
			data: {
				message: message,
			},
		});
	},
	clearMessage: function(index){
		AppDispatcher.handleViewAction({
			actionType: Constant.CLEAR_MESSAGE,
			data: {
				index: index,
			},
		});
	},
}

var PanelAction = {
	showCreateEmployeePanel: function(){
		AppDispatcher.handleViewAction({
			actionType: Constant.SHOW_CREATE_EMPLOYEE_PANEL,
			data: null,
		});
	},
	hidePanel: function(){
		AppDispatcher.handleViewAction({
			actionType: Constant.HIDE_PANEL,
			data: null,
		});
	},
}

var Action = Object.assign({}, BasicAction, MessageAction, PanelAction);

module.exports = Action;