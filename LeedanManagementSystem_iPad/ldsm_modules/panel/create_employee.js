"use strict";

var React = require("react-native");
var Camera = require("react-native-camera");
var Icon = require("FAKIconImage");

var Action = require("../model/action");

var Color = require("../basic/color_definition");
var Styles = require("./style");

var {
	Text,
	TextInput,
	Image,
	View,
	TouchableWithoutFeedback,
	NativeModules,
	SegmentedControlIOS,
} = React;

var styles = Styles.ios;

var CreateEmployeeHeader = React.createClass({
	render: function(){
		return (
			<Text style={styles.titleText}>{"新增公司員工"}</Text>
		);
	}
});

var name = "";
var idNumber = "";
var passcode = "";
var confirmPasscode = "";
var permission = [];
var avatar = "";

var CreateEmployeeContent = React.createClass({
	getInitialState: function(){
		return {
			cameraType: Camera.constants.Type.back,
			avatar: "",
			permission:[{
				title: "管理公司員工名單",
				value: "manage_employee",
			},{
				title: "簽核請假單",
				value: "manage_leave",
			},{
				title: "管理員工工作記錄",
				value: "manage_working_record",
			},{
				title: "管理公司薪資帳務",
				value: "manage_accounting",
			}],
		}
	},
	componentDidMount: function(){
		name = "";
		idNumber = "";
		passcode = "";
		confirmPasscode = "";
		permission = [];
		avatar = "";
	},
	takePhotoHandler: function(){
		this.refs.cam.capture(function(err, data){
			if(err){
				Action.addError(err);
			}
			this.setState({
				avatar: data,
			});
			avatar = data;
		}.bind(this));
	},
	onPermission0ValueChange(value){
		if(value == "無此權限"){
			var index = permission.indexOf(this.state.permission[0].value)
			if(index >= 0){
				permission.splice(index, 1);
			}
		}
		else{
			if(permission.indexOf(this.state.permission[0].value) < 0){
				permission.push(this.state.permission[0].value);
			}
		}
	},
	onPermission1ValueChange(value){
		if(value == "無此權限"){
			var index = permission.indexOf(this.state.permission[1].value)
			if(index >= 0){
				permission.splice(index, 1);
			}
		}
		else{
			if(permission.indexOf(this.state.permission[1].value) < 0){
				permission.push(this.state.permission[1].value);
			}
		}
	},
	onPermission2ValueChange(value){
		if(value == "無此權限"){
			var index = permission.indexOf(this.state.permission[2].value)
			if(index >= 0){
				permission.splice(index, 1);
			}
		}
		else{
			if(permission.indexOf(this.state.permission[2].value) < 0){
				permission.push(this.state.permission[2].value);
			}
		}
	},
	onPermission3ValueChange(value){
		if(value == "無此權限"){
			var index = permission.indexOf(this.state.permission[3].value)
			if(index >= 0){
				permission.splice(index, 1);
			}
		}
		else{
			if(permission.indexOf(this.state.permission[3].value) < 0){
				permission.push(this.state.permission[3].value);
			}
		}
	},
	render: function(){
		return (
			<View style={styles.inputRowContainer}>
				<View style={{flexDirection: "row"}}>
					<View style={{flexDirection: "column", flex: 1, marginRight:10}}>
						<TextInput style={styles.fullWidthTextInput} placeholder={"請輸入姓名"} onChangeText={(text) => (name = text)} />
						<TextInput style={styles.fullWidthTextInput} placeholder={"請輸入員工編號"} onChangeText={(text) => (idNumber = text)} />
						<TextInput style={styles.fullWidthTextInput} placeholder={"請輸入登入密碼"} password={true} onChangeText={(text) => (passcode = text)} />
						<TextInput style={styles.fullWidthTextInput} placeholder={"再次輸入登入密碼"} password={true} onChangeText={function(text){
							if(passcode == text){
								confirmPasscode = text;
							}
						}} />
					</View>
					<View style={{flexDirection: "column", flex: 1}}>
						<SegmentedControlIOS style={styles.fullWidthSegmented} onValueChange={this.onPermission0ValueChange} tintColor={Color.orange} values={[this.state.permission[0].title, "無此權限"]} selectedIndex={1} />
						<SegmentedControlIOS style={styles.fullWidthSegmented} onValueChange={this.onPermission1ValueChange} tintColor={Color.orange} values={[this.state.permission[1].title, "無此權限"]} selectedIndex={1} />
						<SegmentedControlIOS style={styles.fullWidthSegmented} onValueChange={this.onPermission2ValueChange} tintColor={Color.orange} values={[this.state.permission[2].title, "無此權限"]} selectedIndex={1} />
						<SegmentedControlIOS style={styles.fullWidthSegmented} onValueChange={this.onPermission3ValueChange} tintColor={Color.orange} values={[this.state.permission[3].title, "無此權限"]} selectedIndex={1} />
					</View>
				</View>
				<View style={styles.avatarContainer}>
					<View style={styles.cameraContainer}>
						<TouchableWithoutFeedback onPress={this.takePhotoHandler}>
							<Camera
								ref="cam"
								style={styles.cameraView}
								onBarCodeRead={this._onBarCodeRead}
								type={this.state.cameraType}
							>
								<Icon
									name={"fontawesome|camera"}
									size={20}
									color={Color.white}
									style={styles.takePhotoButton}
								/>
							</Camera>
						</TouchableWithoutFeedback>
					</View>
					<View style={styles.cameraContainer}>
						<Image style={styles.avatarImage} source={{uri: "data:image/jpeg;base64," + this.state.avatar, isStatic: true}} />
					</View>
				</View>
			</View>
		);
	}
});

var CreateEmployeeFooter = React.createClass({
	getInitialState: function(){
		return {
			pressing: false,
		}
	},
	onCreateButtonPressHandler: function(){
		Action.hidePanel();
		Action.createEmployee(name, idNumber, confirmPasscode, permission, avatar);
	},
	render: function(){
		return (
			<View style={styles.footer}>
				<TouchableWithoutFeedback onPress={Action.hidePanel}>
					<View style={styles.button}>
						<Text style={styles.buttonText}>{"取消"}</Text>
					</View>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={this.onCreateButtonPressHandler}>
					<View style={styles.button}>
						<Text style={styles.buttonText}>{"新增"}</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
});

module.exports = {
	header: CreateEmployeeHeader,
	content: CreateEmployeeContent,
	footer: CreateEmployeeFooter,
}