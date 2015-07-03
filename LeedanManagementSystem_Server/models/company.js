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
var stockManagerPlugin = require("./plugins/stock_manager");

var Employee = require("./employee");

var ObjectId = mongoose.Schema.Types.ObjectId;

var CompanySchema = new mongoose.Schema({
	title						:{ type: String, trim: true, default: "" },
	description					:{ type: String, trim: true, default: "" },
	serial_number				:{ type: String, trim: true, default: "" },
	logo						:{ type: String, trim: true, default: "" },
	username					:{ type: String, trim: true, default: "" },
	password					:{ type: String, trim: true, default: "" },

	employee_list				:[{ type: ObjectId, ref: "Employee" }],

	avtive_module				:[{ type: String, trim: true, default: "" }],
});

CompanySchema.plugin(basicPlugin.DocumentVersionPlugin);
CompanySchema.plugin(basicPlugin.ModifiedFlagPlugin);
CompanySchema.plugin(basicPlugin.SaveWithPromisePlugin);
CompanySchema.plugin(basicPlugin.SimplePropertyUpdatePlugin);
CompanySchema.plugin(timePunchPlugin.TimePunchPluginForCompany);
CompanySchema.plugin(stockManagerPlugin.StockManagerPluginForCompany);

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
	company.UpdateSimpleProperty(property, {
		string_property:[
			"title",
			"description",
			"username",
			"password"
		]
	}, false).then(function(){
		if(validator.isBase64(property.logo)){
			company.logo = property.logo;
		}
		return company.SaveWithPromise(save);
	}).then(function(){
		return company.UpdateRecommendRecord(property, save);
	}).then(function(){
		return company.UpdateWorkingRecordProperty(property, save);
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
CompanySchema.methods.AddActiveModule = function(module){
	var company = this;
	_.union(company, [module]);
	return company.SaveWithPromise(true);
}

//Mongoose Register
exports = module.exports = mongoose.model("Company", CompanySchema);
