var mongoose = require("mongoose");
var util = require("util");
var Promise = require("bluebird");
var uuid = require("uuid");
var validator = require("validator");

var logger = require("../../utilities/logger");
var error = require("../../utilities/error");
var basicPlugin = require("./basic");

var ObjectId = mongoose.Schema.Types.ObjectId;

var StockSchema = new mongoose.Schema({
	company						:{ type: ObjectId, ref: "Company" },
	title						:{ type: String, trim: true, default: "" },
	sku_number					:{ type: String, trim: true, default: "" },
	uuid						:{ type: String, trim: true, default: "" },
	serial_number				:{ type: String, trim: true, default: "" },

	stock_number				:{ type: Number, min: 0, default: 0 },
	safety_stock				:{ type: Number, min: 0, default: 0 },
	shortest_binning_days		:{ type: Number, min: 0, default: 0 },

	unit						:{ type: String, trim: true, default: "" },

	warehouse_space_list		:[{ type: ObjectId, ref: "WarehouseSpace" }],
	supplier_list				:[{ type: ObjectId, ref: "Supplier" }],
	keeper						:{ type: ObjectId, ref: "Employee" },
});

StockSchema.plugin(basicPlugin.DocumentVersionPlugin);
StockSchema.plugin(basicPlugin.ModifiedFlagPlugin);
StockSchema.plugin(basicPlugin.SaveWithPromisePlugin);
StockSchema.plugin(basicPlugin.SimplePropertyUpdatePlugin);

StockSchema.statics.CreateStock = function(company, title, skuNumber, property){
	var model = this;
	var resolver = Promise.defer();
	if(validator.toString(title) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: title is required."));
	}
	if(validator.toString(skuNumber) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: sku_number is required."));
	}

	var number = Math.floor(Math.random() * 1000000000);
	var serialNumber = ("9" + (new Array(10 - number.toString().length)).join("0") + number);
	var stock;
	Promise.resolve(model.create({
		company: company,
		title: title,
		sku_number: skuNumber,
		uuid: uuid.v4(),
		serial_number: serialNumber
	})).then(function(newStock){
		stock = newStock;
		return stock.UpdateProperty(property, true);
	}).then(function(){
		if(property.supplier && property.supplier.length > 0){
			var promiseList = property.supplier.map(function(supplierId){
				return stock.AddSupplier(supplierId);
			});
			return Promise.all(promiseList);
		}
		else{
			return Promise.resolve();
		}
	}).then(function(){
		resolver.resolve(stock);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});

	return resolver.promise;
}
StockSchema.methods.UpdateProperty = function(property, save){
	var stock = this;
	if(property.keeper){
		stock.keeper = property.keeper;
	}
	return stock.UpdateSimpleProperty(property, {
		string_property:[
			"title",
			"sku_number",
			"unit",
		],
		number_property:[
			"stock_number",
			"safety_stock",
		]
	}, save);
}
StockSchema.methods.UpdateWarehouseSpace = function(warehouseSpaceTitleList){
	var stock = this;
	var resolver = Promise.pending();
	var consition = warehouseSpaceTitleList.map(function(warehouseSpaceTitle){
		return {
			title: warehouseSpaceTitle
		};
	});
	Promise.resolve(WarehouseSpace.find({
		$and:[{
			company: stock.company,
		}, {
			$or: consition,
		}]
	}).exec()).then(function(existWarehouseSpaceList){
		var warehouseSpaceNeedCreateList = [];
		stock.warehouse_space_list = [];
		existWarehouseSpaceList.forEach(function(existWarehouseSpace){
			stock.warehouse_space_list.push(existWarehouseSpace.id);
			warehouseSpaceTitleList = _.without(warehouseSpaceTitleList, existWarehouseSpace.title);
		});
		var promiseList = warehouseSpaceTitleList.map(function(warehouseSpaceTitle){
			var createWarehouseSpaceResolver = Promise.pending();
			var warehouseSpace;
			Promise.resolve(WarehouseSpace.CreateWarehouseSpace({
				company: stock.company,
				title: warehouseSpaceTitle,
			})).then(function(newWarehouseSpace){
				warehouseSpace = newWarehouseSpace;
				return warehouseSpace.AddStock(stock);
			}).then(function(){
				createWarehouseSpaceResolver.resolve(warehouseSpace);
			}).catch(function(err){
				logger.error(err);
				createWarehouseSpaceResolver.reject(err);
			});
			return createWarehouseSpaceResolver.promise;
		});
		return Promise.all(promiseList);
	}).then(function(newWarehouseSpaceList){
		newWarehouseSpaceList.forEach(function(newWarehouseSpace){
			stock.warehouse_space_list.push(newWarehouseSpace.id);
		});
		return stock.SaveWithPromise(true);
	}).then(function(){
		// Fint out remove warehouse space
		var removeCondition = warehouseSpaceTitleList.map(function(warehouseSpaceTitle){
			return {
				title: {
					$ne: warehouseSpaceTitle
				}
			};
		});
		removeCondition.push({
			company: stock.company,
		});
		removeCondition.push({
			stock_list: stock.id,
		});
		return Promise.resolve(WarehouseSpace.find({
			$and: removeCondition,
		}).exec());
	}).then(function(removeWarehouseSpaceList){
		var promiseList = removeWarehouseSpaceList.map(function(removeWarehouseSpace){
			return removeWarehouseSpace.RemoveStock(stock);
		});
		return Promise.all(promiseList);
	}).then(function(){
		resolver.resolve(stock);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});
	return resolver.promise;
}
StockSchema.methods.AddSupplier = function(supplierId){
	var stock = this;
	var resolver = Promise.pending();
	Promise.resolve(Supplier.findById(supplierId).exec()).then(function(supplier){
		return supplier.AddStock(stock);
	}).then(function(){
		resolver.resolve();
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});
	return resolver.promise;
}
StockSchema.methods.RebuildSupplierList = function(){
	var stock = this;
	var resolver = Promise.pending();
	Promise.resolve(Supplier.find({
		"stock_list": stock.id
	}).exec()).then(function(supplierList){
		return Promise.resolve(Stock.findByIdAndUpdate(stock.id, {
			supplier_list: supplierList
		}).exec());
	}).then(function(){
		resolver.resolve(stock);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});
	return resolver.promise;
}
StockSchema.post("remove", function(stock){
	// Clear WarehouseSpace
	// Clear Supplier
});

var SupplierSchema = new mongoose.Schema({
	company						:{ type: ObjectId, ref: "Company" },
	title						:{ type: String, trim: true, default: "" },
	tax_id						:{ type: String, trim: true, default: "" },
	post_address				:{ type: String, trim: true, default: "" },
	phone						:{ type: String, trim: true, default: "" },
	fax							:{ type: String, trim: true, default: "" },
	contact:{
		name					:{ type: String, trim: true, default: "" },
		cellphone				:{ type: String, trim: true, default: "" },
		phone					:{ type: String, trim: true, default: "" },
		email					:{ type: String, trim: true, default: "" },
	},

	stock_list					:[{ type: ObjectId, ref: "Stock" }],
	order_list					:[{ type: ObjectId, ref: "Order" }],
});

// Modified
// stock

SupplierSchema.plugin(basicPlugin.DocumentVersionPlugin);
SupplierSchema.plugin(basicPlugin.ModifiedFlagPlugin);
SupplierSchema.plugin(basicPlugin.SaveWithPromisePlugin);
SupplierSchema.plugin(basicPlugin.SimplePropertyUpdatePlugin);

SupplierSchema.statics.CreateSupplier = function(company, title, property){
	var model = this;
	var resolver = Promise.defer();
	if(validator.toString(title) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: title is required."));
	}
	console.log(property);
	var supplier;
	Promise.resolve(model.create({
		company: company,
		title: title,
	})).then(function(newSupplier){
		supplier = newSupplier;
		return supplier.UpdateProperty(property, true);
	}).then(function(){
		resolver.resolve(supplier);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});

	return resolver.promise;
}
SupplierSchema.methods.UpdateProperty = function(property, save){
	var supplier = this;
	return supplier.UpdateSimpleProperty(property, {
		string_property:[
			"title",
			"tax_id",
			"post_address",
			"phone",
			"fax",
			"contact.name",
			"contact.cellphone",
			"contact.phone",
			"contact.email",
		]
	}, save);
}
SupplierSchema.methods.AddStock = function(stock){
	var supplier = this;
	var found = supplier.stock_list.some(function(existStock){
		if(existStock.toString() == stock.id){
			return true;
		}
	});
	if(found){
		return Promise.resolve();
	}
	else{
		supplier.stock_list.push(stock);
		supplier.AddModified("stock");
		return supplier.SaveWithPromise(true);
	}
}
SupplierSchema.methods.RemoveStock = function(stock){
	var supplier = this;
	var found = supplier.stock_list.some(function(existStock, index){
		if(existStock.toString() == stock.id){
			supplier.stock_list.splice(index, 1);
			return true;
		}
	});
	if(found){
		supplier.AddModified("stock");
		return supplier.SaveWithPromise(true);
	}
	else{
		return Promise.resolve();
	}
}
SupplierSchema.post("remove", function(stock){
	// Clear Stock ref
});

SupplierSchema.post("save", function(supplier){
	if(supplier.IsModified("stock")){
		var promiseList = [];
		supplier.stock_list.forEach(function(stock){
			promiseList.push(Promise.resolve(Stock.findById(stock).exec()).then(function(stock){
				stock.RebuildSupplierList();
			}));
		});
		Promise.all(promiseList).then(function(){
			logger.debug("Rebuild all stock supplier_list");
		}).catch(function(err){
			logger.error(err);
		});
	}
});

var WarehouseSpaceSchama = mongoose.Schema({
	company						:{ type: ObjectId, ref: "Company" },
	title						:{ type: String, trim: true, default: "" },
	description					:{ type: String, trim: true, default: "" },
	stock_list					:[{ type: ObjectId, ref: "Stock" }],
});

WarehouseSpaceSchama.plugin(basicPlugin.DocumentVersionPlugin);
WarehouseSpaceSchama.plugin(basicPlugin.ModifiedFlagPlugin);
WarehouseSpaceSchama.plugin(basicPlugin.SaveWithPromisePlugin);
WarehouseSpaceSchama.plugin(basicPlugin.SimplePropertyUpdatePlugin);

WarehouseSpaceSchama.statics.CreateWarehouseSpace = function(company, property){
	var model = this;
	var resolver = Promise.defer();
	if(validator.toString(property.title) == ""){
		return Promise.reject(new error.InputPropertyNotAcceptError("Property: title is required."));
	}

	var warehouseSpace;
	Promise.resolve(model.create({
		company: company,
		title: property.title,
	})).then(function(newWarehouseSpace){
		warehouseSpace = newWarehouseSpace;
		return warehouseSpace.UpdateProperty(property, true);
	}).then(function(){
		resolver.resolve(warehouseSpace);
	}).catch(function(err){
		logger.error(err);
		resolver.reject(err);
	});

	return resolver.promise;
}
WarehouseSpaceSchama.methods.UpdateProperty = function(property, save){
	var warehouseSpace = this;
	return warehouseSpace.UpdateSimpleProperty(property, {
		string_property:[
			"title",
			"description",
		]
	}, save);
}
WarehouseSpaceSchama.methods.AddStock = function(stock){
	var warehouseSpace = this;
	var found = warehouseSpace.stock_list.some(function(existStock){
		if(existStock.toString() == stock.id){
			return true;
		}
	});
	if(found){
		return Promise.resolve();
	}
	else{
		warehouseSpace.stock_list.push(stock);
		return warehouseSpace.SaveWithPromise(true);
	}
}
WarehouseSpaceSchama.methods.RemoveStock = function(stock){
	var warehouseSpace = this;
	var found = warehouseSpace.stock_list.some(function(existStock, index){
		if(existStock.toString() == stock.id){
			warehouseSpace.stock_list.splice(index, 1);
			return true;
		}
	});
	if(found){
		return warehouseSpace.SaveWithPromise(true);
	}
	else{
		return Promise.resolve();
	}
}

// var OrderSchama = new mongoose.Schema({
// 	company						:{ type: ObjectId, ref: "Company" },
// 	supplier					:[{ type: ObjectId, ref: "Supplier" }],
// 	order_number				:{ type: String, trim: true, default: "" },
// 	datetime					:{ type: Date, default: Date.now },
	
// 	stock_list:[{
// 		stock					:[{ type: ObjectId, ref: "Stock" }],
// 		title					:{ type: String, trim: true, default: "" },
// 		sku_number				:{ type: String, trim: true, default: "" },
// 		uuid					:{ type: String, trim: true, default: "" },
// 		unit					:{ type: String, trim: true, default: "" },
// 		quantity				:{ type: Number, min: 0, default: 0 },
// 		unit_cost				:{ type: Number, min: 0, default: 0 },
// 		tatal_amount			:{ type: Number, min: 0, default: 0 },
// 		description				:{ type: String, trim: true, default: "" },
// 	}],

// 	// 經辦人
// 	// pdf
// 	// 商家聯絡人
// 	// 主管簽核
// 	// 出貨相關資訊
// 	// 確認回簽
// 	// 收貨確認

// 	note						:{ type: String, trim: true, default: "" },
// 	signature					:{ type: String, trim: true, default: "" },
// });


// Mongoose Register
var Stock = mongoose.model("Stock", StockSchema);
var Supplier = mongoose.model("Supplier", SupplierSchema);
var WarehouseSpace = mongoose.model("WarehouseSpace", WarehouseSpaceSchama);

var StockManagerPluginForCompany = function(schema, options){
	schema.plugin(basicPlugin.SaveWithPromisePlugin);
	schema.add({
		stock_list					:[{ type: ObjectId, ref: "Stock" }],
		supplier_list				:[{ type: ObjectId, ref: "Supplier" }],
		warehouse_space_list		:[{ type: ObjectId, ref: "WarehouseSpace" }],
	});
	schema.methods.CreateStock = function(title, skuNumber, property){
		var instance = this;
		var resolver = Promise.pending();
		var stock;
		Stock.CreateStock(instance, title, skuNumber, property).then(function(newStock){
			stock = newStock;
			instance.stock_list.push(stock);
			return instance.SaveWithPromise(true);
		}).then(function(){
			resolver.resolve(stock);
		}).catch(function(err){
			logger.error(err);
			resolver.reject(err);
		});
		return resolver.promise;
	}
	schema.methods.RemoveStock = function(stock){
		var instance = this;
		var resolver = Promise.pending();
		var stockId = stock.id;
		Promise.resolve(stock.remove()).then(function(){
			instance.stock_list.some(function(stockListItem, index){
				if(stockListItem.toString() == stockId){
					instance.stock_list.splice(index, 1);
					return true;
				}
			});
			return instance.SaveWithPromise(true);
		}).then(function(){
			resolver.resolve();
		}).catch(function(err){
			logger.error(err);
			resolver.reject(err);
		});
		return resolver.promise;
	}
	schema.methods.CreateSupplier = function(title, property){
		var instance = this;
		var resolver = Promise.pending();
		var supplier;
		Supplier.CreateSupplier(instance, title, property).then(function(newSupplier){
			supplier = newSupplier;
			instance.stock_list.push(supplier);
			return instance.SaveWithPromise(true);
		}).then(function(){
			resolver.resolve(supplier);
		}).catch(function(err){
			logger.error(err);
			resolver.reject(err);
		});
		return resolver.promise;
	}
	schema.methods.RemoveSupplier = function(supplier){
		var instance = this;
		var resolver = Promise.pending();
		var supplierId = supplier.id;
		Promise.resolve(supplier.remove()).then(function(){
			instance.supplier_list.some(function(supplierListItem, index){
				if(supplierListItem.toString() == supplierId){
					instance.supplier_list.splice(index, 1);
					return true;
				}
			});
			return instance.SaveWithPromise(true);
		}).then(function(){
			resolver.resolve();
		}).catch(function(err){
			logger.error(err);
			resolver.reject(err);
		});
		return resolver.promise;
	}
}


exports = module.exports = {
	Stock: Stock,
	Supplier: Supplier,
	WarehouseSpace: WarehouseSpace,
	StockManagerPluginForCompany: StockManagerPluginForCompany,
}

