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
	permission					:[{ type: String, trim: true, default: "" }], // leave, manage_employee
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
			annual_leave		:{ type: Number, min: 0, default: 0 },
		},
		raw_record_list:[{
			datetime			:{ type: Date},
			approved:{
				name			:{ type: String, trim: true, default: "" },
				employee		:{ type: ObjectId, ref: "Employee" }
			},
			type				:{ type: String, trim: true, default: "" }, // personal, sick, annual
			start				:{ type: Date},
			end					:{ type: Date},
			description			:{ type: String, trim: true, default: "" }
		}]
	},
	accounting:{
		salary:{
			type				:{ type: String, trim: true, default: "" }, // wage_hour, wage_day, wage_week, salary
			value				:{ type: Number, min: 0, default: 0 }
		},
		professional_allowance	:{ type: Number, min: 0, default: 0 },
		no_leave_bonus			:{ type: Number, min: 0, default: 0 },
		travel_allowance		:{ type: Number, min: 0, default: 0 },
		holiday_bonus			:{ type: Number, min: 0, default: 0 },
		food_allowance			:{ type: Number, min: 0, default: 0 },
		labor_insurance			:{ type: Number, min: 0, default: 0 },
		health_insurance		:{ type: Number, min: 0, default: 0 }
	},
	thing_need_to_do:[{
		type					:{ type: String, trim: true, default: "" }, // add_working_record
		datetime				:{ type: Date }
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

//Mongoose Register
exports = module.exports = mongoose.model("Employee", EmployeeSchema);
// exports = module.exports = EmployeeSchema;
