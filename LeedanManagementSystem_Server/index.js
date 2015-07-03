var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var util = require("util");
var validator = require("validator");
var Promise = require("bluebird");
var _ = require("underscore");
var path = require("path");
var fs = require("fs");

var config = require("./config");
var database = require("./utilities/database");
var error = require("./utilities/error");
var logger = require("./utilities/logger");

// Middleware
var responseMiddleware = require("./middlewares/response");
var existMiddleware = require("./middlewares/exist");

// Router
var initialRouter = require("./routers/initial");
var basicRouter = require("./routers/basic");
var timePunchRouter = require("./routers/time_punch");
var workingRecordRouter = require("./routers/working_record");
var stockManagerRouter = require("./routers/stock_manager");

// Model
var Company = require("./models/company");


var router = express.Router();

// Show Request Information
router.use(function(req, res, next){
	logger.debug("[" + req.method + "] " + req.originalUrl);
	next();
});

// Prepare Result Package
router.use(function(req, res, next){
	res.result = {
		success: false,
		message: ""
	};
	res.error = new Array();
	next();
});

// Convert GET Package to POST
router.use(function(req, res, next){
	if(validator.toString(req.method) == "GET" && validator.toString(req.query.data) != ""){
		try{
			req.body = JSON.parse(req.query.data);
		}
		catch(ex){
			res.result.message = "JSON parse error";
			res.status(500).json(res.result);
			return false;
		}
	}
	next();
});

// Test login status
// router.use(middleware.testUserLogin);

router.param("company_id", existMiddleware.companyExist);
router.param("employee_id", existMiddleware.employeeExist);
router.param("stock_id", existMiddleware.stockExist);

router.get("/", function(req, res){
	res.send("<h1>Leedan Management System Backend API</h1>");
});

initialRouter.registerLeedanDataRouter(router);

basicRouter.registerCompanyRouter(router);
basicRouter.registerEmployeeRouter(router);

timePunchRouter.registerTimePunchRouter(router);
workingRecordRouter.registerWorkingRecordRouter(router);
stockManagerRouter.registerStockManagerRouter(router);

// router.get("/company/:company_id/pay_sheet", function(req, res){
// 	req.company.GeneratePaySheet(new Date("Apr 01 2015 00:00:00 GMT+0800"), new Date("Apr 30 2015 00:00:00 GMT+0800")).then(function(company){
// 		res.json(company);
// 	}).catch(function(err){
// 		res.status(500).send(err);
// 	});
// });
// router.post("/company/:company_id/pay_sheet", function(req, res){

// });
// var printDate = function(input){
// 	if(util.isDate(input)){
// 		return input.getFullYear() + "-" + (input.getMonth() + 1) + "-" + input.getDate() + " " + input.getHours() + ":" + input.getMinutes() + ":" + input.getSeconds();
// 	}
// 	else{
// 		return "無資料";
// 	}
// }
// router.get("/company/:company_id/report", function(req, res){
// 	var filename = path.join(__dirname, "..", "temp", "report.csv");
// 	fs.truncateSync(filename, 0);
// 	req.company.employee_list.forEach(function(employee){
// 		if(employee.pay_sheet && employee.pay_sheet.length > 0){
// 			fs.appendFileSync(filename, "員工姓名, " + employee.pay_sheet[0].name + "\n");
// 			fs.appendFileSync(filename, employee.pay_sheet[0].title + "\n");
// 			fs.appendFileSync(filename, "日期, 上班, 下班, 累計工時, 上班, 下班, 累計工時, 上班, 下班, 累計工時, 總工時, 餐費補助\n");
// 			employee.pay_sheet[0].punch_record.date_record_list.forEach(function(dateRecord){
// 				if(dateRecord.raw_record_list.length > 0){
// 					fs.appendFileSync(filename, printDate(dateRecord.date).split(" ")[0] + ", ");
// 					dateRecord.working_hours.forEach(function(workingHours){
// 						fs.appendFileSync(filename, printDate(workingHours.real_start_time) + ", " + printDate(workingHours.real_end_time) + ", 0, ");
// 					});
// 					fs.appendFileSync(filename, "0\n");
// 					fs.appendFileSync(filename, "原始打卡紀錄\n");
// 					dateRecord.raw_record_list.forEach(function(rawRecord){
// 						fs.appendFileSync(filename, rawRecord.type + ", " + printDate(rawRecord.datetime) + "\n");
// 					});
// 				}
// 			});
// 			fs.appendFileSync(filename, "\n\n");
// 		}
// 	});
// 	res.send("OK");
// });

var app = express();

database.connect().then(function(db){
	app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
	app.use(bodyParser.json({limit: "10mb"}));

	app.use("/api", router);
	app.use("/management", express.static(path.join(__dirname, "management", "dist")));
	app.get("/", function(req, res){
		res.send("<h1>LDSM Landing Page</h1>");
	});

	logger.info("Start server @80");

	var httpServer = http.createServer(app);

	httpServer.listen(80);
}).catch(function(err){
	logger.error(err);
});

exports = module.exports = app;

Company.find({}, function(err, companys){
	if(err){
		return logger.error(err);
	}
	companys.forEach(function(company){
		logger.debug("Company:" + company.title + "[" + company.id + "]");
	});
});
