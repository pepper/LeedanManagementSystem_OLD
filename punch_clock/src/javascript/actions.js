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
	},
	addPunchRecord: function(companyId, employeeId, type){
		reqwest({
			url: "/api/company/" + companyId + "/employee/" + employeeId + "/punch_record",
			type: "json",
			method: "post",
			data: {
				type: type
			}
		}).then(function(res){
			if(res.objects[0]){
				res.objects[0].type = type;
				this.dispatch(Constants.ADD_PUNCH_RECORD_SUCCESS, res.objects[0]);
			}
			else{
				throw new Error("No response");
			}
		}.bind(this), function(err, message){
			console.error(err);
			alert(message);
		}.bind(this));
	},
	createEmptyWorkingItemList: function(){
		this.dispatch(Constants.CREATE_EMPTY_WORKING_ITEM_LIST);
	},
	changeWorkingItemScore: function(type, score){
		this.dispatch(Constants.CHANGE_WORKING_ITEM_SCORE, {
			title: type,
			score: score
		});
	},
	addWorkingItemList: function(companyId, employeeId, workingItemList){
		var data = {
			working_item_list: workingItemList
		};
		console.log(JSON.stringify(data));
		reqwest({
			url: "/api/company/" + companyId + "/employee/" + employeeId + "/working_record",
			type: "json",
			method: "post",
			contentType: "application/json",
			data: JSON.stringify(data)
		}).then(function(res){
			if(res.objects[0]){
				this.dispatch(Constants.ADD_WORKING_ITEM_LIST_SUCCESS, res.objects[0]);
			}
			else{
				throw new Error("No response");
			}
		}.bind(this), function(err, message){
			console.error(err.message);
			alert(err.message);
		}.bind(this));
	}
}

module.exports = actions;