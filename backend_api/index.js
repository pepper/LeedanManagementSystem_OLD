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

// Show Request Information
router.use(function(req, res, next){
	logger.info("[" + req.method + "] " + req.originalUrl);
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
			"title": "會計總帳",
			"score": 33,
			"group": []
		}, {
			"title": "退貨單填寫",
			"score": 55,
			"group": []
		}, {
			"title": "進貨單開立",
			"score": 31,
			"group": []
		}, {
			"title": "出貨單開立",
			"score": 30,
			"group": []
		}, {
			"title": "系統內容維護",
			"score": 30,
			"group": []
		}, {
			"title": "接單/報價/估價",
			"score": 44,
			"group": []
		}, {
			"title": "一般性電話客服",
			"score": 14,
			"group": []
		}, {
			"title": "技術性電話客服",
			"score": 36,
			"group": []
		}, {
			"title": "零組件採購/追蹤",
			"score": 37,
			"group": []
		}, {
			"title": "製圖",
			"score": 41,
			"group": []
		}, {
			"title": "繞線計算",
			"score": 47,
			"group": []
		}, {
			"title": "訊號校正",
			"score": 39,
			"group": []
		}, {
			"title": "焊接",
			"score": 39,
			"group": []
		}, {
			"title": "矽鋼片壓製",
			"score": 41,
			"group": []
		}, {
			"title": "備料",
			"score": 32,
			"group": []
		}, {
			"title": "繞線",
			"score": 33,
			"group": []
		}, {
			"title": "入線",
			"score": 27,
			"group": []
		}, {
			"title": "結線",
			"score": 38,
			"group": []
		}, {
			"title": "整線",
			"score": 27,
			"group": []
		}, {
			"title": "包布",
			"score": 26,
			"group": []
		}, {
			"title": "磁石黏著",
			"score": 32,
			"group": []
		}, {
			"title": "磁石定位",
			"score": 40,
			"group": []
		}, {
			"title": "烤箱操作",
			"score": 11,
			"group": []
		}, {
			"title": "動平衡",
			"score": 30,
			"group": []
		}, {
			"title": "電機組裝",
			"score": 43,
			"group": []
		}, {
			"title": "變速輪組裝",
			"score": 28,
			"group": []
		}, {
			"title": "變速機組裝",
			"score": 16,
			"group": []
		}, {
			"title": "清潔",
			"score": 32,
			"group": []
		}, {
			"title": "噴漆",
			"score": 24,
			"group": []
		}, {
			"title": "試機",
			"score": 32,
			"group": []
		}, {
			"title": "搬運",
			"score": 25,
			"group": []
		}, {
			"title": "堆高機操作",
			"score": 17,
			"group": []
		}, {
			"title": "客戶資料蒐集",
			"score": 2415,
			"group": []
		}, {
			"title": "供應商資料蒐集",
			"score": 2415,
			"group": []
		}, {
			"title": "研發案討論",
			"score": 2415,
			"group": []
		}, {
			"title": "研發案資料製作",
			"score": 4025,
			"group": []
		}, {
			"title": "研發案實作",
			"score": 4025,
			"group": []
		}]
	}).then(function(newCompany){
		company = newCompany;
		var employeeList = [
			{ "name": "江武翰", "id_number": "OS5692A", "passcode": "75267181" },
			{ "name": "紀志榮", "id_number": "OS4141A", "passcode": "37961251" },
			{ "name": "劉若涵", "id_number": "OS7200A", "passcode": "63293949" },
			{ "name": "陳智傑", "id_number": "OS3457A", "passcode": "82163366" },
			{ "name": "吳明姍", "id_number": "OSXXXXA", "passcode": "93612877" },
			{ "name": "賴奎宏", "id_number": "PL0299A", "passcode": "27114218" },
			{ "name": "賴怡臻", "id_number": "PLXXXXA", "passcode": "59557925" },
			{ "name": "柯春妹", "id_number": "PL3988A", "passcode": "27967164" },
			{ "name": "盧岳珈", "id_number": "PL3952A", "passcode": "19967671" },
			{ "name": "王俊岳", "id_number": "PL8133A", "passcode": "79135879" },
			{ "name": "王暐誌", "id_number": "PL1437A", "passcode": "74335468" },
			{ "name": "陳奇樟", "id_number": "PL8866A", "passcode": "13638142" },
			{
				"name": "施閎凱",
				"id_number": "AD3680Z",
				"passcode": "11235813",
				"permission": ["leave", "manage_employee", "manage_accounting"]
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
router.get("/reduce", function(req, res){
	var newCompany = null;
	Company.CreateCompany({
		"title":"利電電機科技股份有限公司",
		"description":"Leedan is a small, elegant and high tech motor company.",
		"working_item_list":[{
			"title": "會計總帳",
			"score": 33,
			"group": []
		}, {
			"title": "退貨單填寫",
			"score": 55,
			"group": []
		}, {
			"title": "進貨單開立",
			"score": 31,
			"group": []
		}, {
			"title": "出貨單開立",
			"score": 30,
			"group": []
		}, {
			"title": "系統內容維護",
			"score": 30,
			"group": []
		}, {
			"title": "接單/報價/估價",
			"score": 44,
			"group": []
		}, {
			"title": "一般性電話客服",
			"score": 14,
			"group": []
		}, {
			"title": "技術性電話客服",
			"score": 36,
			"group": []
		}, {
			"title": "零組件採購/追蹤",
			"score": 37,
			"group": []
		}, {
			"title": "製圖",
			"score": 41,
			"group": []
		}, {
			"title": "繞線計算",
			"score": 47,
			"group": []
		}, {
			"title": "訊號校正",
			"score": 39,
			"group": []
		}, {
			"title": "焊接",
			"score": 39,
			"group": []
		}, {
			"title": "矽鋼片壓製",
			"score": 41,
			"group": []
		}, {
			"title": "備料",
			"score": 32,
			"group": []
		}, {
			"title": "繞線",
			"score": 33,
			"group": []
		}, {
			"title": "入線",
			"score": 27,
			"group": []
		}, {
			"title": "結線",
			"score": 38,
			"group": []
		}, {
			"title": "整線",
			"score": 27,
			"group": []
		}, {
			"title": "包布",
			"score": 26,
			"group": []
		}, {
			"title": "磁石黏著",
			"score": 32,
			"group": []
		}, {
			"title": "磁石定位",
			"score": 40,
			"group": []
		}, {
			"title": "烤箱操作",
			"score": 11,
			"group": []
		}, {
			"title": "動平衡",
			"score": 30,
			"group": []
		}, {
			"title": "電機組裝",
			"score": 43,
			"group": []
		}, {
			"title": "變速輪組裝",
			"score": 28,
			"group": []
		}, {
			"title": "變速機組裝",
			"score": 16,
			"group": []
		}, {
			"title": "清潔",
			"score": 32,
			"group": []
		}, {
			"title": "噴漆",
			"score": 24,
			"group": []
		}, {
			"title": "試機",
			"score": 32,
			"group": []
		}, {
			"title": "搬運",
			"score": 25,
			"group": []
		}, {
			"title": "堆高機操作",
			"score": 17,
			"group": []
		}, {
			"title": "客戶資料蒐集",
			"score": 2415,
			"group": []
		}, {
			"title": "供應商資料蒐集",
			"score": 2415,
			"group": []
		}, {
			"title": "研發案討論",
			"score": 2415,
			"group": []
		}, {
			"title": "研發案資料製作",
			"score": 4025,
			"group": []
		}, {
			"title": "研發案實作",
			"score": 4025,
			"group": []
		}],
		"working_hours": [{
			"title": "早班",
			"key": "morning",
			"start": 28800000,
			"end": 43200000
		}, {
			"title": "午班",
			"key": "afternoon",
			"start": 48600000,
			"end": 63000000
		}, {
			"title": "晚班",
			"key": "night",
			"start": 64800000,
			"end": 72000000
		}]
	}).then(function(company){
		newCompany = company;
		var employeeList = [
			{ "name": "江武翰", "id_number": "OS5692A", "passcode": "75267181" },
			{ "name": "紀志榮", "id_number": "OS4141A", "passcode": "37961251" },
			{ "name": "劉若涵", "id_number": "OS7200A", "passcode": "63293949" },
			{ "name": "陳智傑", "id_number": "OS3457A", "passcode": "82163366" },
			{ "name": "吳明姍", "id_number": "OSXXXXA", "passcode": "93612877" },
			{ "name": "賴奎宏", "id_number": "PL0299A", "passcode": "27114218" },
			{ "name": "賴怡臻", "id_number": "PLXXXXA", "passcode": "59557925" },
			{ "name": "柯春妹", "id_number": "PL3988A", "passcode": "27967164" },
			{ "name": "盧岳珈", "id_number": "PL3952A", "passcode": "19967671" },
			{ "name": "王俊岳", "id_number": "PL8133A", "passcode": "79135879" },
			{ "name": "王暐誌", "id_number": "PL1437A", "passcode": "74335468" },
			{ "name": "陳奇樟", "id_number": "PL8866A", "passcode": "13638142" },
			{
				"name": "施閎凱",
				"id_number": "AD3680Z",
				"passcode": "11235813",
				"permission": ["leave", "manage_employee", "manage_accounting"]
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
		return Promise.resolve(Company.find({}).exec());
	}).then(function(companys){
		companys.forEach(function(company){
			if(newCompany.id != company.id){
				company.employee_list.forEach(function(employee){
					var found = newCompany.employee_list.some(function(targetEmployee){
						if(targetEmployee.id_number == employee.id_number){
							targetEmployee.working_record.raw_record_list = targetEmployee.working_record.raw_record_list.concat(employee.working_record.raw_record_list);
							targetEmployee.punch_record.raw_record_list = targetEmployee.punch_record.raw_record_list.concat(employee.punch_record.raw_record_list);
							return true;
						}
					});
					if(!found){
						logger.error("Not found employee!!!");
					}
				});
			}
		});
		return Promise.resolve(newCompany.save());
	}).then(function(){

		res.json(newCompany);
	}).catch(function(err){
		logger.error(err);
		res.status(500).send("Some Error:" + err.message);
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
router.post("/company/:company_id/employee/:employee_id/working_record", function(req, res){
	if(util.isArray(req.body.working_item_list) && req.body.working_item_list.length > 0){
		req.employee.AddWorkingRecord(req.company, req.body.working_item_list).then(function(){
			return req.company.SaveWithPromise(true);
		}).then(function(){
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
router.get("/company/:company_id/pay_sheet", function(req, res){
	req.company.GeneratePaySheet(new Date("Apr 01 2015 00:00:00 GMT+0800"), new Date("Apr 30 2015 00:00:00 GMT+0800")).then(function(company){
		res.json(company);
	}).catch(function(err){
		res.status(500).send(err);
	});
});
router.post("/company/:company_id/pay_sheet", function(req, res){

});
var printDate = function(input){
	if(util.isDate(input)){
		return input.getFullYear() + "-" + (input.getMonth() + 1) + "-" + input.getDate() + " " + input.getHours() + ":" + input.getMinutes() + ":" + input.getSeconds();
	}
	else{
		return "無資料";
	}
}
router.get("/company/:company_id/report", function(req, res){
	req.company.employee_list.forEach(function(employee){
		if(employee.pay_sheet && employee.pay_sheet.length > 0){
			console.log(employee.pay_sheet[0].name);
			employee.pay_sheet[0].punch_record.date_record_list.forEach(function(dateRecord){
				console.log(printDate(dateRecord.date));
				dateRecord.working_hours.forEach(function(workingHours){
					console.log(workingHours.title + ", " + printDate(workingHours.start_time) + " ~ " + printDate(workingHours.end_time) + ", " + printDate(workingHours.real_start_time) + " ~ " + printDate(workingHours.real_end_time));
				});
				dateRecord.raw_record_list.forEach(function(rawRecord){
					console.log(rawRecord.type + ", " + printDate(rawRecord.datetime));
				});
			});
			console.log("\n");
		}
	});
	res.send("OK");
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