var mongoose = require("mongoose");
var Promise = require("bluebird");
var validator = require("validator");
var util = require("util");
var _ = require("underscore");

var logger = require("../utilities/logger");
var error = require("../utilities/error");
var plugin = require("./plugin");

var ObjectId = mongoose.Schema.Types.ObjectId;

var EmployeeSchema = new mongoose.Schema({
	company						:{ type: ObjectId, ref: "Company" },
	name						:{ type: String, trim: true, default: "" },
	id_number					:{ type: String, trim: true, default: "" },
	serial_number				:{ type: String, trim: true, default: "" },
	passcode					:{ type: String, trim: true, default: "" },
	gender						:{ type: String, trim: true, default: "" },
	permission					:[{ type: String, trim: true, default: "" }],	// leave, manage_employee, manage_accounting
	group						:[{ type: String, trim: true, default: "" }],
	punch_record:{
		raw_record_list:[{
			datetime			:{ type: Date},
			type				:{ type: String, trim: true, default: "" }
		}]
	},
	working_record:{
		raw_record_list:[{
			datetime			:{ type: Date},
			working_item_list:[{
				title			:{ type: String, trim: true, default: "" },
				score			:{ type: Number, min: 0 }
			}]
		}]
	},
	leave:{
		quota:{
			annual_leave		:{ type: Number, min: 0, default: 0 },			// 以小時計
			annual_leave_left	:{ type: Number, min: 0, default: 0 }			// 以小時計
		},
		raw_record_list:[{
			datetime			:{ type: Date},
			approved:{
				name			:{ type: String, trim: true, default: "" },
				employee		:{ type: ObjectId, ref: "Employee" }
			},
			type				:{ type: String, trim: true, default: "" },		// personal, sick, annual
			start				:{ type: Date},
			end					:{ type: Date},
			description			:{ type: String, trim: true, default: "" }
		}]
	},
	accounting:{
		salary:{
			type					:{ type: String, trim: true, default: "" },	// wage_hour, wage_day, wage_week, salary
			value					:{ type: Number, min: 0, default: 0 }
		},
		professional_allowance		:{ type: Number, min: 0, default: 0 },		// 職務加給
		no_leave_bonus				:{ type: Number, min: 0, default: 0 },		// 全勤獎金
		travel_allowance			:{ type: Number, min: 0, default: 0 },		// 交通補貼
		holiday_bonus				:{ type: Number, min: 0, default: 0 },		// 年終獎金
		food_allowance				:{ type: Number, min: 0, default: 0 },		// 伙食補貼
		labor_insurance				:{ type: Number, min: 0, default: 0 },		// 勞保費
		health_insurance			:{ type: Number, min: 0, default: 0 }		// 健保費
	},
	thing_need_to_do:[{
		type						:{ type: String, trim: true, default: "" },	// add_working_record
		datetime					:{ type: Date }
	}],
	pay_sheet:[{
		generate_datetime			:{ type: Date },
		duration:{
			start					:{ type: Date },
			end						:{ type: Date },
		},
		title						:{ type: String, trim: true, default: "" },
		name						:{ type: String, trim: true, default: "" },
		serial_number				:{ type: String, trim: true, default: "" },
		punch_record:{
			date_record_list:[{
				date				:{ type: Date},
				working_hours:[{
					title			:{ type: String, trim: true, default: "" },
					key				:{ type: String, trim: true, default: "" },
					start_time		:{ type: Date},
					end_time		:{ type: Date},
					real_start_time	:{ type: Date},
					real_end_time	:{ type: Date}
				}],
				raw_record_list:[{
					datetime		:{ type: Date},
					type			:{ type: String, trim: true, default: "" }
				}]
			}],
			late:{
				times				:{ type: Number, min: 0, default: 0 },
				cumulative_time		:{ type: Number, min: 0, default: 0 }		// 以分鐘計
			},
			raw_record_list:[{
				datetime			:{ type: Date},
				type				:{ type: String, trim: true, default: "" }
			}]
		},
		leave:{
			quota:{
				annual_leave_left	:{ type: Number, min: 0, default: 0 }		// 以小時計
			},
			tital:{
				personal			:{ type: Number, min: 0, default: 0 },		// 以小時計
				sick				:{ type: Number, min: 0, default: 0 },		// 以小時計
				annual				:{ type: Number, min: 0, default: 0 }		// 以小時計
			},
			raw_record_list:[{
				datetime			:{ type: Date},
				approved:{
					name			:{ type: String, trim: true, default: "" },
					employee		:{ type: ObjectId, ref: "Employee" }
				},
				type				:{ type: String, trim: true, default: "" },	// personal, sick, annual
				start				:{ type: Date},
				end					:{ type: Date},
				description			:{ type: String, trim: true, default: "" }
			}]
		},
		accounting:{
			salary:{
				type				:{ type: String, trim: true, default: "" },	// wage_hour, wage_day, wage_week, salary
				value				:{ type: Number, min: 0, default: 0 }
			},
			professional_allowance	:{ type: Number, min: 0, default: 0 },		// 職務加給
			no_leave_bonus			:{ type: Number, min: 0, default: 0 },		// 全勤獎金
			travel_allowance		:{ type: Number, min: 0, default: 0 },		// 交通補貼
			holiday_bonus			:{ type: Number, min: 0, default: 0 },		// 年終獎金
			food_allowance			:{ type: Number, min: 0, default: 0 },		// 伙食補貼
			labor_insurance			:{ type: Number, min: 0, default: 0 },		// 勞保費
			health_insurance		:{ type: Number, min: 0, default: 0 },		// 健保費
			late_fines				:{ type: Number, min: 0, default: 0 }		// 遲到扣薪
		}
	}]
});

EmployeeSchema.plugin(plugin.DocumentVersionPlugin);
EmployeeSchema.plugin(plugin.ModifiedFlagPlugin);
EmployeeSchema.plugin(plugin.SaveWithPromisePlugin);
EmployeeSchema.plugin(plugin.SimplePropertyUpdatePlugin, {
	string_property:[
		"name",
		"id_number",
		"passcode",
		"gender",
		"accounting.salary.type"
	],
	number_property:[
		"leave.quota.annual_leave",
		"accounting.salary.value",
		"accounting.professional_allowance",
		"accounting.no_leave_bonus",
		"accounting.travel_allowance",
		"accounting.holiday_bonus",
		"accounting.food_allowance",
		"accounting.labor_insurance",
		"accounting.health_insurance"
	],
	array_property:[
		"permission",
		"group"
	]
});

EmployeeSchema.statics.CreateEmployee = function(property){
	var model = this;
	if(mongoose.Types.ObjectId.isValid(property.company)){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: company object id is not vaild."));
	}
	if(validator.toString(property.name) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: name is required."));
	}
	if(validator.toString(property.id_number) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: id_number is required."));
	}
	if(validator.toString(property.passcode) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: passcode is required."));
	}
	var number = Math.floor(Math.random() * 1000000000);
	var serialNumber = ("1" + (new Array(10 - number.toString().length)).join("0") + number);
	
	var resolver = Promise.defer();
	var Company = mongoose.model("Company");
	var employee;
	Promise.resolve(Company.count({
		$and: [{
			"_id": property.company
		}, {
			$or: [{
				"employee_list.id_number": property.id_number
			}, {
				"employee_list.serial_number": serialNumber
			}, {
				"employee_list.passcode": property.passcode
			}]
		}]
	}).exec()).then(function(count){
		if(count > 0){
			return resolver.reject(new error.InputPropertyNotAcceptError("Property: ID number or passcode is used."));
		}
		employee = new model({
			company: property.company,
			name: property.name,
			id_number: property.id_number,
			serial_number: serialNumber,
			passcode: property.passcode,
		});
		return employee.UpdateProperty(property);
	}).then(function(){
		resolver.resolve(employee);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});
	return resolver.promise;
}
EmployeeSchema.methods.UpdateProperty = function(property){
	var employee = this;
	return employee.UpdateSimpleProperty(property, false);
}
EmployeeSchema.methods.AddPunchRecord = function(type){
	var employee = this;
	employee.punch_record.raw_record_list.push({
		type: type,
		datetime: new Date()
	});
	if(type == "Break" || type == "OffDuty"){
		employee.thing_need_to_do.push({
			type: "add_working_record",
			datetime: new Date()
		});
	}
	return Promise.resolve();
}
EmployeeSchema.methods.AddWorkingRecord = function(company, workingItemList){
	var employee = this;
	var workingItemListToRecord = [];
	workingItemList.forEach(function(workingItem){
		if(company.IsVaildWorkingItem(workingItem.title) && workingItem.score > 0){
			workingItemListToRecord.push(workingItem);
		}
	});
	employee.working_record.raw_record_list.push({
		working_item_list: workingItemListToRecord,
		datetime: new Date()
	});
	var newThingNeedToDo = [];
	employee.thing_need_to_do.forEach(function(thingNeedToDo){
		if(thingNeedToDo.type != "add_working_record"){
			newThingNeedToDo.push(thingNeedToDo);
		}
	});
	employee.thing_need_to_do = newThingNeedToDo;
	return Promise.resolve();
}
EmployeeSchema.methods.GeneratePaySheet = function(company, startInput, endInput){
	var employee = this;
	var start = new Date(startInput);
	var end = new Date(endInput);
	if(util.isDate(start) && util.isDate(end) && end > start){
		var newPaySheet = {
			generate_datetime: new Date(),
			duration:{
				start: start,
				end: end
			},
			title: company.title + " " + start.getFullYear() + "年" + (start.getMonth() + 1) + "月" + start.getDate() + "日~" + end.getFullYear() + "年" + (end.getMonth() + 1) + "月" + end.getDate() + "日 薪資單",
			name: employee.name,
			serial_number: employee.serial_number,
			punch_record:{
				date_record_list: [],
				late:{
					times: 0,
					cumulative_time: 0
				},
				raw_record_list: []
			},
			leave:{
				quota:{
					annual_leave_left: employee.leave.quota.annual_leave_left
				},
				tital:{
					personal: 0,
					sick: 0,
					annual: 0,
				},
				raw_record_list:[]
			},
			accounting: employee.accounting
		};
		newPaySheet.accounting.late_fines = 0;
		end.setDate(end.getDate() + 1);
		
		employee.punch_record.raw_record_list.forEach(function(rawRecord){
			if(rawRecord.datetime >= start && rawRecord.datetime < end){
				newPaySheet.punch_record.raw_record_list.push(rawRecord);
			}
		});

		var rawRecordList = newPaySheet.punch_record.raw_record_list.slice(0);
		var dateRecordDateSeed = new Date(start);
		var dateRecordWorkingHoursEndTimeSeed = new Date(dateRecordDateSeed.getTime() + ((86400000 + company.working_hours[0].start + company.working_hours[company.working_hours.length - 1].end) / 2));
		do{
			var newDateRecord = {
				date: new Date(dateRecordDateSeed),
				working_hours: [],
				raw_record_list: []
			}
			company.working_hours.forEach(function(workingHours){
				newDateRecord.working_hours.push({
					title: workingHours.title,
					key: workingHours.key,
					start_time: new Date(newDateRecord.date.getTime() + workingHours.start),
					end_time: new Date(newDateRecord.date.getTime() + workingHours.end)
				});
			});
			var i = rawRecordList.length;
			while (i--) {
				if(rawRecordList[i].datetime < dateRecordWorkingHoursEndTimeSeed){
					var rawRecord = rawRecordList.splice(i, 1)[0];
					
					newDateRecord.raw_record_list.push(rawRecord);
					// logger.debug(JSON.stringify(newDateRecord));
					
					var currentDelta = 86400000;
					var currentKey = "";
					newDateRecord.working_hours.forEach(function(workingHour){
						var delta = 86400000;
						switch(rawRecord.type){
							case "OnDuty":
								delta = Math.abs(workingHour.start_time - rawRecord.datetime);
								break;
							case "Break":
							case "OffDuty":
								delta = Math.abs(workingHour.end_time - rawRecord.datetime);
								break;
						}
						if(delta < currentDelta){
							currentDelta = delta;
							currentKey = workingHour.key;
						}
					});
					newDateRecord.working_hours.some(function(workingHour){
						if(workingHour.key == currentKey){
							switch(rawRecord.type){
								case "OnDuty":
									workingHour.real_start_time = rawRecord.datetime;
									break;
								case "Break":
								case "OffDuty":
									workingHour.real_end_time = rawRecord.datetime;
									break;
							}
							return true;
						}
					});
				}
			}
			newPaySheet.punch_record.date_record_list.push(newDateRecord);
			// logger.debug(JSON.stringify(newDateRecord));
			dateRecordDateSeed.setDate(dateRecordDateSeed.getDate() + 1);
			dateRecordWorkingHoursEndTimeSeed.setDate(dateRecordWorkingHoursEndTimeSeed.getDate() + 1);
		} while(dateRecordWorkingHoursEndTimeSeed < end);
		logger.warn("Employee finish");
		employee.pay_sheet.push(newPaySheet);
		return Promise.resolve();
	}
	else{
		return Promise.reject(new error.InputPropertyNotAcceptError("End time must later then start time."));
	}
}

//Mongoose Register
exports = module.exports = mongoose.model("Employee", EmployeeSchema);
// exports = module.exports = EmployeeSchema;
