var mongoose = require("mongoose");
var Promise = require("bluebird");
var validator = require("validator");
var util = require("util");
var _ = require("underscore");

var logger = require("../utilities/logger");
var error = require("../utilities/error");
var basicPlugin = require("./plugins/basic");
var timePunchPlugin = require("./plugins/time_punch");
var workingRecordPlugin = require("./plugins/working_record");

var ObjectId = mongoose.Schema.Types.ObjectId;

var EmployeeSchema = new mongoose.Schema({
	company						:{ type: ObjectId, ref: "Company" },
	name						:{ type: String, trim: true, default: "" },
	id_number					:{ type: String, trim: true, default: "" },
	serial_number				:{ type: String, trim: true, default: "" },
	passcode					:{ type: String, trim: true, default: "" },
	gender						:{ type: String, trim: true, default: "" },
	avatar						:{ type: String, trim: true, default: "" },
	permission					:[{ type: String, trim: true, default: "" }],	// leave, manage_employee, manage_accounting
	group						:[{ type: String, trim: true, default: "" }],
	
	// thing_need_to_do:[{
	// 	type						:{ type: String, trim: true, default: "" },	// add_working_record
	// 	datetime					:{ type: Date }
	// }],
	
});

EmployeeSchema.plugin(basicPlugin.DocumentVersionPlugin);
EmployeeSchema.plugin(basicPlugin.ModifiedFlagPlugin);
EmployeeSchema.plugin(basicPlugin.SaveWithPromisePlugin);
EmployeeSchema.plugin(basicPlugin.SimplePropertyUpdatePlugin);
EmployeeSchema.plugin(timePunchPlugin.TimePunchPluginForEmployee);
EmployeeSchema.plugin(workingRecordPlugin.WorkingRecordPluginForEmployee);

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
	var employee;

	Promise.resolve(model.count({
		$and: [{
			"company": property.company
		}, {
			$or: [{
				"id_number": property.id_number
			}, {
				"serial_number": serialNumber
			}, {
				"passcode": property.passcode
			}]
		}]
	}).exec()).then(function(count){
		if(count > 0){
			return Promise.reject(new error.InputPropertyNotAcceptError("Property: ID number or passcode is used."));
		}
		return Promise.resolve(model.create({
			company: property.company,
			name: property.name,
			id_number: property.id_number,
			serial_number: serialNumber,
			passcode: property.passcode,
		}));
	}).then(function(newEmployee){
		employee = newEmployee;
		return employee.UpdateProperty(property, true);
	}).then(function(){
		resolver.resolve(employee);
	}).catch(error.InputPropertyNotAcceptError, function(err){
		resolver.reject(err);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});
	return resolver.promise;
}
EmployeeSchema.methods.UpdateProperty = function(property, save){
	var employee = this;
	return employee.UpdateSimpleProperty(property, {
		string_property:[
			"name",
			"id_number",
			"passcode",
			"gender",
			"avatar",
		],
		array_property:[
			"permission",
			"group"
		]
	}, save);
}

// return employee.UpdateSimpleProperty(property, {
// 	string_property:[
// 		"name",
// 		"id_number",
// 		"passcode",
// 		"gender",
// 		"accounting.salary.type"
// 	],
// 	number_property:[
// 		"leave.quota.annual_leave",
// 		"accounting.salary.value",
// 		"accounting.professional_allowance",
// 		"accounting.no_leave_bonus",
// 		"accounting.travel_allowance",
// 		"accounting.holiday_bonus",
// 		"accounting.food_allowance",
// 		"accounting.labor_insurance",
// 		"accounting.health_insurance"
// 	],
// 	array_property:[
// 		"permission",
// 		"group"
// 	]
// }, save);

//Mongoose Register
exports = module.exports = mongoose.model("Employee", EmployeeSchema);
// exports = module.exports = EmployeeSchema;
