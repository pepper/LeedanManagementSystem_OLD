"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("../basic/color_definition");
var MenuItem = require("./menu_item.ios");

var styles = require("./style.ios.js");

var {
	StyleSheet,
	Text,
	View,
	ListView,
} = React;

var FunctionList = React.createClass({
	getInitialState: function(){
		return {
		
		};
	},
	componentWillMount: function(){
		this.rebuildDataSource(this.props.menuItemList);
	},
	rebuildDataSource: function(dataSourceContent){
		var dataSourceContent = this.props.menuItemList;
		var showingItemQuantity = 11;
		while(showingItemQuantity - dataSourceContent.length > 0){
			dataSourceContent.push({
				empty: true
			});
		}
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({
			main_menu_item: dataSource.cloneWithRows(dataSourceContent),
		});
	},
	render: function(){
		return (
			<ListView
				dataSource={this.state.main_menu_item}
				initialListSize={10}
				renderRow={function(item){
					if(item.empty){
						return <View style={styles.menuItem}></View>
					}
					return (
						<MenuItem icon={item.icon} text={item.text} callback={this.menuChange} selected={(this.state.selected_item == item.text)} />
					);
				}.bind(this)}
			/>
		);
	}
});

module.exports = FunctionList;