var errorBuilder = require("error-builder");

exports.NotExistError = errorBuilder.create("NotExistError", -101, "Target not exist");
exports.InputPropertyNotAcceptError = errorBuilder.create("InputPropertyNotAcceptError", -103, "Input property not accept");