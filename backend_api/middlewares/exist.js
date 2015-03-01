var mongoose = require("mongoose");
var Promise = require("bluebird");
var _ = require("underscore");
var validator = require("validator");

var responseMiddleware = require("./response");

var logger = require("../utilities/logger");
var error = require("../utilities/error");
var ObjectId = mongoose.Schema.Types.ObjectId;

var Company = require("../models/company");

// Exist Group
exports.companyExist = function(req, res, next, companyId){
	Promise.resolve(Company.findById(companyId).exec()).then(function(company){
		if(company){
			req.company = company;
			next();
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.NotExistError("Company not exist."), 404);
		}
	}).catch(mongoose.Error.CastError, function(err){
		responseMiddleware.sendErrorResponse(req, res, err, 404);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
}

exports.employeeExist = function(req, res, next, employeeId){
	var employee = req.company.employee_list.id(employeeId);
	if(employee){
		req.employee = employee;
		next();
	}
	else{
		responseMiddleware.sendErrorResponse(req, res, new error.NotExistError("Employee not exist."), 404);
	}
}