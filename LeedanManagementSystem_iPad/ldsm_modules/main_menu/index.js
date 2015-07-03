"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Styles = require("./style");

var styles = Styles.ios;

var MenuItem = require("./menu_item");

var {
	StyleSheet,
	Text,
	View,
	Image,
	ListView,
} = React;

var MainMenu = React.createClass({
	getInitialState: function(){
		return {
			main_menu_item: this.rebuildMenuDataSource([]),
		};
	},
	componentWillMount: function(){
		this.setState({
			main_menu_item: this.rebuildMenuDataSource(this.props.moduleList),
		});
	},
	componentWillReceiveProps: function(nextProps){
		this.setState({
			main_menu_item: this.rebuildMenuDataSource(this.props.moduleList),
		});
	},
	rebuildMenuDataSource: function(input){
		var dataSourceContent = input.slice(0);
		var showingItemQuantity = 9;
		while(showingItemQuantity - dataSourceContent.length > 0){
			dataSourceContent.push({
				empty: true
			});
		}
		dataSourceContent.push({
			id: "company_logout",
			icon: "power-off",
			text: "Logout",
		});
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return dataSource.cloneWithRows(dataSourceContent);
	},
	render: function(){
		return (
			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image style={styles.logoImage} source={{uri: "data:image/png;base64,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", isStatic: true}} />
				</View>
				<ListView
					dataSource={this.state.main_menu_item}
					initialListSize={10}
					renderRow={function(item){
						if(item.empty){
							return <View style={styles.menuItem}></View>
						}
						return (
							<MenuItem {...item} callback={(id) => this.props.callback(id)} selected={(this.props.currentModule.id == item.id)} />
						);
					}.bind(this)}
				/>
			</View>
		);
	}
});

module.exports = MainMenu;