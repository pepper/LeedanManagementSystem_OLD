var validator = require("validator");
var Promise = require("bluebird");
var _ = require("underscore");

var error = require("../utilities/error");
var StockManager = require("../models/plugins/stock_manager");
var Stock = StockManager.Stock;
var Supplier = StockManager.Supplier;
var WarehouseSpace = StockManager.WarehouseSpace;

// Middleware
var responseMiddleware = require("../middlewares/response");
var existMiddleware = require("../middlewares/exist");

exports.registerStockManagerRouter = function(router){
	router.get("/company/:company_id/stock", function(req, res){
		Promise.resolve(Stock.find({
			company: req.company
		}).exec()).then(function(stockList){
			res.result.success = true;
			res.result.message = "Get stock success, total:" + stockList.length;
			res.result.objects = stockList;
			res.status(200).json(res.result);
		}).catch(function(err){
			logger.error(err);
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
	});
	router.post("/company/:company_id/stock", function(req, res){
		if(validator.toString(req.body.title) != "" && validator.toString(req.body.sku_number) != ""){
			req.company.CreateStock(req.body.title, req.body.sku_number, req.body).then(function(stock){
				res.result.success = true;
				res.result.message = "Create Stock Success";
				res.result.objects = [stock];
				res.status(200).json(res.result);
			}).catch(function(err){
				responseMiddleware.sendSystemErrorResponse(req, res, err);
			});
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.InputPropertyNotAcceptError("Require title & sku_number property."), 400);
		}
	});
	router.put("/company/:company_id/stock/:stock_id", function(req, res){
		req.stock.UpdateProperty(req.body, true).then(function(){
			res.result.success = true;
			res.result.message = "Update Stock Success";
			res.result.objects = [req.stock];
			res.status(200).json(res.result);
		}).catch(function(err){
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
	});
	router.delete("/company/:company_id/stock/:stock_id", function(req, res){
		req.company.RemoveStock(req.stock).then(function(){
			res.result.success = true;
			res.result.message = "Remove Stock Success";
			res.result.objects = [req.company];
			res.status(200).json(res.result);
		}).catch(function(err){
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
	});
	router.get("/company/:company_id/supplier", function(req, res){
		Promise.resolve(Supplier.find({
			company: req.company
		}).exec()).then(function(supplierList){
			res.result.success = true;
			res.result.message = "Get supplier success, total:" + supplierList.length;
			res.result.objects = supplierList;
			res.status(200).json(res.result);
		}).catch(function(err){
			logger.error(err);
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
	});
	router.post("/company/:company_id/supplier", function(req, res){
		if(validator.toString(req.body.title) != ""){
			req.company.CreateSupplier(req.body.title, req.body).then(function(supplier){
				res.result.success = true;
				res.result.message = "Create Supplier Success";
				res.result.objects = [supplier];
				res.status(200).json(res.result);
			}).catch(function(err){
				responseMiddleware.sendSystemErrorResponse(req, res, err);
			});
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.InputPropertyNotAcceptError("Require title property."), 400);
		}
	});
	router.put("/company/:company_id/supplier/:supplier_id", function(req, res){
		req.stock.UpdateProperty(req.body, true).then(function(){
			res.result.success = true;
			res.result.message = "Update Supplier Success";
			res.result.objects = [req.stock];
			res.status(200).json(res.result);
		}).catch(function(err){
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
	});
	router.delete("/company/:company_id/supplier/:supplier_id", function(req, res){
		req.company.RemoveStock(req.supplier).then(function(){
			res.result.success = true;
			res.result.message = "Remove Supplier Success";
			res.result.objects = [req.company];
			res.status(200).json(res.result);
		}).catch(function(err){
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
	});
}