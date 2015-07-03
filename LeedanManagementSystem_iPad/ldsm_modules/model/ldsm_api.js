var React = require("react-native");
var Promise = require("bluebird");

var ErrorDefinition = require("../basic/error_definition");
var AppDispatcher = require("./dispatcher");
var Constant = require("./constant");

var basicUrl = "http://localhost/";
var apiUrl = basicUrl + "api/";

var {
	AsyncStorage,
} = React;

// Local Cache
var saveDataToAsyncStorage = function(key, object){
	var resolver = Promise.pending();
	AsyncStorage.setItem(key, ((typeof object == "string")?object:JSON.stringify(object))).then(function(){
		resolver.resolve();
	}).catch(function(err){
		resolver.reject(err);
	}).done();
	return resolver.promise;
}
var getDataFromAsyncStorage = function(key){
	var resolver = Promise.pending();
	AsyncStorage.getItem(key).then(function(value){
		if(value !== null){
			try{
				var object = JSON.parse(value);
			}
			catch(e){
				return resolver.resolve(value);
			}
			return resolver.resolve(object);
		}
		else{
			resolver.reject(new ErrorDefinition.NotExistError("There is no value for this key: " + key));
			// resolver.reject(new Error("No Value"));
		}
	}).catch(function(err){
		resolver.reject(err);
	})
	.done();
	return resolver.promise;
}
var removeDataFromAsyncStorage = function(key){
	var resolver = Promise.pending();
	AsyncStorage.removeItem(key).then(function(){
		resolver.resolve();
	}).catch(function(err){
		resolver.reject(err);
	}).done();
	return resolver.promise;
}

// RESTful API
function status(response){
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	throw new Error(response.status + " " + response._bodyText);
}
function json(response){
	return response.json();
}
var request = function(method, url, data){
	AppDispatcher.handleRequestAction({
		actionType: Constant.API_REQUEST_START,
		data: {
			url: url,
			data: data
		}
	});
	var resolver = Promise.pending();
	fetch(url, {
		method: method,
		headers:{
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: (data)?JSON.stringify(data):null,
	})
	.then(status)
	.then(json)
	.then(function(json) {
		if(json.success){
			AppDispatcher.handleRequestAction({
				actionType: Constant.API_REQUEST_SUCCESS,
				data: {
					message: json.message,
				}
			});
			resolver.resolve(json);
		}
		else{
			AppDispatcher.handleRequestAction({
				actionType: Constant.API_REQUEST_FAIL,
				data: {
					message: json.message,
				}
			});
			resolver.reject(new Error(json.message));
		}
	}).catch(function(error) {
		AppDispatcher.handleRequestAction({
			actionType: Constant.API_REQUEST_ERROR,
			data: {
				message: error.toString(),
			}
		});
		resolver.reject(error);
	});
	return resolver.promise;
}
var getAsyncStorageEmployeeKey = function(employeeId){
	return Constant.EMPLOYEE_DATA + "_" + employeeId;
}

var api = {
	checkCompanyLogin: function(){
		return getDataFromAsyncStorage(Constant.CURRENT_LOGIN_COMPANY_ID);
	},
	loginCompany: function(username, password){
		var url = apiUrl + "login";
		var resolver = Promise.pending();
		var companyId;
		request("post", url, {
			"username": username,
			"password": password,
		}).then(function(body){
			companyId = body.objects[0]._id;
			return saveDataToAsyncStorage(Constant.CURRENT_LOGIN_COMPANY_ID, companyId);
		}).then(function(){
			resolver.resolve(companyId);
		}).catch(function(err){
			resolver.reject(err);
		});
		return resolver.promise;
	},
	logoutCompany: function(){
		var resolver = Promise.pending();
		removeDataFromAsyncStorage(Constant.CURRENT_LOGIN_COMPANY_ID).then(function(){
			return removeDataFromAsyncStorage(Constant.CURRENT_LOGIN_COMPANY_DATA);
		}).then(function(){
			resolver.resolve();
		}).catch(function(err){
			resolver.reject(err);
		});
		return resolver.promise;
	},
	loadCompany: function(companyId){
		var url = apiUrl + "company/" + companyId;
		var resolver = Promise.pending();
		var company;
		request("get", url).then(function(body){
			company = body.objects[0];
			return saveDataToAsyncStorage(Constant.CURRENT_LOGIN_COMPANY_DATA, company);
		}).then(function(){
			resolver.resolve(company);
		}).catch(function(err){
			resolver.reject(err);
		});
		return resolver.promise;
	},
	createEmployee: function(companyId, name, idNumber, passcode, permission, avatar){
		var url = apiUrl + "company/" + companyId + "/employee";
		var resolver = Promise.pending();
		request("post", url, {
			name: name,
			id_number: idNumber,
			passcode: passcode,
			permission: permission,
			avatar: avatar,
		}).then(function(body){
			resolver.resolve(body.objects[0]);
		}).catch(function(err){
			resolver.reject(err);
		});
		return resolver.promise;
	},
	loadEmployee: function(company, employeeId){
		var resolver = Promise.pending();
		var asyncStorageEmployeeKey = getAsyncStorageEmployeeKey(employeeId);
		Promise.resolve(function(){
			var asyncStorageResolver = Promise.pending();
			getDataFromAsyncStorage(asyncStorageEmployeeKey).then(function(employeeInAsyncStorage){
				asyncStorageResolver.resolve(employeeInAsyncStorage);
			}).catch(ErrorDefinition.NotExistError, function(err){
			// 	console.log("A-2");
				asyncStorageResolver.resolve();
			}).catch(function(err){
				// if(err.message == "NoValue"){
				// 	asyncStorageResolver.resolve();
				// }
				// else{
				// 	console.log("A-3");
					asyncStorageResolver.reject(err);
				// }
			});
			return asyncStorageResolver.promise;
		}()).then(function(employeeInAsyncStorage){
			var needFetch = true;
			if(employeeInAsyncStorage){
				var found = company.employee_list.some(function(employee){
					if(employee._id == employeeInAsyncStorage._id){
						if(employee.hash_version.current && employeeInAsyncStorage.hash_version.current){
							needFetch = false;
						}
						return true;
					}
				});
			}
			if(needFetch){
				var url = apiUrl + "company/" + company._id + "/employee/" + employeeId;
				var employee;
				var fetchResolver = Promise.pending();
				request("get", url).then(function(body){
					employee = body.objects[0];
					return saveDataToAsyncStorage(asyncStorageEmployeeKey, employee);
				}).then(function(){
					fetchResolver.resolve(employee);
				}).catch(function(err){
					fetchResolver.reject(err);
				});
				return fetchResolver.promise;
			}
			else{
				return Promise.resolve(employeeInAsyncStorage);
			}
		}).then(function(employee){
			resolver.resolve(employee);
		}).catch(function(err){
			resolver.reject(err);
		});

		return resolver.promise;
	},
	addTimePunchRecord: function(companyId, employeeId, type){
		var url = apiUrl + "company/" + companyId + "/employee/" + employeeId + "/time_punch_record";
		var resolver = Promise.pending();
		var employee;
		request("post", url, {
			"type": type,
		}).then(function(body){
			employee = body.objects[0];
			return saveDataToAsyncStorage(getAsyncStorageEmployeeKey(employeeId), employee);
		}).then(function(){
			resolver.resolve(employee);
		}).catch(function(err){
			resolver.reject(err);
		});
		return resolver.promise;
	},
	addWorkingRecord: function(companyId, employeeId, workingItemList){
		var url = apiUrl + "company/" + companyId + "/employee/" + employeeId + "/working_record";
		var resolver = Promise.pending();
		var employee;
		request("post", url, {
			"working_item_list": workingItemList,
		}).then(function(body){
			employee = body.objects[0];
			return saveDataToAsyncStorage(getAsyncStorageEmployeeKey(employeeId), employee);
		}).then(function(){
			resolver.resolve(employee);
		}).catch(function(err){
			resolver.reject(err);
		});
		return resolver.promise;
	}
}

module.exports = api;