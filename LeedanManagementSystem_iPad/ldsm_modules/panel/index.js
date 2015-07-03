"use strict";

var React = require("react-native");
var Animation = require("../basic/animation_definition");
var Constant = require("../model/constant");

var PanelStore = require("../model/panel_store");

var CreateEmployee = require("./create_employee");
var NoPanel = require("./no_panel");

var Styles = require("./style");

var {
	Text,
	View,
	ScrollView,
	LayoutAnimation,
} = React;

var styles = Styles.ios;

var Panel = React.createClass({
	getInitialState: function(){
		return {
			current_panel: null,
		}
	},
	componentDidMount: function(){
		PanelStore.addChangeListener(this.onStoreChange);
	},
	componentWillUnmount: function() {
		PanelStore.removeChangeListener(this.onStoreChange);
	},
	onStoreChange: function(){
		LayoutAnimation.configureNext(Animation.spring);
		this.setState({
			current_panel: PanelStore.getCurrentPanel(),
		});
	},
	onClosePanel: function(){
		LayoutAnimation.configureNext(Animation.spring);
		this.setState({
			current_panel: null,
		});
	},
	render: function(){
		var Header;
		var Content;
		var Footer;
		var ShowPanel;
		if(this.state.current_panel){
			switch(this.state.current_panel.type){
				case Constant.CREATE_EMPLOYEE_PANEL:
					ShowPanel = CreateEmployee;
					break;
				default:
					ShowPanel = NoPanel;
					break;
			}
			Header = ShowPanel.header;
			Content = ShowPanel.content;
			Footer = ShowPanel.footer;
		}
		return (
			(this.state.current_panel)?
			(<View style={styles.panelContainer}>
				<View style={styles.panel}>
					<View style={styles.titleContainer}>
						<Header></Header>
					</View>
					<ScrollView style={styles.contentContainer}>
						<Content></Content>
					</ScrollView>
					<View style={styles.footerContainer}>
						<Footer></Footer>
					</View>
				</View>
			</View>)
			:
			(<View></View>)
		)
	}
});

module.exports = Panel;