var mongoose = require("mongoose");
var util = require("util");
var Promise = require("bluebird");

var basicPlugin = require("./basic");

exports.WorkingRecordPluginForCompany = function(schema, options){
	schema.plugin(basicPlugin.SaveWithPromisePlugin);
	schema.add({
		// Working Record
		working_record:{
			working_item_list:[{
				title					:{ type: String, trim: true, default: "" },
				score					:{ type: Number },
			}]
		}
	});
	schema.methods.UpdateWorkingRecordProperty = function(property, save){
		var instance = this;
		if(property.working_record && util.isArray(property.working_record.working_item_list)){
			var needUpdateArray = false;
			var newWorkingItemArray = [];
			property.working_record.working_item_list.forEach(function(newWorkingItem){
				var found = instance.working_record.working_item_list.some(function(workingItem){
					if(workingItem.title == newWorkingItem.title){
						newWorkingItemArray.push(workingItem);
						return true;
					}
				});
				if(!found){
					newWorkingItemArray.push(newWorkingItem);
					needUpdateArray = true;
				}
			});
			if(needUpdateArray){
				instance.working_record.working_item_list = newWorkingItemArray;
			}
		}
		return instance.SaveWithPromise(save);
	}
	schema.methods.IsVaildWorkingItem = function(title){
		var instance = this;
		var foundWorkingItem = null;
		var found = instance.working_record.working_item_list.some(function(workingItem){
			if(workingItem.title == title){
				foundWorkingItem = workingItem;
				return true;
			}
		});
		return foundWorkingItem;
	}
}

exports.WorkingRecordPluginForEmployee = function(schema, options){
	schema.plugin(basicPlugin.SaveWithPromisePlugin);
	schema.add({
		working_record:{
			record_list:[{
				datetime				:{ type: Date},
				working_item_list:[{
					title				:{ type: String, trim: true, default: "" },
					point				:{ type: Number, min: 0, default: 0 },
					score				:{ type: Number, min: 0, default: 0 },
				}],
				total_point				:{ type: Number, min: 0, default: 0 },
				total_score				:{ type: Number, min: 0, default: 0 },
			}],
			statistics:{
				working_item:[{
					title				:{ type: String, trim: true, default: "" },
					total_point			:{ type: Number, min: 0, default: 0 },
					total_score			:{ type: Number, min: 0, default: 0 },
				}],
				total_point				:{ type: Number, min: 0, default: 0 },
				total_score				:{ type: Number, min: 0, default: 0 },
			}
		},
	});

	schema.methods.AddWorkingRecord = function(company, workingItemList, save){
		var instance = this;
		var workingItemListToRecord = [];
		var total_point = 0;
		var total_score = 0;
		workingItemList.forEach(function(workingItem){
			companyWorkingItem = company.IsVaildWorkingItem(workingItem.title);
			if(companyWorkingItem && workingItem.point > 0){
				workingItem.score = companyWorkingItem.score * workingItem.point;
				workingItemListToRecord.push(workingItem);
				total_point += workingItem.point;
				total_score += workingItem.score;
				var found = instance.working_record.statistics.working_item.some(function(statisticsWorkingItem){
					if(statisticsWorkingItem.title == workingItem.title){
						statisticsWorkingItem.total_point += workingItem.point;
						statisticsWorkingItem.total_score += workingItem.score;
						return true;
					}
				});
				if(!found){
					instance.working_record.statistics.working_item.push({
						title: workingItem.title,
						total_point: workingItem.point,
						total_score: workingItem.score,
					});
				}
			}
		});
		instance.working_record.record_list.push({
			working_item_list: workingItemListToRecord,
			datetime: new Date()
		});
		instance.working_record.statistics.total_point += total_point;
		instance.working_record.statistics.total_score += total_score;
		// var newThingNeedToDo = [];
		// instance.thing_need_to_do.forEach(function(thingNeedToDo){
		// 	if(thingNeedToDo.type != "add_working_record"){
		// 		newThingNeedToDo.push(thingNeedToDo);
		// 	}
		// });
		// instance.thing_need_to_do = newThingNeedToDo;
		return instance.SaveWithPromise(save);
	}
}