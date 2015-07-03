var AppDispatcher = require("./dispatcher");
var Constant = require("./constant");
var EventEmitter = require("events").EventEmitter;

var errorHistoryList = [];
var errorList = [];
var messageHistoryList = [];
var messageList = [];

var MessageStore = Object.assign({}, EventEmitter.prototype, {
	getUnshowError: function(){
		return errorList.slice(0);
	},
	getErrorHistory: function(){
		return errorHistoryList;
	},
	getUnshowMessage: function(){
		return messageList.slice(0);
	},
	getUnshowHistory: function(){
		return messageHistoryList;
	},
	emitChange: function() {
		this.emit("change");
	},
	addChangeListener: function(callback) {
		this.on("change", callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener("change", callback);
	}
});

var addError = function(err){
	err.message += " [" + (new Date()).toISOString() + "]";
	console.log("Error Message: " + err.stack);
	errorList.push(err);
	return true;
}
var setAlreadyReadError = function(index){
	errorHistoryList = errorHistoryList.concat(errorList.splice(0, index));
	return true;
}
var addMessage = function(message){
	messageList.push(message);
	return true;
}
var setAlreadyReadMessage = function(index){
	messageHistoryList = messageHistoryList.concat(messageList.splice(0, index));
	return true;
}

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType) {
		case Constant.ADD_ERROR:
			addError(action.data.error);
			break;
		case Constant.CLEAR_ERROR:
			setAlreadyReadError(action.data.index);
			if(action.data.index == 0){
				return true;
			}
			break;
		case Constant.ADD_MESSAGE:
			addMessage(action.data.message);
			break;
		case Constant.CLEAR_MESSAGE:
			setAlreadyReadMessage(action.data.index);
			if(action.data.index == 0){
				return true;
			}
			break;
		default:
			return true;
	}
	MessageStore.emitChange();
	return true;
});

module.exports = MessageStore;