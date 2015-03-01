var express = require("express");
var http = require("http");
var util = require("util");
var validator = require("validator");
var Promise = require("bluebird");
var _ = require("underscore");

var config = require("./config");
var database = require("./utilities/database");
var error = require("./utilities/error");
var logger = require("./utilities/logger");

// Middleware
var responseMiddleware = require("./middlewares/response");
var existMiddleware = require("./middlewares/exist");

// Model
var Company = require("./models/company");

var router = express.Router();

router.use(express.static(__dirname + "/public"));

// Prepare Result Package
router.use(function(req, res, next){
	res.result = {
		success: false,
		message: ""
	};
	res.error = new Array();
	next();
});

// Prepare Permission
// router.use(function(req, res, next){
// 	req.permission = {
// 		me: false,
// 		player: false,
// 		host: false,
// 		management: false,
// 		sales: false,
// 		development: false
// 	};
// 	next();
// });

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

router.get("/", function(req, res){
	res.send("<h1>Leedan Management System Backend API</h1>");
});

router.get("/init", function(req, res){
	var company;
	Company.CreateCompany({
		"title":"Leedan",
		"description":"Leedan is a small, elegant and high tech motor company.",
		"working_item_list":[{
			"title": "製圖",
			"group": []
		}, {
			"title": "繞線計算",
			"group": []
		}, {
			"title": "訊號校正",
			"group": []
		}, {
			"title": "焊接",
			"group": []
		}, {
			"title": "矽鋼片壓製",
			"group": []
		}, {
			"title": "備料",
			"group": []
		}, {
			"title": "繞線",
			"group": []
		}, {
			"title": "入線",
			"group": []
		}, {
			"title": "結線",
			"group": []
		}, {
			"title": "整線",
			"group": []
		}, {
			"title": "包布",
			"group": []
		}, {
			"title": "磁石黏著",
			"group": []
		}, {
			"title": "磁石定位",
			"group": []
		}, {
			"title": "烤箱操作",
			"group": []
		}, {
			"title": "動平衡",
			"group": []
		}, {
			"title": "電機組裝",
			"group": []
		}, {
			"title": "邊速輪組裝",
			"group": []
		}, {
			"title": "變速機組裝",
			"group": []
		}, {
			"title": "清潔無外框電機",
			"group": []
		}, {
			"title": "噴漆",
			"group": []
		}, {
			"title": "試機",
			"group": []
		}, {
			"title": "搬運",
			"group": []
		}, {
			"title": "堆高機",
			"group": []
		}, {
			"title": "會計總帳",
			"group": []
		}, {
			"title": "會計填寫退貨單",
			"group": []
		}, {
			"title": "進貨單開立系統維護",
			"group": []
		}, {
			"title": "出貨單開立系統維護",
			"group": []
		}, {
			"title": "接單報價估價",
			"group": []
		}, {
			"title": "一般性電話客服",
			"group": []
		}, {
			"title": "技術性電話客服",
			"group": []
		}, {
			"title": "零組件採購/追蹤",
			"group": []
		}]
	}).then(function(newCompany){
		company = newCompany;

		var employeeList = [
			{ "name": "王晃信", "id_number": "PLM001A", "passcode": "43821931" },
			{ "name": "張訓賢", "id_number": "PLM002A", "passcode": "34325222" },
			{ "name": "江武翰", "id_number": "PLM003A", "passcode": "46547644" },
			{ "name": "陳智傑", "id_number": "PLM004A", "passcode": "59315333" },
			{ "name": "王暐誌", "id_number": "PLM005A", "passcode": "85685765" },
			{ "name": "劉若涵", "id_number": "PLM006A", "passcode": "69313122" },
			{ "name": "賴奎宏", "id_number": "PLM007A", "passcode": "76531241" },
			{ "name": "王俊岳", "id_number": "PLM008A", "passcode": "59127892" },
			{ "name": "賴怡臻", "id_number": "PLM009A", "passcode": "57349132" },
			{ "name": "賴奎銘", "id_number": "PLM010A", "passcode": "45891367" },
			{ "name": "柯春妹", "id_number": "PLM011A", "passcode": "69148831" },
			{ "name": "紀志榮", "id_number": "PLM012A", "passcode": "78592137" },
			{ "name": "盧岳珈", "id_number": "PLM013A", "passcode": "24812225" },
			{ "name": "陳奇樟", "id_number": "PLM014A", "passcode": "52912352" },
			{
				"name": "施閎凱",
				"id_number": "PLM999A",
				"passcode": "12345678",
				"permission": ["leave", "manage_employee"]
			}
		];
		var resolver = Promise.defer();
		var addEmployee = function(){
			var employeeProperty = employeeList.shift();
			if(employeeProperty){
				company.AddEmployee(employeeProperty).then(function(employee){
					addEmployee();
				}).catch(function(err){
					resolver.reject(err);
				});;
			}
			else{
				resolver.resolve();
			}
		}
		addEmployee();
		return resolver.promise;
	}).then(function(){
		res.result.success = true;
		res.result.message = "Create Company Success";
		res.result.objects = [company];
		res.status(201).json(res.result);
	}).catch(error.InputPropertyNotAcceptError, function(err){
		responseMiddleware.sendErrorResponse(req, res, err, 400);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
});

router.post("/company", function(req, res){
	Company.CreateCompany(req.body).then(function(company){
		res.result.success = true;
		res.result.message = "Create Company Success";
		res.result.objects = [company];
		res.status(201).json(res.result);
	}).catch(error.InputPropertyNotAcceptError, function(err){
		responseMiddleware.sendErrorResponse(req, res, err, 400);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
});
router.get("/company", function(req, res){
	Promise.resolve(Company.find({}).exec()).then(function(companys){
		if(companys){
			req.company = companys[0];
			res.result.success = true;
			res.result.message = "Get Company Success";
			res.result.objects = [req.company];
			res.status(200).json(res.result);
		}
		else{
			responseMiddleware.sendErrorResponse(req, res, new error.NotExistError("Company not exist."), 404);
		}
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
});
router.get("/company/:company_id", function(req, res){
	res.result.success = true;
	res.result.message = "Get Company Success";
	res.result.objects = [req.company];
	res.status(200).json(res.result);
});
router.put("/company/:company_id", function(req, res){
	req.company.UpdateProperty(req.body, true).then(function(){
		res.result.success = true;
		res.result.message = "Update Company Success";
		res.result.objects = [req.company];
		res.status(200).json(res.result);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
});
router.post("/company/:company_id/employee", function(req, res){
	req.company.AddEmployee(req.body).then(function(employee){
		res.result.success = true;
		res.result.message = "Add Employee Success";
		res.result.objects = [employee];
		res.status(201).json(res.result);
	}).catch(error.InputPropertyNotAcceptError, function(err){
		responseMiddleware.sendErrorResponse(req, res, err, 400);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
});
router.put("/company/:company_id/employee/:employee_id", function(req, res){
	req.employee.UpdateProperty(req.body).then(function(){
		return req.company.SaveWithPromise(true);
	}).then(function(){
		res.result.success = true;
		res.result.message = "Update Employee Success";
		res.result.objects = [req.employee];
		res.status(200).json(res.result);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
});
router.delete("/company/:company_id/employee/:employee_id", function(req, res){
	req.company.employee_list.id(req.employee.id).remove();
	req.company.SaveWithPromise(true).then(function(){
		res.result.success = true;
		res.result.message = "Remove Employee Success";
		res.result.objects = [req.employee];
		res.status(200).json(res.result);
	}).catch(function(err){
		responseMiddleware.sendSystemErrorResponse(req, res, err);
	});
});
router.post("/company/:company_id/employee/:employee_id/punch_record", function(req, res){
	if(validator.toString(req.body.type) != ""){
		req.employee.AddPunchRecord(req.body.type).then(function(){
			return req.company.SaveWithPromise(true);
		}).then(function(){
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
database.connect().then(function(db){}).catch(function(err){
	logger.error(err);
});

Company.find({}, function(err, companys){
	if(err){
		return logger.error(err);
	}
	companys.forEach(function(company){
		logger.debug("Company:" + company.title + "[" + company.id + "]");
	});
});


// Export router
exports = module.exports = router;