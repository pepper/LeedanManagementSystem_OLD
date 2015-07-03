var validator = require("validator");
var Promise = require("bluebird");
var _ = require("underscore");

// Middleware
var responseMiddleware = require("../middlewares/response");
var existMiddleware = require("../middlewares/exist");

exports.registerTimePunchRouter = function(router){
	router.post("/company/:company_id/employee/:employee_id/time_punch_record", function(req, res){
		if(validator.toString(req.body.type) != ""){
			req.employee.AddTimePunchRecord(req.body.type, true).then(function(){
				res.result.success = true;
				res.result.message = "Add Punch Record Success";
				res.result.objects = [req.employee];
				res.status(200).json(res.result);
			}).catch(function(err){
				responseMiddleware.sendSystemErrorResponse(req, res, err);
			});
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.InputPropertyNotAcceptError("Require title property."), 400);
		}
	});
}