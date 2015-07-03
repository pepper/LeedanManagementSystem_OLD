var React = require("react-native");

var AppDispatcher = require("./dispatcher");
var Constant = require("./constant");
var EventEmitter = require("events").EventEmitter;

var currentLoginEmployee = null;

var EmployeeStore = Object.assign({}, EventEmitter.prototype, {
	getCurrentLoginEmployee: function(){
		return currentLoginEmployee;
	},

	emitChange: function() {
		this.emit("change");
	},
	addChangeListener: function(callback) {
		this.on("change", callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener("change", callback);
	},
});

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType){
		case Constant.LOGIN_EMPLOYEE_BACKEND_SUCCESS:
		case Constant.LOAD_EMPLOYEE_BACKEND_SUCCESS:
			currentLoginEmployee = action.data.employee;
			break;
		case Constant.EMPLOYEE_LOGOUT:
			currentLoginEmployee = null;
			break;
		default:
			return true;
	}
	EmployeeStore.emitChange();
	return true;
});

module.exports = EmployeeStore;