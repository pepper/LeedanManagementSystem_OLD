"use strict";


var AppDispatcher = require("../model/dispatcher");
var Constant = require("../model/constant");
var EventEmitter = require("events").EventEmitter;

var TimePunch = require("../time_punch/index");
var WorkingRecord = require("../working_record/index");

var currentModuleList = [];

var ModuleStore = Object.assign({}, EventEmitter.prototype, {
	getCurrentModuleList: function(){
		return currentModuleList;
	},
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
			company = action.data.company;
			if(company.avtive_module && company.avtive_module.length > 0){
				currentModuleList = [];
				company.avtive_module.forEach(function(avtiveModule){
					switch(avtiveModule){
						case "time_punch":
							currentModuleList.push({
								id: "time_punch",
								icon: "bell-o",
								text: "Time Punch",
								view: <TimePunch />,
							});
							break;
						case "working_record":
							currentModuleList.push({
								id: "working_record",
								icon: "dashboard",
								text: "Working Record",
								view: <WorkingRecord />,
							});
							break;
						case "account":
							currentModuleList.push({
								id: "account",
								icon: "dollar",
								text: "Account",
								view: null,
							});
							break;
						case "ordering":
							currentModuleList.push({
								id: "ordering",
								icon: "cutlery",
								text: "Ordering",
								view: null,
							});
							break;
					}
				});
			}
			break;
		default:
			return true;
	}
	ModuleStore.emitChange();
	return true;
});

module.exports = ModuleStore;