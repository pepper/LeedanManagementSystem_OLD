var logger = require("../utilities/logger");

exports.sendErrorResponse = function(req, res, err, httpResponseCode, notResponse, next){
	if(notResponse){
		logger.error(err);
		res.error.push(err);
		next();
	}
	else{
		res.result.message = err.message;
		res.status(httpResponseCode).json(res.result);
	}
}
exports.sendSystemErrorResponse = function(req, res, err){
	logger.error(err);
	res.result.message = err.message;
	res.status(500).json(res.result);
	// res.sendStatus(500);
}
