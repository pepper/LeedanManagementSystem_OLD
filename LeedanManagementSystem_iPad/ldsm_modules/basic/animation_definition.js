"use strict";

var React = require("react-native");

var {
	LayoutAnimation,
} = React;

var animations = {
	layout: {
		spring: {
			duration: 750,
			create: {
				duration: 300,
				type: LayoutAnimation.Types.easeInEaseOut,
				property: LayoutAnimation.Properties.opacity,
			},
			update: {
				type: LayoutAnimation.Types.spring,
				springDamping: 0.4,
			},
		},
		easeInEaseOut: {
			duration: 300,
			create: {
				type: LayoutAnimation.Types.easeInEaseOut,
				property: LayoutAnimation.Properties.scaleXY,
			},
			update: {
				delay: 100,
				type: LayoutAnimation.Types.easeInEaseOut,
			},
		},
	},
};

exports.spring = animations.layout.spring;
exports.easeInEaseOut = animations.layout.easeInEaseOut;