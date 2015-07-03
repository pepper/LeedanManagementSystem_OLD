var mongoose = require("mongoose");
var util = require("util");
var Promise = require("bluebird");

var basicPlugin = require("./basic");

var ObjectId = mongoose.Schema.Types.ObjectId;

var TimePunchHistorySchema = new mongoose.Schema({
	company						:{ type: ObjectId, ref: "Company" },
	employee					:{ type: ObjectId, ref: "Employee" },
	date						:{ type: Date },
	punch_record_list:[{
		datetime				:{ type: Date},
		type					:{ type: String, trim: true, default: "" }
	}],
	leave_record_list:[{
		datetime				:{ type: Date},
		approved:{
			name				:{ type: String, trim: true, default: "" },
			employee			:{ type: ObjectId, ref: "Employee" }
		},
		type					:{ type: String, trim: true, default: "" },		// personal, sick, annual
		start					:{ type: Date},
		end						:{ type: Date},
		description				:{ type: String, trim: true, default: "" }
	}],
	overtime:[{
		start					:{ type: Date},
		end						:{ type: Date},
		hour					:{ type: Number, min: 0, default: 0 },			// 以分鐘計
	}]
});

// //Mongoose Register
mongoose.model("TimePunchHistory", TimePunchHistorySchema);

// 根據時間切分原則作為日期切分點
exports.TimePunchPluginForCompany = function(schema, options){
	// schema.plugin(basicPlugin.SaveWithPromisePlugin);
	schema.add({
		time_punch:{
			recommend_record:[{
				type					:{ type: String, trim: true, default: "" },
				start					:{ type: Number }, // Offset minute from 00:00 at timezone +0
				end						:{ type: Number },
			}],
		}
	});

	schema.methods.UpdateRecommendRecord = function(property, save){
		var instance = this;
		if(property.time_punch && util.isArray(property.time_punch.recommend_record)){
			// ToDo: Need to check overlap
			instance.time_punch.recommend_record = property.time_punch.recommend_record;
			return instance.SaveWithPromise(save);
		}
		return Promise.resolve();
	}
}

exports.TimePunchPluginForEmployee = function(schema, options){
	schema.add({
		time_punch:{
			punch_record_list:[{
				datetime				:{ type: Date},
				type					:{ type: String, trim: true, default: "" }
			}],
			leave_record_list:[{
				datetime				:{ type: Date},
				approved:{
					name				:{ type: String, trim: true, default: "" },
					employee			:{ type: ObjectId, ref: "Employee" }
				},
				type					:{ type: String, trim: true, default: "" },		// personal, sick, annual
				start					:{ type: Date},
				end						:{ type: Date},
				description				:{ type: String, trim: true, default: "" }
			}],
			overtime:[{
				start					:{ type: Date},
				end						:{ type: Date},
				hour					:{ type: Number, min: 0, default: 0 },			// 以分鐘計
			}]
		}
	});

	schema.plugin(basicPlugin.SaveWithPromisePlugin);

	schema.methods.AddTimePunchRecord = function(type, save){
		var instance = this;
		instance.time_punch.punch_record_list.push({
			type: type,
			datetime: new Date()
		});
		// if(type == "Break" || type == "OffDuty"){
		// 	employee.thing_need_to_do.push({
		// 		type: "NEED_ADD_WORKING_RECORD",
		// 		datetime: new Date()
		// 	});
		// }
		return instance.SaveWithPromise(save);
	}
}