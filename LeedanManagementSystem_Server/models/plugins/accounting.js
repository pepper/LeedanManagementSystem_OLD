var mongoose = require("mongoose");
var util = require("util");
var Promise = require("bluebird");

exports.AccountingPluginForCompany = function(schema, options){
	schema.add({
		// Working Record
		working_item_list:[{
			title					:{ type: String, trim: true, default: "" },
			score					:{ type: Number },
			group					:[{ type: String, trim: true, default: "" }]
		}],
	});
	schema.methods.GeneratePaySheet = function(start, end){
		var company = this;
		var resolver = Promise.defer();
		var employeePromiseList = [];
		company.employee_list.forEach(function(employee){
			employeePromiseList.push(employee.GeneratePaySheet(company, start, end));
		});
		Promise.all(employeePromiseList).then(function(){
			logger.warn("Company Save");
			return company.SaveWithPromise(true);
		}).then(function(){
			resolver.resolve(company);
		}).catch(function(err){
			logger.error(err);
			resolver.reject(err);
		});
		return resolver.promise;
	}
}

exports.AccountingPluginForEmployee = function(schema, options){
	schema.add({
		leave:{
			quota:{
				annual_leave		:{ type: Number, min: 0, default: 0 },			// 以小時計
				annual_leave_left	:{ type: Number, min: 0, default: 0 }			// 以小時計
			},
		}
		accounting:{
			salary:{
				type					:{ type: String, trim: true, default: "" },	// wage_hour, wage_day, wage_week, salary
				value					:{ type: Number, min: 0, default: 0 }
			},
			professional_allowance		:{ type: Number, min: 0, default: 0 },		// 職務加給
			no_leave_bonus				:{ type: Number, min: 0, default: 0 },		// 全勤獎金
			travel_allowance			:{ type: Number, min: 0, default: 0 },		// 交通補貼
			holiday_bonus				:{ type: Number, min: 0, default: 0 },		// 年終獎金
			food_allowance				:{ type: Number, min: 0, default: 0 },		// 伙食補貼
			labor_insurance				:{ type: Number, min: 0, default: 0 },		// 勞保費
			health_insurance			:{ type: Number, min: 0, default: 0 }		// 健保費
		},
		pay_sheet:[{
			generate_datetime			:{ type: Date },
			duration:{
				start					:{ type: Date },
				end						:{ type: Date },
			},
			title						:{ type: String, trim: true, default: "" },
			name						:{ type: String, trim: true, default: "" },
			id_number					:{ type: String, trim: true, default: "" },
			punch_record:{
				date_record_list:[{
					date				:{ type: Date},
					working_hours:[{
						title			:{ type: String, trim: true, default: "" },
						key				:{ type: String, trim: true, default: "" },
						start_time		:{ type: Date},
						end_time		:{ type: Date},
						real_start_time	:{ type: Date},
						real_end_time	:{ type: Date}
					}],
					raw_record_list:[{
						datetime		:{ type: Date},
						type			:{ type: String, trim: true, default: "" }
					}]
				}],
				late:{
					times				:{ type: Number, min: 0, default: 0 },
					cumulative_time		:{ type: Number, min: 0, default: 0 }		// 以分鐘計
				},
				raw_record_list:[{
					datetime			:{ type: Date},
					type				:{ type: String, trim: true, default: "" }
				}]
			},
			leave:{
				quota:{
					annual_leave_left	:{ type: Number, min: 0, default: 0 }		// 以小時計
				},
				total:{
					personal			:{ type: Number, min: 0, default: 0 },		// 以小時計
					sick				:{ type: Number, min: 0, default: 0 },		// 以小時計
					annual				:{ type: Number, min: 0, default: 0 }		// 以小時計
				},
				raw_record_list:[{
					datetime			:{ type: Date},
					approved:{
						name			:{ type: String, trim: true, default: "" },
						employee		:{ type: ObjectId, ref: "Employee" }
					},
					type				:{ type: String, trim: true, default: "" },	// personal, sick, annual
					start				:{ type: Date},
					end					:{ type: Date},
					description			:{ type: String, trim: true, default: "" }
				}]
			},
			accounting:{
				total					:{ type: Number, min: 0, default: 0 },		// 總計
				salary:{
					type				:{ type: String, trim: true, default: "" },	// wage_hour, wage_day, wage_week, salary
					value				:{ type: Number, min: 0, default: 0 }
				},
				professional_allowance	:{ type: Number, min: 0, default: 0 },		// 職務加給
				no_leave_bonus			:{ type: Number, min: 0, default: 0 },		// 全勤獎金
				travel_allowance		:{ type: Number, min: 0, default: 0 },		// 交通補貼
				holiday_bonus			:{ type: Number, min: 0, default: 0 },		// 年終獎金
				food_allowance			:{ type: Number, min: 0, default: 0 },		// 伙食補貼
				labor_insurance			:{ type: Number, min: 0, default: 0 },		// 勞保費
				health_insurance		:{ type: Number, min: 0, default: 0 },		// 健保費
				late_fines				:{ type: Number, min: 0, default: 0 },		// 遲到扣薪
				late_fines_hour			:{ type: Number, min: 0, default: 0 }		// 遲到扣薪
			}
		}]
	});
	schema.methods.GeneratePaySheet = function(company, startInput, endInput){
		var employee = this;
		var start = new Date(startInput);
		var end = new Date(endInput);
		if(util.isDate(start) && util.isDate(end) && end > start){
			var newPaySheet = {
				generate_datetime: new Date(),
				duration:{
					start: start,
					end: end
				},
				title: company.title + " " + start.getFullYear() + "年" + (start.getMonth() + 1) + "月" + start.getDate() + "日~" + end.getFullYear() + "年" + (end.getMonth() + 1) + "月" + end.getDate() + "日 薪資單",
				name: employee.name,
				id_number: employee.id_number,
				punch_record:{
					date_record_list: [],
					late:{
						times: 0,
						cumulative_time: 0
					},
					raw_record_list: []
				},
				leave:{
					quota:{
						annual_leave_left: employee.leave.quota.annual_leave_left
					},
					total:{
						personal: 0,
						sick: 0,
						annual: 0,
					},
					raw_record_list:[]
				},
				accounting: employee.accounting
			};
			newPaySheet.accounting.late_fines = 0;
			end.setDate(end.getDate() + 1);
			
			employee.punch_record.raw_record_list.forEach(function(rawRecord){
				if(rawRecord.datetime >= start && rawRecord.datetime < end){
					newPaySheet.punch_record.raw_record_list.push(rawRecord);
				}
			});

			var rawRecordList = newPaySheet.punch_record.raw_record_list.slice(0);
			var dateRecordDateSeed = new Date(start);
			var dateRecordWorkingHoursEndTimeSeed = new Date(dateRecordDateSeed.getTime() + ((86400000 + company.working_hours[0].start + company.working_hours[company.working_hours.length - 1].end) / 2));
			do{
				var newDateRecord = {
					date: new Date(dateRecordDateSeed),
					working_hours: [],
					raw_record_list: []
				}
				company.working_hours.forEach(function(workingHours){
					newDateRecord.working_hours.push({
						title: workingHours.title,
						key: workingHours.key,
						start_time: new Date(newDateRecord.date.getTime() + workingHours.start),
						end_time: new Date(newDateRecord.date.getTime() + workingHours.end)
					});
				});
				var i = rawRecordList.length;
				while (i--) {
					if(rawRecordList[i].datetime < dateRecordWorkingHoursEndTimeSeed){
						var rawRecord = rawRecordList.splice(i, 1)[0];
						
						newDateRecord.raw_record_list.push(rawRecord);
						
						var currentDelta = 86400000;
						var currentKey = "";
						newDateRecord.working_hours.forEach(function(workingHour){
							var delta = 86400000;
							switch(rawRecord.type){
								case "OnDuty":
									delta = Math.abs(workingHour.start_time - rawRecord.datetime);
									break;
								case "Break":
								case "OffDuty":
									delta = Math.abs(workingHour.end_time - rawRecord.datetime);
									break;
							}
							if(delta < currentDelta){
								currentDelta = delta;
								currentKey = workingHour.key;
							}
						});
						newDateRecord.working_hours.some(function(workingHour){
							if(workingHour.key == currentKey){
								switch(rawRecord.type){
									case "OnDuty":
										if(!(workingHour.real_start_time && workingHour.real_start_time < rawRecord.datetime)){
											workingHour.real_start_time = rawRecord.datetime;
										}
										break;
									case "Break":
									case "OffDuty":
										if(!(workingHour.real_end_time && workingHour.real_end_time > rawRecord.datetime)){
											workingHour.real_end_time = rawRecord.datetime;
										}
										break;
								}
								return true;
							}
						});
					}
				}
				newPaySheet.punch_record.date_record_list.push(newDateRecord);
				dateRecordDateSeed.setDate(dateRecordDateSeed.getDate() + 1);
				dateRecordWorkingHoursEndTimeSeed.setDate(dateRecordWorkingHoursEndTimeSeed.getDate() + 1);
			} while(dateRecordWorkingHoursEndTimeSeed < end);

			// Remove old pay sheet
			var oldPaySheetIndex = -1;
			var found = employee.pay_sheet.some(function(paySheet, index){
				if(paySheet.duration.start.getTime() == newPaySheet.duration.start.getTime() && paySheet.duration.start.getTime() == newPaySheet.duration.start.getTime()){
					oldPaySheetIndex = index;
					return true;
				}
			});
			if(found){
				employee.pay_sheet.splice(oldPaySheetIndex, 1);
			}

			// Add new pay sheet
			employee.pay_sheet.push(newPaySheet);
			return Promise.resolve();
		}
		else{
			return Promise.reject(new error.InputPropertyNotAcceptError("End time must later then start time."));
		}
	}
}