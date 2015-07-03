var React = require("react-native");

var ErrorDefinition = require("../basic/error_definition");

var AppDispatcher = require("./dispatcher");
var Constant = require("./constant");
var EventEmitter = require("events").EventEmitter;

var companyWorkingItemList = [];
// var todayEmployeeWorkingRecordList = [];
// var todayEmployeeWorkingItem = {};
var todayEmployeeWorkingItemList = [];
var totalScore = 0;
var workingItemToAddList = [];

var WorkingRecordStore = Object.assign({}, EventEmitter.prototype, {
	getCompanyWorkingItemList: function(){
		return companyWorkingItemList;
	},
	getTodayEmployeeWorkingItemList: function(){
		return todayEmployeeWorkingItemList;
	},
	getTotalScore: function(){
		return totalScore;
	},
	getWorkingItemToAddList: function(){
		return workingItemToAddList;
	},
	// getTodayEmployeeWorkingRecordList: function(){
	// 	return todayEmployeeWorkingRecordList;
	// },
	// getTodayEmployeeWorkingItem: function(title){
	// 	return todayEmployeeWorkingItem[title];
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

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType) {
		case Constant.LOAD_COMPANY_BACKEND_SUCCESS:
			companyWorkingItemList = action.data.company.working_record.working_item_list;
			break;
		case Constant.LOGIN_EMPLOYEE_BACKEND_SUCCESS:
		case Constant.LOAD_EMPLOYEE_BACKEND_SUCCESS:
			var currentLoginEmployee = action.data.employee;
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);
			var nextday = new Date(today);
			nextday.setHours(24);

			todayEmployeeWorkingItemList = companyWorkingItemList.map(function(workingItem){
				workingItem.point_list = [];
				workingItem.total_point = 0;
				return workingItem;
			});
			currentLoginEmployee.working_record.record_list.forEach(function(record){
				if(record.datetime >= today && record.datetime < nextday){
					record.working_item_list.forEach(function(employeeWorkingItem){
						if(employeeWorkingItem.point != 0){
							todayEmployeeWorkingItemList.some(function(workingItem){
								if(employeeWorkingItem.title == workingItem.title){
									workingItem.point_list.push(employeeWorkingItem.point);
									return true;
								}
							});
						}
					});
				}
			});
			todayEmployeeWorkingItemList.forEach(function(workingItem){
				currentLoginEmployee.working_record.statistics.working_item.some(function(statisticsWorkingItem){
					if(workingItem.title == statisticsWorkingItem.title){
						workingItem.total_point = statisticsWorkingItem.total_point;
						return true;
					}
				});
			});
			totalScore = currentLoginEmployee.working_record.total_score;
			break;
		case Constant.EMPLOYEE_LOGOUT:
			todayEmployeeWorkingRecordList = [];
			break;
		case Constant.ADD_CURRENT_WORKING_ITEM:
			var found = workingItemToAddList.some(function(workingItemToAdd){
				if(workingItemToAdd.title == action.data.title){
					workingItemToAdd.point = action.data.point;
					return true;
				}
			});
			if(!found){
				workingItemToAddList.push({
					title: action.data.title,
					point: action.data.point,
				});
			}
			break;
		case Constant.LOGOUT_COMPANY:
		case Constant.LOGIN_COMPANY_BACKEND_FAIL:
		case Constant.LOGIN_COMPANY_CACHE_FAIL:
		case Constant.LOAD_COMPANY_BACKEND_FAIL:
			companyWorkingItemList = [];
			todayEmployeeWorkingItemList = [];
			workingItemToAddList = [];
			var totalScore = 0;
			break;
		default:
			return true;
	}
	WorkingRecordStore.emitChange();
	return true;
});

module.exports = WorkingRecordStore;