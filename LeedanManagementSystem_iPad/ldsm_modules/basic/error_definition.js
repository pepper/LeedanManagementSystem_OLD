var errorBuilder = require("error-builder");

exports.NotExistError = errorBuilder.create("NotExistError", -103, "Target not exist");
exports.DataNeedLoad = errorBuilder.create("DataNeedLoad", -105, "Data need fetch from server");
exports.InputPropertyNotAcceptError = errorBuilder.create("InputPropertyNotAcceptError", -107, "Input property not accept");

exports.CompanyNotLoginError = errorBuilder.create("CompanyNotLoginError", -201, "Company currently not login");
exports.EmployeeNotLoginError = errorBuilder.create("EmployeeNotLoginError", -203, "There is no employee login");