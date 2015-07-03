var path = require("path");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var Jimp = require("jimp");
var base64 = require('node-base64-image');
var validator = require("validator");
var _ = require("underscore");

// Middleware
var responseMiddleware = require("../middlewares/response");

var logger = require("../utilities/logger");
var error = require("../utilities/error");

// Model
var Company = require("../models/company");
var Employee = require("../models/employee");

exports.registerCompanyRouter = function(router){
	router.post("/login", function(req, res){
		if(validator.toString(req.body.username) != "" && validator.toString(req.body.password) != ""){
			Promise.resolve(Company.find({
				username: req.body.username,
				password: req.body.password
			}).exec()).then(function(companys){
				if(companys && companys.length > 0){
					res.result.success = true;
					res.result.message = "Login Success";
					res.result.objects = [companys[0]];
					res.status(200).json(res.result);
				}
				else{
					res.result.message = "Company not found.";
					res.status(404).json(res.result);
				}
			}).catch(function(err){
				res.status(500).json(res.result);
			});
		}
		else{
			res.result.message = "Username or password not accept.";
			res.status(403).json(res.result);
		}
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
		var company;
		Promise.resolve(Company.find({}).exec()).then(function(companys){
			if(companys && companys.length > 0){
				company = companys[0];
				return Promise.resolve(Employee.find({
					company: company
				}, {
					"company": 1,
					"name": 1,
					"id_number": 1,
					"serial_number": 1,
					"passcode": 1,
					"group": 1,
					"avatar": 1,
					"permission": 1,
					"hash_version": 1,
					"working_record.statistics": 1,
				}).exec());
				return Promise.resolve(companys[0]);
			}
			return Promise.reject(new error.NotExistError("Company not exist."));
		}).then(function(employees){
			var companyObject = company.toObject();
			if(employees && employees.length > 0){
				var newArray = company.employee_list.map(function(employeeId){
					var employeeData = null;
					var found = employees.some(function(employee){
						if(employeeId.toString() == employee.id){
							employeeData = employee;
							return true;
						}
					});
					if(!found){
						throw new error.NotExistError("Employee not exist.")
					}
					else{
						return employeeData;
					}
				});
				companyObject.employee_list = newArray;
			}
			res.result.success = true;
			res.result.message = "Get Company Success";
			res.result.objects = [companyObject];
			res.status(200).json(res.result);
		}).catch(error.NotExistError, function(err){
			responseMiddleware.sendErrorResponse(req, res, err, 404);
		}).catch(function(err){
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
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
}

exports.registerEmployeeRouter = function(router){
	router.get("/company/:company_id/employee", function(req, res){
		Promise.resolve(Employee.find({
			company: req.company
		}, {
			"company": 1,
			"name": 1,
			"id_number": 1,
			"serial_number": 1,
			"passcode": 1,
			"group": 1,
			"avatar": 1,
			"permission": 1,
			"hash_version": 1,
			"working_record.statistics": 1,
		}).exec()).then(function(employees){
			res.result.success = true;
			res.result.message = "Get Employees Success";
			res.result.objects = employees;
			res.status(200).json(res.result);
		}).catch(function(err){
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});;
	});
	router.post("/company/:company_id/employee", function(req, res){
		var imageBuffer = new Buffer(req.body.avatar, "base64");
		var tempImageFilePath = path.join(__dirname, "..", "temp", "image.jpg");
		var smallImageFilePath = path.join(__dirname, "..", "temp", "imageSmall.jpg");
		fs.writeFileAsync(tempImageFilePath, imageBuffer).then(function(){
			var resolver = Promise.pending();
			var imageJimp = new Jimp(tempImageFilePath, function(err, image){
				if(err){
					resolver.resolve("");
				}
				if(image){
					var width = image.bitmap.width;
					var height = image.bitmap.height;
					image.crop((width - height)/2, 0, height, height)
					.resize(300, 300)
					.write(smallImageFilePath)
					.getBuffer(Jimp.MIME_JPEG, function(err, buf){
						resolver.resolve(buf);
					});
					fs.unlink(tempImageFilePath);
					fs.unlink(smallImageFilePath);
				}
				else{
					resolver.resolve("");
				}
			});
			return resolver.promise;
		}).then(function(avatar){
			req.body.avatar = avatar.toString("base64");
			return req.company.AddEmployee(req.body);
		}).then(function(employee){
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
	router.get("/company/:company_id/employee/:employee_id", function(req, res){
		res.result.success = true;
		res.result.message = "Get Employee Success";
		res.result.objects = [req.employee];
		res.status(200).json(res.result);
	});
	router.put("/company/:company_id/employee/:employee_id", function(req, res){
		req.employee.UpdateProperty(req.body, true).then(function(){
			res.result.success = true;
			res.result.message = "Update Employee Success";
			res.result.objects = [req.employee];
			res.status(200).json(res.result);
		}).catch(function(err){
			responseMiddleware.sendSystemErrorResponse(req, res, err);
		});
	});
	// router.delete("/company/:company_id/employee/:employee_id", function(req, res){
	// 	req.company.employee_list.id(req.employee.id).remove();
	// 	req.company.SaveWithPromise(true).then(function(){
	// 		res.result.success = true;
	// 		res.result.message = "Remove Employee Success";
	// 		res.result.objects = [req.employee];
	// 		res.status(200).json(res.result);
	// 	}).catch(function(err){
	// 		responseMiddleware.sendSystemErrorResponse(req, res, err);
	// 	});
	// });
}