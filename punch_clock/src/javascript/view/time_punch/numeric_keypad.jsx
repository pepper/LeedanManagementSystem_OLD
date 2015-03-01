var React = require("react");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React);
var _ = require("underscore");

var NumericKeypad = React.createClass({
	mixins: [FluxMixin],
	getInitialState: function() {
		return {
			inputing: false,
			inputIdNumber: "",
			inputTimeout: null
		};
	},
	handleTouchEnd: function(key){
		if(this.props.number){
			if(this.state.inputTimeout){
				clearTimeout(this.state.inputTimeout);
			}
			if((this.state.inputIdNumber + key).length == 8){
				this.getFlux().actions.loginEmployee(this.state.inputIdNumber + key);
				this.setState({
					inputIdNumber: "",
					inputTimeout: null
				});
			}
			else{
				this.setState({
					inputIdNumber: this.state.inputIdNumber + key,
					inputTimeout: setTimeout(function(){
						this.setState({
							inputIdNumber: "",
							inputTimeout: null
						});
					}.bind(this), 3000)
				});
			}
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
			setTimeout(function(){
				this.getFlux().actions.logoutEmployee();
			}.bind(this), 10000);
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
			key[index] = value;
		}.bind(this));

		var keyDom = [];
		for(var index in key){
			keyDom.push(
				<div key={Math.random()} className={key[index].keyClass} onTouchEnd={this.handleTouchEnd.bind(null, index)} dangerouslySetInnerHTML={{__html: key[index].title}}></div>
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
						<div className="Logout">
							<i className="fa fa-sign-out"></i>
							登出
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = NumericKeypad;