var AppDispatcher = require("./dispatcher");
var Constant = require("./constant");
var EventEmitter = require("events").EventEmitter;

var currentPanel = null;

var PanelStore = Object.assign({}, EventEmitter.prototype, {
	getCurrentPanel: function(){
		return currentPanel;
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

AppDispatcher.register(function(payload){
	var action = payload.action;
	switch(action.actionType) {
		case Constant.SHOW_CREATE_EMPLOYEE_PANEL:
			currentPanel = {
				type: Constant.CREATE_EMPLOYEE_PANEL,
				property: {},
			};
			break;
		case Constant.HIDE_PANEL:
			currentPanel = null;
			break;
		default:
			return true;
	}
	PanelStore.emitChange();
	return true;
});

module.exports = PanelStore;