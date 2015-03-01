var mongoose = require("mongoose");
var Promise = require("bluebird");
var validator = require("validator");
var util = require("util");
var _ = require("underscore");

var logger = require("../utilities/logger");
var error = require("../utilities/error");
var plugin = require("./plugin");

var Employee = require("./employee");

var ObjectId = mongoose.Schema.Types.ObjectId;

var CompanySchema = new mongoose.Schema({
	title						:{ type: String, trim: true, default: "" },
	description					:{ type: String, trim: true, default: "" },
	serial_number				:{ type: String, trim: true, default: "" },
	logo						:{ type: String, trim: true, default: "" },
	username					:{ type: String, trim: true, default: "" },
	password					:{ type: String, trim: true, default: "" },

	employee_list				:[Employee.schema],

	working_item_list:[{
		title					:{ type: String, trim: true, default: "" },
		group					:[{ type: String, trim: true, default: "" }]
	}]
});

CompanySchema.plugin(plugin.DocumentVersionPlugin);
CompanySchema.plugin(plugin.ModifiedFlagPlugin);
CompanySchema.plugin(plugin.SaveWithPromisePlugin);
CompanySchema.plugin(plugin.SimplePropertyUpdatePlugin, {
	string_property:[
		"title",
		"description"
	]
});

CompanySchema.statics.CreateCompany = function(property){
	var model = this;
	var resolver = Promise.defer();
	if(validator.toString(property.title) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: title is required."));
	}
	var number = Math.floor(Math.random() * 1000000000);
	var serialNumber = ("9" + (new Array(10 - number.toString().length)).join("0") + number);

	var company;
	Promise.resolve(model.create({
		title: property.title,
		serial_number: serialNumber
	})).then(function(newCompany){
		company = newCompany;
		return company.UpdateProperty(property, true);
	}).then(function(){
		resolver.resolve(company);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});

	return resolver.promise;
}
CompanySchema.methods.UpdateProperty = function(property, save){
	var company = this;
	var resolver = Promise.defer();
	company.UpdateSimpleProperty(property, false).then(function(){
		if(validator.isBase64(property.logo)){
			company.logo = property.logo;
		}
		if(util.isArray(property.working_item_list)){
			var needUpdateArray = false;
			var newWorkingItemArray = [];
			property.working_item_list.forEach(function(newWorkingItem){
				var found = company.working_item_list.some(function(workingItem){
					if(workingItem.title == newWorkingItem.title){
						if(util.isArray(newWorkingItem.group) && util.isArray(workingItem.group) && ((newWorkingItem.group.length != workingItem.group.length) || (_.difference(newWorkingItem.group, workingItem.group).length != 0))){
							workingItem.group = newWorkingItem.group;
							newWorkingItemArray.push(workingItem);
							needUpdateArray = true;
						}
						else{
							newWorkingItemArray.push(workingItem);
						}
						return true;
					}
				});
				if(!found){
					newWorkingItemArray.push(newWorkingItem);
					needUpdateArray = true;
				}
			});
			if(needUpdateArray){
				company.working_item_list = newWorkingItemArray;
			}
		}
		return company.SaveWithPromise(save);
	}).then(function(){
		resolver.resolve();
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});
	return resolver.promise;
}
CompanySchema.methods.AddEmployee = function(property){
	var company = this;
	var resolver = Promise.defer();
	var employee;
	property.company = company;
	Employee.CreateEmployee(property).then(function(newEmployee){
		employee = newEmployee;
		company.employee_list.push(employee);
		return company.SaveWithPromise(true);
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
CompanySchema.methods.IsVaildWorkingItem = function(title){
	var company = this;
	var found = company.working_item_list.some(function(workingItem){
		if(workingItem.title == title){
			return true;
		}
	});
	return found;
}

//Mongoose Register
exports = module.exports = mongoose.model("Company", CompanySchema);
