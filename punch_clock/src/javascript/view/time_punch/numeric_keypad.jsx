var React = require("react");
var	Router = require("react-router");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React);
var Bootstrap = require("react-bootstrap"),
	Modal = Bootstrap.Modal,
	Button = Bootstrap.Button,
	Label = Bootstrap.Label,
	OverlayMixin = Bootstrap.OverlayMixin;
var _ = require("underscore");

var NumericKeypad = React.createClass({
	mixins: [FluxMixin, OverlayMixin, Router.Navigation, Router.State],
	getInitialState: function() {
		return {
			inputing: false,
			inputIdNumber: "",
			inputTimeout: null,
			touching: "",
			isOnDutyModalOpen: false,
			isOffDutyModalOpen: false,
			isBreakModalOpen: false
		};
	},
	handleOnDutyModal: function(){
		this.setState({
			isOnDutyModalOpen: !this.state.isOnDutyModalOpen
		});
	},
	handleOffDutyModal: function(){
		var needRedirect = false;
		if(this.state.isOffDutyModalOpen){
			needRedirect = true;
		}
		this.setState({
			isOffDutyModalOpen: !this.state.isOffDutyModalOpen
		});
		if(needRedirect){
			this.transitionTo("working_record");
		}
	},
	handleBreakModal: function(){
		var needRedirect = false;
		if(this.state.isBreakModalOpen){
			needRedirect = true;
		}
		this.setState({
			isBreakModalOpen: !this.state.isBreakModalOpen
		});
		if(needRedirect){
			this.transitionTo("working_record");
		}
	},
	handleTouchStart: function(key){
		this.setState({
			touching: key
		});
	},
	handleTouchEnd: function(key){
		var store = this.getFlux().store("CompanyStore");
		if(this.props.number && key.length == 1){
			if(this.state.inputTimeout){
				clearTimeout(this.state.inputTimeout);
			}
			if((this.state.inputIdNumber + key).length == 8){
				this.getFlux().actions.loginEmployee(this.state.inputIdNumber + key);
				this.setState({
					inputIdNumber: "",
					touching: "",
					inputTimeout: null
				});
			}
			else{
				this.setState({
					inputIdNumber: this.state.inputIdNumber + key,
					touching: "",
					inputTimeout: setTimeout(function(){
						this.setState({
							inputIdNumber: "",
							touching: "",
							inputTimeout: null
						});
					}.bind(this), 5000)
				});
			}
		}
		if(this.props.duty && store.employee){
			switch(key){
				case "OnDuty":
					this.handleOnDutyModal();
					this.getFlux().actions.addPunchRecord(store.company._id, store.employee._id, key);
					this.setState({
						inputIdNumber: "",
						touching: "",
						inputTimeout: null
					});
					break;
				case "Break":
					this.handleBreakModal();
					this.getFlux().actions.addPunchRecord(store.company._id, store.employee._id, key);
					this.setState({
						inputIdNumber: "",
						touching: "",
						inputTimeout: null
					});
					break;
				case "OffDuty":
					this.handleOffDutyModal();
					this.getFlux().actions.addPunchRecord(store.company._id, store.employee._id, key);
					this.setState({
						inputIdNumber: "",
						touching: "",
						inputTimeout: null
					});
					break;
			}
		}
	},
	handleLogout: function(){
		this.getFlux().actions.logoutEmployee();
	},
	componentWillUnmount: function(){
		if(this.logoutTimer){
			clearTimeout(this.logoutTimer);
			this.logoutTimer = null;
		}
	},
	render: function(){
		if(String(this.props.number) == "true"){
			this.props.number = true;
		}
		if(String(this.props.duty) == "true"){
			this.props.duty = true;
		}
		if(String(this.props.leave) == "true"){
			this.props.leave = true;
		}
		if(String(this.props.lunch) == "true"){
			this.props.lunch = true;
		}
		if(String(this.props.login) == "true"){
			this.props.login = true;
			this.logoutTimer = setTimeout(function(){
				this.getFlux().actions.logoutEmployee();
			}.bind(this), 30000);
		}
		var key = {};
		_.each({
			"1": {
				keyClass:"Key Row0 Column0 Key1",
				title: "1",
				number: true
			},
			"2": {
				keyClass:"Key Row0 Column1 Key2",
				title: "2",
				number: true
			},
			"3": {
				keyClass:"Key Row0 Column2 Key3",
				title: "3",
				number: true
			},
			"4": {
				keyClass:"Key Row1 Column0 Key4",
				title: "4",
				number: true
			},
			"5": {
				keyClass:"Key Row1 Column1 Key5",
				title: "5",
				number: true
			},
			"6": {
				keyClass:"Key Row1 Column2 Key6",
				title: "6",
				number: true
			},
			"7": {
				keyClass:"Key Row2 Column0 Key7",
				title: "7",
				number: true
			},
			"8": {
				keyClass:"Key Row2 Column1 Key8",
				title: "8",
				number: true
			},
			"9": {
				keyClass:"Key Row2 Column2 Key9",
				title: "9",
				number: true
			},
			"OnDuty": {
				keyClass:"Key Row0 Column3 SmallText YellowKey KeyOnDuty",
				title: "上班",
				duty: true
			},
			"Break": {
				keyClass:"Key Row1 Column3 SmallText YellowKey KeyBreak",
				title: "休息",
				duty: true
			},
			"OffDuty": {
				keyClass:"Key Row2 Column3 SmallText YellowKey KeyOffDuty",
				title: "下班",
				duty: true
			},
			"PersonalLeave": {
				keyClass:"Key Row3 Column0 NotFill SmallText KeyPersonalLeave",
				title: "事假",
				leave: true
			},
			"SickLeave": {
				keyClass:"Key Row3 Column1 NotFill SmallText KeySickLeave",
				title: "病假",
				leave: true
			},
			"AnnualLeave": {
				keyClass:"Key Row3 Column2 NotFill SmallText KeyAnnualLeave",
				title: "特休",
				leave: true
			},
			"Lunch": {
				keyClass:"Key Row3 Column3 OrangeKey KeyLunch",
				title: "<i class=\"fa fa-cutlery\"></i>",
				lunch: true
			}
		}, function(value, index){
			if(this.props.number == value.number){
				value.keyClass += " Active";
			}
			if(this.props.duty == value.duty){
				value.keyClass += " Active";
			}
			if(this.props.leave == value.leave){
				value.keyClass += " Active";
			}
			if(this.props.lunch == value.lunch){
				value.keyClass += " Active";
			}
			if(index == this.state.touching){
				value.keyClass += " Touching";
			}
			key[index] = value;
		}.bind(this));

		var keyDom = [];
		for(var index in key){
			keyDom.push(
				<div key={"Key" + index} className={key[index].keyClass} onTouchStart={this.handleTouchStart.bind(null, index)} onTouchEnd={this.handleTouchEnd.bind(null, index)} dangerouslySetInnerHTML={{__html: key[index].title}}></div>
			);
		}
		return (
			<div className="FunctionContentContainer TimePunch">
				<div className="HeadArea">
					<div className="Title">輸入帳號:{this.state.inputIdNumber}</div>
				</div>
				<div className="ContentAreaContainer">
					<div className="ContentArea NumericKeypad">
						{keyDom}
						<div className="Logout" onTouchEnd={this.handleLogout}>
							<i className="fa fa-sign-out"></i>
							登出
						</div>
					</div>
				</div>
			</div>
		);
	},
	renderOverlay: function(){
		if(this.state.isOnDutyModalOpen){
			return (
				<Modal title="打卡記錄" animation onRequestHide={this.handleOnDutyModal}>
					<div className="modal-body">
						<h2><Label bsStyle="success">上班卡</Label>&nbsp;&nbsp;打卡成功</h2>
					</div>
					<div className="modal-footer">
						<Button bsStyle="danger" onClick={this.handleOnDutyModal}>關閉</Button>
					</div>
				</Modal>
			);
		}
		else if(this.state.isOffDutyModalOpen){
			return (
				<Modal title="打卡記錄" animation onRequestHide={this.handleOffDutyModal}>
					<div className="modal-body">
						<h2><Label bsStyle="success">下班卡</Label>&nbsp;&nbsp;打卡成功</h2><br />
						<p>
							請記得填寫工作記錄表
						</p>
					</div>
					<div className="modal-footer">
						<Button bsStyle="success" onClick={this.handleOffDutyModal}>前往填寫</Button>
					</div>
				</Modal>
			);
		}
		else if(this.state.isBreakModalOpen){
			return (
					<Modal title="打卡記錄" animation onRequestHide={this.handleBreakModal}>
					<div className="modal-body">
						<h2><Label bsStyle="success">休息卡</Label>&nbsp;&nbsp;打卡成功</h2><br />
						<p>
							請記得填寫工作記錄表
						</p>
					</div>
					<div className="modal-footer">
						<Button bsStyle="success" onClick={this.handleBreakModal}>前往填寫</Button>
					</div>
				</Modal>
			)
		}
		else{
			return <span />;
		}
	}
});

module.exports = NumericKeypad;