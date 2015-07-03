var validator = require("validator");
var Promise = require("bluebird");
var _ = require("underscore");
var util = require("util");

// Middleware
var responseMiddleware = require("../middlewares/response");
var existMiddleware = require("../middlewares/exist");

exports.registerWorkingRecordRouter = function(router){
	router.post("/company/:company_id/employee/:employee_id/working_record", function(req, res){
		if(util.isArray(req.body.working_item_list) && req.body.working_item_list.length > 0){
			req.employee.AddWorkingRecord(req.company, req.body.working_item_list, true).then(function(){
				res.result.success = true;
				res.result.message = "Add Work Item List Success";
				res.result.objects = [req.employee];
				res.status(200).json(res.result);
			}).catch(function(err){
				responseMiddleware.sendSystemErrorResponse(req, res, err);
			});
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.InputPropertyNotAcceptError("Require working_item_list property."), 400);
		}
	});

}