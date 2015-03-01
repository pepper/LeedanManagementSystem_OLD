"use strict";

var Fluxxor = require("fluxxor");
var _ = require("underscore");
var Constants = require("../constants");

var CompanyStore = Fluxxor.createStore({
	initialize: function(){
		this.loading = false;
		this.error = null;
		this.company = null;
		this.employee = null;
		this.bindActions(
			Constants.LOAD_COMPANY, this.onLoadCompany,
			Constants.LOAD_COMPANY_SUCCESS, this.onLoadCompanySuccess,
			Constants.LOAD_COMPANY_FAIL, this.onLoadCompanyFail,

			Constants.LOGIN_EMPLOYEE, this.onLoginEmployee,
			Constants.LOGOUT_EMPLOYEE, this.onLogoutEmployee
		);
	},
	onLoadCompany: function(){
		this.loading = true;
		this.emit("change");
	},
	onLoadCompanySuccess: function(company){
		this.loading = false;
		this.error = null;
		this.company = company;
		this.emit("change");
	},
	onLoadCompanyFail: function(err){
		this.loading = false;
		this.error = err;
		console.error(err);
		this.emit("change");
	},
	onLoginEmployee: function(passcode){
		var found = this.company.employee_list.some(function(employee){
			if(employee.passcode == passcode){
				this.employee = employee;
				return true;
			}
		}.bind(this));
		if(!found){
			this.employee = null;
		}
		this.emit("change");
	},
	onLogoutEmployee: function(){
		this.employee = null;
		this.emit("change");
	}
});

module.exports = CompanyStore;