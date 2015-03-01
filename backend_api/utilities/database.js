var mongoose = require("mongoose");
var Promise = require("bluebird");
var logger = require("./logger");

var config = require("../config");

var mongodbConnected = false;

exports.connect = function(callback){
	var resolver = Promise.defer();
	if(!mongodbConnected){
		var db = mongoose.connection;
		db.on("error", function(err){
			logger.error("Can't connect to MongoDB, please check your MongoDB service is on. (" + err + ")");
			logger.error(err.stack);
			resolver.reject(err);
		});
		db.once("open", function callback(){
			logger.info("MongoDB connected.");
			mongodbConnected = true;
			resolver.resolve(db);
		});
		mongoose.connect("mongodb://" + config.MONGO_DATABASE_ADDRESS + "/" + config.MONGO_DATABASE_NAME);
	}
	else{
		resolver.resolve(db);
	}
	return resolver.promise;
}

// Export mongoose
exports.mongoose = mongoose;