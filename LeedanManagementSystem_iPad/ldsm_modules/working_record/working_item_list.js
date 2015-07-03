"use strict";

var React = require("react-native");

var WorkingRecordStore = require("../model/working_record_store");
// var CompanyStore = require("../model/company_store");

var Action = require("../model/action");

var WorkingItem = require("./working_item");

var Styles = require("./style");

var {
	View,
	ListView,
} = React;

var styles = Styles.ios;

var WorkingItemList = React.createClass({
	getInitialState: function(){
		return {
			selected_working_item: "",
			working_item_list_data_source: this.generateDataSource([]),
		}
	},
	componentDidMount: function(){
		WorkingRecordStore.addChangeListener(this.onStoreChange);
		this.onStoreChange();
	},
	componentWillUnmount: function() {
		WorkingRecordStore.removeChangeListener(this.onStoreChange);
	},
	onStoreChange: function(){
		var todayEmployeeWorkingItemList = WorkingRecordStore.getTodayEmployeeWorkingItemList();
		var workingItemToAddList = WorkingRecordStore.getWorkingItemToAddList();
		todayEmployeeWorkingItemList.forEach(function(todayEmployeeWorkingItem){
			var found = workingItemToAddList.some(function(workingItemToAdd){
				if(workingItemToAdd.title == todayEmployeeWorkingItem.title){
					todayEmployeeWorkingItem.pointToAdd = workingItemToAdd.point;
					return true;
				}
			});
			if(!found){
				todayEmployeeWorkingItem.pointToAdd = 0;
			}
		});
		this.setState({
			working_item_list_data_source: this.generateDataSource(todayEmployeeWorkingItemList),
		});
	},
	generateDataSource: function(workingItemList){
		return (new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})).cloneWithRows(workingItemList);
	},
	onWorkingItemSelected: function(title){
		this.setState({
			selected_working_item: title,
			working_item_list_data_source: this.generateDataSource(WorkingRecordStore.getTodayEmployeeWorkingItemList()),
		});
	},
	render: function(){
		return (
			<ListView
				dataSource={this.state.working_item_list_data_source}
				initialListSize={10}
				renderRow={function(item){
					return (
						<WorkingItem {...item}
							selectWorkingItem={this.onWorkingItemSelected}
							editMode={(item.title == this.state.selected_working_item)}
						/>
					);
				}.bind(this)}
			/>
		);
	}
});

module.exports = WorkingItemList;