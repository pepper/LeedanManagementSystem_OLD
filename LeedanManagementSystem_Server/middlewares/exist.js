var mongoose = require("mongoose");
var Promise = require("bluebird");
var _ = require("underscore");
var validator = require("validator");

var responseMiddleware = require("./response");

var logger = require("../utilities/logger");
var error = require("../utilities/error");
var ObjectId = mongoose.Schema.Types.ObjectId;

var Company = require("../models/company");
var Employee = require("../models/employee");
var StockManager = require("../models/plugins/stock_manager");
var Stock = StockManager.Stock;
var Supplier = StockManager.Supplier;
var WarehouseSpace = StockManager.WarehouseSpace;

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
	Promise.resolve(Employee.findById(employeeId).exec()).then(function(employee){
		if(employee){
			req.employee = employee;
			next();
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.NotExistError("Employee not exist."), 404);
		}
	}).catch(mongoose.Error.CastError, function(err){
		responseMiddleware.sendErrorResponse(req, res, err, 404);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
}

exports.stockExist = function(req, res, next, stockId){
	Promise.resolve(Stock.findById(stockId).exec()).then(function(stock){
		if(stock){
			req.stock = stock;
			next();
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.NotExistError("Stock not exist."), 404);
		}
	}).catch(mongoose.Error.CastError, function(err){
		responseMiddleware.sendErrorResponse(req, res, err, 404);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
}

exports.stockSupplier = function(req, res, next, supplierId){
	Promise.resolve(Supplier.findById(supplierId).exec()).then(function(supplier){
		if(supplier){
			req.supplier = supplier;
			next();
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.NotExistError("Supplier not exist."), 404);
		}
	}).catch(mongoose.Error.CastError, function(err){
		responseMiddleware.sendErrorResponse(req, res, err, 404);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
}