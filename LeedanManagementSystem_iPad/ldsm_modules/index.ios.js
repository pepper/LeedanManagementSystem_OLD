"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Color = require("./basic/color_definition");
var Config = require("./config");

var CompanyStore = require("./model/company_store");
var ModuleStore = require("./store/module_store");
var Action = require("./model/action");

var Panel = require("./panel/index");
var Login = require("./login/index");
var MainMenu = require("./main_menu/index");
var MessageBox = require("./message_box/index");
var TimePunch = require("./time_punch/index");
var WorkingRecord = require("./working_record/index");

var {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	AlertIOS,
} = React;

var LeedanManagementSystem_iPad = React.createClass({
	getInitialState: function(){
		return {
			companyId: CompanyStore.getCurrentLoginCompanyID(),
			moduleList: [],
			module: null,
		};
	},
	componentDidMount: function(){
		CompanyStore.addChangeListener(this.onCompanyStoreChange);
		ModuleStore.addChangeListener(this.onModuleStoreChange);
		Action.companyCheckLogin();
	},
	componentWillUnmount: function() {
		CompanyStore.removeChangeListener(this.onCompanyStoreChange);
		ModuleStore.removeChangeListener(this.onModuleStoreChange);
	},
	onCompanyStoreChange: function(){
		this.setState({
			companyId: CompanyStore.getCurrentLoginCompanyID(),
		});
	},
	onModuleStoreChange: function(){
		this.setState({
			moduleList: ModuleStore.getCurrentModuleList()
		});
	},
	changeModule: function(id){
		if(id == "company_logout"){
			Action.companyLogout();
			return true;
		}
		var found = this.state.moduleList.some(function(module){
			if(module.id == id && module.view){
				this.setState({
					module: module
				});
				return true;
			}
		}.bind(this));
		if(!found){
			AlertIOS.alert(
				"功能尚未開通",
				"您不具備所點擊的功能操作權限，或是該功能尚未開通",
			);
		}
	},
	render: function(){
		return (
			<View style={styles.appContainer}>
				{
					(this.state.companyId)?
					<View style={styles.mainContainer}>
						<MainMenu moduleList={this.state.moduleList} currentModule={this.state.module} callback={this.changeModule}/>
						{
							(this.state.module && this.state.module.view)?
							this.state.module.view
							:
							<View>
								<Text>{"請在左側選單點選功能開始使用"}</Text>
							</View>
						}
					</View>
					:
					<Login />
				}
				<MessageBox />
				<Panel />
			</View>
		)
	}
});

var styles = StyleSheet.create({
	appContainer:{
		backgroundColor: Color.dark,
		width: 1024,
		height: 768,
	},
	mainContainer:{
		flex: 1,
		flexDirection: "row",
		backgroundColor: Color.dark,
	},
});

AppRegistry.registerComponent("LeedanManagementSystem_iPad", () => LeedanManagementSystem_iPad);