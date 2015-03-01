"use strict";

var reqwest = require("reqwest");

var Constants = require("./constants");

var actions = {
	loadCompany: function(){
		this.dispatch(Constants.LOAD_COMPANY);
		reqwest({
			url: "/api/company",
			type: "json"
		}).then(function(res){
			this.dispatch(Constants.LOAD_COMPANY_SUCCESS, res.objects[0]);
		}.bind(this), function(err, message){
			console.error(err);
			this.dispatch(Constants.LOAD_COMPANY_FAIL, err);
		}.bind(this));
	},
	loginEmployee: function(passcode){
		this.dispatch(Constants.LOGIN_EMPLOYEE, passcode);
	},
	logoutEmployee: function(){
		this.dispatch(Constants.LOGOUT_EMPLOYEE);
	}
}

module.exports = actions;