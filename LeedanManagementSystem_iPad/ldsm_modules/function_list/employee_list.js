"use strict";

var React = require("react-native");

var Title = require("../function_list/title");
var IconItem = require("../function_list/icon_item");
var IconButton = require("../function_list/icon_button");
var Employee = require("../function_list/employee");
var Empty = require("../function_list/empty")

var Styles = require("./style");

var {
	View,
	ListView,
} = React;

var styles = Styles.ios;

var FunctionList = React.createClass({
	getInitialState: function(){
		return {
			data_source: this.generateDataSource([]),
		}
	},
	componentWillReceiveProps: function(nextProps){
		this.setState({
			data_source: this.generateDataSource(nextProps.employeeList),
		});
	},
	generateDataSource: function(employeeList){
		var dataSourceContent = [];
		employeeList.forEach(function(employee){
			dataSourceContent.push(employee);
		});

		var showingItemQuantity = 10;
		while(showingItemQuantity - dataSourceContent.length > 0){
			dataSourceContent.push({
				empty: true,
			});
		}
		return (new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})).cloneWithRows(dataSourceContent);
	},
	render: function(){
		return (
			<ListView
				dataSource={this.state.data_source}
				initialListSize={10}
				renderRow={function(item){
					if(item.empty){
						return <Empty />;
					}
					return (
						<Employee
							idNumber={item.id_number}
							name={item.name}
							avatar={item.avatar}
							totalScore={item.working_record.statistics.total_score}
							active={(this.props.loginEmployee && this.props.loginEmployee._id == item._id)}
						/>
					);
				}.bind(this)}
				style={styles.employeeListView}
			/>
		);
	}
});

module.exports = FunctionList;