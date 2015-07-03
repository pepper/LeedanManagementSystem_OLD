var Dispatcher = require("flux").Dispatcher;
var AppDispatcher = new Dispatcher();

AppDispatcher.handleViewAction = function(action){
	this.dispatch({
		source: "VIEW_ACTION",
		action: action
	});
}

AppDispatcher.handleRequestAction = function(action){
	this.dispatch({
		source: "REQUEST_ACTION",
		action: action
	});
}

AppDispatcher.handleStoreAction = function(action){
	this.dispatch({
		source: "STORE_ACTION",
		action: action
	});
}

module.exports = AppDispatcher;