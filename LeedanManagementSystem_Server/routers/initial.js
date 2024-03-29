var Promise = require("bluebird");

var logger = require("../utilities/logger");
var error = require("../utilities/error");
var responseMiddleware = require("../middlewares/response");

var Company = require("../models/company");

exports.registerLeedanDataRouter = function(router){
	router.get("/init", function(req, res){
		var company;
		Company.CreateCompany({
			"title":"Leedan",
			"description":"Leedan is a small, elegant and high tech motor company.",
			"username": "leedan",
			"password": "1234",
			"time_punch":{
				"recommend_record":[{
					"type": ["TIME_PUNCH_ON_DUTY"],
					"start": -120,		// Start at 6:00
					"end": 30,			// End at 8:30
				},{
					"type": ["TIME_PUNCH_BREAK"],
					"start": 210,		// Start at 11:30
					"end": 270,			// End at 12:30
				},{
					"type": ["TIME_PUNCH_ON_DUTY"],
					"start": 270,		// Start at 12:30
					"end": 360,			// End at 14:00
				},{
					"type": ["TIME_PUNCH_BREAK"],
					"start": 540,		// Start at 17:00
					"end": 1080,			// End at 2:00
				},{
					"type": ["TIME_PUNCH_OFF_DUTY"],
					"start": 540,		// Start at 17:00
					"end": 1080,			// End at 2:00
				},{
					"type": ["TIME_PUNCH_ON_DUTY"],
					"start": 570,		// Start at 17:30
					"end": 720,			// End at 20:00
				}],
			},
			"working_record":{
				"working_item_list":[{
					"title": "會計總帳",
					"score": 33
				}, {
					"title": "退貨單填寫",
					"score": 55
				}, {
					"title": "進貨單開立",
					"score": 31
				}, {
					"title": "出貨單開立",
					"score": 30
				}, {
					"title": "系統內容維護",
					"score": 30
				}, {
					"title": "接單/報價/估價",
					"score": 44
				}, {
					"title": "一般性電話客服",
					"score": 14
				}, {
					"title": "技術性電話客服",
					"score": 36
				}, {
					"title": "零組件採購/追蹤",
					"score": 37
				}, {
					"title": "製圖",
					"score": 41
				}, {
					"title": "繞線計算",
					"score": 47
				}, {
					"title": "訊號校正",
					"score": 39
				}, {
					"title": "焊接",
					"score": 39
				}, {
					"title": "矽鋼片壓製",
					"score": 41
				}, {
					"title": "備料",
					"score": 32
				}, {
					"title": "繞線",
					"score": 33
				}, {
					"title": "入線",
					"score": 27
				}, {
					"title": "結線",
					"score": 38
				}, {
					"title": "整線",
					"score": 27
				}, {
					"title": "包布",
					"score": 26
				}, {
					"title": "磁石黏著",
					"score": 32
				}, {
					"title": "磁石定位",
					"score": 40
				}, {
					"title": "烤箱操作",
					"score": 11
				}, {
					"title": "動平衡",
					"score": 30
				}, {
					"title": "電機組裝",
					"score": 43
				}, {
					"title": "變速輪組裝",
					"score": 28
				}, {
					"title": "變速機組裝",
					"score": 16
				}, {
					"title": "清潔",
					"score": 32
				}, {
					"title": "噴漆",
					"score": 24
				}, {
					"title": "試機",
					"score": 32
				}, {
					"title": "搬運",
					"score": 25
				}, {
					"title": "堆高機操作",
					"score": 17
				}, {
					"title": "客戶資料蒐集",
					"score": 2415
				}, {
					"title": "供應商資料蒐集",
					"score": 2415
				}, {
					"title": "研發案討論",
					"score": 2415
				}, {
					"title": "研發案資料製作",
					"score": 4025
				}, {
					"title": "研發案實作",
					"score": 4025
				}]
			}
		}).then(function(newCompany){
			company = newCompany;
			return company.AddActiveModule("time_punch");
		}).then(function(){
			return company.AddActiveModule("working_record");
		}).then(function(){
			return company.AddActiveModule("account");
		}).then(function(){
			return company.AddActiveModule("ordering");
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
	// router.get("/reduce", function(req, res){
	// 	var newCompany = null;
	// 	Company.CreateCompany({
	// 		"title":"利電電機科技股份有限公司",
	// 		"description":"Leedan is a small, elegant and high tech motor company.",
	// 		"working_item_list":[{
	// 			"title": "會計總帳",
	// 			"score": 33,
	// 			"group": []
	// 		}, {
	// 			"title": "退貨單填寫",
	// 			"score": 55,
	// 			"group": []
	// 		}, {
	// 			"title": "進貨單開立",
	// 			"score": 31,
	// 			"group": []
	// 		}, {
	// 			"title": "出貨單開立",
	// 			"score": 30,
	// 			"group": []
	// 		}, {
	// 			"title": "系統內容維護",
	// 			"score": 30,
	// 			"group": []
	// 		}, {
	// 			"title": "接單/報價/估價",
	// 			"score": 44,
	// 			"group": []
	// 		}, {
	// 			"title": "一般性電話客服",
	// 			"score": 14,
	// 			"group": []
	// 		}, {
	// 			"title": "技術性電話客服",
	// 			"score": 36,
	// 			"group": []
	// 		}, {
	// 			"title": "零組件採購/追蹤",
	// 			"score": 37,
	// 			"group": []
	// 		}, {
	// 			"title": "製圖",
	// 			"score": 41,
	// 			"group": []
	// 		}, {
	// 			"title": "繞線計算",
	// 			"score": 47,
	// 			"group": []
	// 		}, {
	// 			"title": "訊號校正",
	// 			"score": 39,
	// 			"group": []
	// 		}, {
	// 			"title": "焊接",
	// 			"score": 39,
	// 			"group": []
	// 		}, {
	// 			"title": "矽鋼片壓製",
	// 			"score": 41,
	// 			"group": []
	// 		}, {
	// 			"title": "備料",
	// 			"score": 32,
	// 			"group": []
	// 		}, {
	// 			"title": "繞線",
	// 			"score": 33,
	// 			"group": []
	// 		}, {
	// 			"title": "入線",
	// 			"score": 27,
	// 			"group": []
	// 		}, {
	// 			"title": "結線",
	// 			"score": 38,
	// 			"group": []
	// 		}, {
	// 			"title": "整線",
	// 			"score": 27,
	// 			"group": []
	// 		}, {
	// 			"title": "包布",
	// 			"score": 26,
	// 			"group": []
	// 		}, {
	// 			"title": "磁石黏著",
	// 			"score": 32,
	// 			"group": []
	// 		}, {
	// 			"title": "磁石定位",
	// 			"score": 40,
	// 			"group": []
	// 		}, {
	// 			"title": "烤箱操作",
	// 			"score": 11,
	// 			"group": []
	// 		}, {
	// 			"title": "動平衡",
	// 			"score": 30,
	// 			"group": []
	// 		}, {
	// 			"title": "電機組裝",
	// 			"score": 43,
	// 			"group": []
	// 		}, {
	// 			"title": "變速輪組裝",
	// 			"score": 28,
	// 			"group": []
	// 		}, {
	// 			"title": "變速機組裝",
	// 			"score": 16,
	// 			"group": []
	// 		}, {
	// 			"title": "清潔",
	// 			"score": 32,
	// 			"group": []
	// 		}, {
	// 			"title": "噴漆",
	// 			"score": 24,
	// 			"group": []
	// 		}, {
	// 			"title": "試機",
	// 			"score": 32,
	// 			"group": []
	// 		}, {
	// 			"title": "搬運",
	// 			"score": 25,
	// 			"group": []
	// 		}, {
	// 			"title": "堆高機操作",
	// 			"score": 17,
	// 			"group": []
	// 		}, {
	// 			"title": "客戶資料蒐集",
	// 			"score": 2415,
	// 			"group": []
	// 		}, {
	// 			"title": "供應商資料蒐集",
	// 			"score": 2415,
	// 			"group": []
	// 		}, {
	// 			"title": "研發案討論",
	// 			"score": 2415,
	// 			"group": []
	// 		}, {
	// 			"title": "研發案資料製作",
	// 			"score": 4025,
	// 			"group": []
	// 		}, {
	// 			"title": "研發案實作",
	// 			"score": 4025,
	// 			"group": []
	// 		}],
	// 		"working_hours": [{
	// 			"title": "早班",
	// 			"key": "morning",
	// 			"start": 28800000,
	// 			"end": 43200000
	// 		}, {
	// 			"title": "午班",
	// 			"key": "afternoon",
	// 			"start": 48600000,
	// 			"end": 63000000
	// 		}, {
	// 			"title": "晚班",
	// 			"key": "night",
	// 			"start": 64800000,
	// 			"end": 72000000
	// 		}]
	// 	}).then(function(company){
	// 		newCompany = company;
	// 		var employeeList = [
	// 			{ "name": "江武翰", "id_number": "OS5692A", "passcode": "75267181" },
	// 			{ "name": "紀志榮", "id_number": "OS4141A", "passcode": "37961251" },
	// 			{ "name": "劉若涵", "id_number": "OS7200A", "passcode": "63293949" },
	// 			{ "name": "陳智傑", "id_number": "OS3457A", "passcode": "82163366" },
	// 			{ "name": "吳明姍", "id_number": "OSXXXXA", "passcode": "93612877" },
	// 			{ "name": "賴奎宏", "id_number": "PL0299A", "passcode": "27114218" },
	// 			{ "name": "賴怡臻", "id_number": "PLXXXXA", "passcode": "59557925" },
	// 			{ "name": "柯春妹", "id_number": "PL3988A", "passcode": "27967164" },
	// 			{ "name": "盧岳珈", "id_number": "PL3952A", "passcode": "19967671" },
	// 			{ "name": "王俊岳", "id_number": "PL8133A", "passcode": "79135879" },
	// 			{ "name": "王暐誌", "id_number": "PL1437A", "passcode": "74335468" },
	// 			{ "name": "陳奇樟", "id_number": "PL8866A", "passcode": "13638142" },
	// 			{
	// 				"name": "施閎凱",
	// 				"id_number": "AD3680Z",
	// 				"passcode": "11235813",
	// 				"permission": ["leave", "manage_employee", "manage_accounting"]
	// 			}
	// 		];
	// 		var resolver = Promise.defer();
	// 		var addEmployee = function(){
	// 			var employeeProperty = employeeList.shift();
	// 			if(employeeProperty){
	// 				company.AddEmployee(employeeProperty).then(function(employee){
	// 					addEmployee();
	// 				}).catch(function(err){
	// 					resolver.reject(err);
	// 				});;
	// 			}
	// 			else{
	// 				resolver.resolve();
	// 			}
	// 		}
	// 		addEmployee();
	// 		return resolver.promise;
	// 	}).then(function(){
	// 		return Promise.resolve(Company.find({}).exec());
	// 	}).then(function(companys){
	// 		companys.forEach(function(company){
	// 			if(newCompany.id != company.id){
	// 				company.employee_list.forEach(function(employee){
	// 					var found = newCompany.employee_list.some(function(targetEmployee){
	// 						if(targetEmployee.id_number == employee.id_number){
	// 							targetEmployee.working_record.raw_record_list = targetEmployee.working_record.raw_record_list.concat(employee.working_record.raw_record_list);
	// 							targetEmployee.punch_record.raw_record_list = targetEmployee.punch_record.raw_record_list.concat(employee.punch_record.raw_record_list);
	// 							return true;
	// 						}
	// 					});
	// 					if(!found){
	// 						logger.error("Not found employee!!!");
	// 					}
	// 				});
	// 			}
	// 		});
	// 		return Promise.resolve(newCompany.save());
	// 	}).then(function(){

	// 		res.json(newCompany);
	// 	}).catch(function(err){
	// 		logger.error(err);
	// 		res.status(500).send("Some Error:" + err.message);
	// 	});
	// });
}