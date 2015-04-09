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
			Constants.LOGOUT_EMPLOYEE, this.onLogoutEmployee,

			Constants.ADD_PUNCH_RECORD_SUCCESS, this.onAddPunchRecordSuccess,

			Constants.CREATE_EMPTY_WORKING_ITEM_LIST, this.onCreateEmptyWorkingItemList,
			Constants.CHANGE_WORKING_ITEM_SCORE, this.onChangeWorkingItemScore,
			Constants.ADD_WORKING_ITEM_LIST_SUCCESS, this.onAddPunchRecordSuccess
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
		this.recalaculateEmployeeList();
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
	},
	onAddPunchRecordSuccess: function(newEmployee){
		this.company.employee_list = this.company.employee_list.map(function(employee){
			if(employee._id == newEmployee._id){
				return newEmployee;
			}
			return employee;
		});
		this.recalaculateEmployeeList();
		this.emit("change");
	},
	onCreateEmptyWorkingItemList: function(){
		if(this.employee){
			var total = [];
			var lastModified = null;
			var today = new Date();
			this.employee.todayTotal = 0;
			var currentEmployee = this.employee;
			this.employee.working_record.raw_record_list.forEach(function(rawRecord){
				var datetime = new Date(rawRecord.datetime);
				if(lastModified == null || datetime > lastModified){
					lastModified = datetime;
				}
				rawRecord.working_item_list.forEach(function(workingItem){
					if(total[workingItem.title]){
						total[workingItem.title] += workingItem.score;
					}
					else{
						total[workingItem.title] = workingItem.score;
					}
					if(today.toDateString() == datetime.toDateString()){
						currentEmployee.todayTotal += workingItem.score;
					}
				});
			});
			this.employee.newWorkingItemList = this.company.working_item_list.map(function(workingItem){
				return {
					key: (new Date()).toString() + workingItem.title,
					title: workingItem.title,
					score: 0,
					total: (total[workingItem.title])?total[workingItem.title]:0,
					lastModified: (lastModified)?lastModified:new Date(2000, 0, 1)
				};
			});
			this.emit("change");
		}
	},
	onChangeWorkingItemScore: function(workingItem){
		if(this.employee && this.employee.newWorkingItemList){
			var found = this.employee.newWorkingItemList.some(function(newWorkingItem){
				if(newWorkingItem.title == workingItem.title){
					newWorkingItem.score = workingItem.score;
					return true;
				}
			});
			if(found){
				this.emit("change");
			}
		}
	},


	recalaculateEmployeeList: function(){
		this.company.employee_list.forEach(function(employee){
			employee.totalScore = 0;
			employee.working_record.raw_record_list.forEach(function(rawRecord){
				rawRecord.working_item_list.forEach(function(workingItem){
					employee.totalScore += workingItem.score;
				});
			});
		});
	}
});

module.exports = CompanyStore;