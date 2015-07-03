var mongoose = require("mongoose");
var validator = require("validator");
var crypto = require("crypto");
var util = require("util");
var Promise = require("bluebird");
var _ = require("underscore");
var longStackTraces = require("long-stack-traces");

var ObjectId = mongoose.Schema.Types.ObjectId;

var logger = require("../../utilities/logger");

exports.DocumentVersionPlugin = function(schema, options){
	schema.add({
		create_datetime			:{ type: Date },			// 建立日期
		last_modify_datetime	:{ type: Date },			// 最後修改日期
		hash_version:{
			hash				:{type: String},
			current				:{type: Number, default: 0}
		}
	});
	schema.pre("save", function(next){
		var instance = this;
		var object = instance.toObject();
		if(instance.isNew || !instance.create_datetime){
			instance.create_datetime = new Date();
		}
		instance.last_modify_datetime = new Date();
		delete object.create_datetime;
		delete object.last_modify_datetime;
		delete object.__v;
		delete object.hash_version;
		var newHash = crypto.createHash("md5").update(JSON.stringify(object)).digest("hex");
		if(!instance.hash_version){
			instance.hash_version = {
				hash: newHash,
				current: 0
			}
		}
		else if(newHash != instance.hash_version.hash){
			instance.hash_version.hash = newHash;
			instance.hash_version.current = instance.hash_version.current + 1;
		}
		next();
	});
}

var ModifiedFlagPlugin = function(schema, options){
	schema.methods.AddModified = function(subject){
		var instance = this;
		if(!instance.modified){
			instance.modified = new Array();
		}
		if(instance.modified.indexOf(subject) < 0){
			instance.modified.push(subject);
		}
	}
	schema.methods.IsModified = function(subject){
		var instance = this;
		if(instance.modified && instance.modified.indexOf(subject) >= 0){
			return true;
		}
		else{
			return false;
		}
	}
}
exports.ModifiedFlagPlugin = ModifiedFlagPlugin;

var SaveWithPromisePlugin = function(schema, options){
	schema.methods.SaveWithPromise = function(save){
		var instance = this;
		if(save){
			var resolver = Promise.defer();
			instance.save(function(err){
				if(err){
					logger.error(err);
					return resolver.reject(err);
				}
				return resolver.resolve();
			});
			return resolver.promise;
		}
		else{
			return Promise.resolve();
		}
	}
}
exports.SaveWithPromisePlugin = SaveWithPromisePlugin;

exports.SimplePropertyUpdatePlugin = function(schema, options){
	schema.plugin(SaveWithPromisePlugin);
	schema.plugin(ModifiedFlagPlugin);
	schema.methods.UpdateSimpleProperty = function(property, propertyList, save){
		var instance = this;
		function updateValue(propertyPath, type){
			var canUpdate = true;
			var parts = propertyPath.split(".");
			var target = instance;
			if(parts.length > 1){
				for(var i = 0; i < parts.length - 1; i++){
					if(!target[parts[i]]){
						target[parts[i]] = {};
					}
					target = target[parts[i]];
				}
			}
			var value = property;
			for(var i in parts){
				if(value[parts[i]]){
					value = value[parts[i]];
				}
				else{
					canUpdate = false;
				}
			}
			if(canUpdate){
				var lastPart = parts[parts.length - 1];
				switch(type){
					case "number":
						if(target[lastPart] != value){
							target[lastPart] = value;
							instance.AddModified(lastPart);
						}
						break;
					case "string":
						if(validator.toString(value) != "" && target[lastPart] != value){
							target[lastPart] = value;
							instance.AddModified(lastPart);
						}
						break;
					case "array":
						if(util.isArray(value) && ((target[lastPart].length != value.length) || (_.difference(value, target[lastPart]).length != 0))){
							target[lastPart] = value;
							instance.AddModified(lastPart);
						}
						break;
				}
			}
		}
		if(util.isArray(propertyList.string_property)){
			propertyList.string_property.forEach(function(propertyPath){
				updateValue(propertyPath, "string");
			});
		}
		if(util.isArray(propertyList.number_property)){
			propertyList.number_property.forEach(function(propertyPath){
				updateValue(propertyPath, "number");
			});
		}
		if(util.isArray(propertyList.array_property)){
			propertyList.array_property.forEach(function(propertyPath){
				updateValue(propertyPath, "array");
			});
		}
		return instance.SaveWithPromise(save);
	}
}

// exports.ActionLogPlugin = function(schema, options){
// 	schema.add({
// 		action_list: [{
// 			action:			{ type: String, trim: true, default: "" },
// 			note:			{ type: String, trim: true, default: "" },
// 			value:			{ type: String, trim: true, default: "" },
// 		}]
// 	});
// 	if(options.runtime_debug){
// 		var ObjectSnapshotSchema = new mongoose.Schema({
// 			object_type			:{ type: String, trim: true, default: "" },
// 			object_id			:{ type: ObjectId },
// 			snapshot			:{ type: String, trim: true, default: "" },
// 			stack				:{ type: String, trim: true, default: "" }
// 		});
// 		ObjectSnapshotSchema.plugin(ModifiedFlagPlugin);
// 		ObjectSnapshotSchema.plugin(SaveWithPromisePlugin);
// 		mongoose.model("ObjectSnapshot", ObjectSnapshotSchema);
// 	}
// 	schema.AddActionLog = function(action, note, value){

// 	}
// 	schema.pre("save", function(next){
// 		var instance = this;
// 		next();
// 	});
// 	schema.post("save", function(instance){
// 		var object = instance.toObject();
// 	});
// }