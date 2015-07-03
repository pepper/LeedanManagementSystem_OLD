"use strict";

var platform = "iOS";

module.exports = {
	setPlatform: function(input){
		platform = input;
	},
	getPlatform: function(){
		return platform;
	}
};