var React = require("react-native");

var ErrorDefinition = require("../basic/error_definition");

var AppDispatcher = require("./dispatcher");
var Constant = require("./constant");
var EventEmitter = require("events").EventEmitter;

var currentLoginCompanyID = null;
var currentCompany = null;
var currentLoginEmployee = null;

var CompanyStore = Object.assign({}, EventEmitter.prototype, {
	getCurrentLoginCompanyID: function(){
		return currentLoginCompanyID;
	},
	getCompany: function(){
		return currentCompany;
	},
	getEmployeeList: function(){
		if(currentCompany){
			return currentCompany.employee_list;
		}
		else{
			return null;
		}
	},
	// getWorkingItemList: function(){
	// 	if(currentCompany && currentCompany.working_record){
	// 		return currentCompany.working_record.working_item_list;
	// 	}
	// 	else{
	// 		return [];
	// 	}
	// },
	emitChange: function() {
		this.emit("change");
	},
	addChangeListener: function(callback) {
		this.on("change", callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener("change", callback);
	}
});

var logoutCompany = function(){
	currentLoginCompanyID = null;
	currentCompany = null;
	currentLoginEmployee = null;
}

AppDispatcher.register(function(payload){
	var action = payload.action;
	console.log("[" + action.actionType + "]");
	switch(action.actionType) {
		case Constant.LOGIN_COMPANY_CACHE_SUCCESS:
		case Constant.LOGIN_COMPANY_BACKEND_SUCCESS:
			currentLoginCompanyID = action.data.companyId;
			break;
		case Constant.LOAD_COMPANY_BACKEND_SUCCESS:
			company = action.data.company;
			currentCompany = company;
			break;
		case Constant.LOGOUT_COMPANY:
		case Constant.LOGIN_COMPANY_BACKEND_FAIL:
		case Constant.LOGIN_COMPANY_CACHE_FAIL:
		case Constant.LOAD_COMPANY_BACKEND_FAIL:
			logoutCompany();
			break;
		default:
			return true;
	}
	CompanyStore.emitChange();
	return true;
});

module.exports = CompanyStore;