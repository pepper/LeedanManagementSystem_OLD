var React = require("react");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ActionAndPeopleContainer = require("../action_and_people_section/container.jsx");
var NumericKeypad = require("./numeric_keypad.jsx");

function addKeyToArrayItem(targetList){
	targetList.map(function(target){
		target.key = "ID" + Math.random();
		return target;
	});
}

var actions = [{
	icon: "print",
	title: "全部列印"
}, {
	icon: "file-pdf-o",
	title: "全部列印至檔案"
}];
addKeyToArrayItem(actions);

var TimePunch = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("CompanyStore")],
	getStateFromFlux: function(){
		var store = this.getFlux().store("CompanyStore");
		var newState = {
			loading: store.loading,
			error: store.error,
			company: store.company,
			peoples: []
		}
		if(store.company && store.company.employee_list){
			if(store.employee){
				newState.login = true;
				newState.number = false;
				newState.duty = true;
				newState.leave = false;
				newState.lunch = true;
				if(store.employee.permission.indexOf("manage_employee") >= 0){
					newState.manageEmployeePermission = true;
				}
				if(store.employee.permission.indexOf("leave") >= 0){
					newState.leavePermission = true;
				}
			}
			else{
				newState.login = false;
				newState.number = true;
				newState.duty = false;
				newState.leave = false;
				newState.lunch = false;
				newState.manageEmployeePermission = false;
				newState.leavePermission = false;
			}
			newState.peoples = store.company.employee_list.map(function(employee){
				return {
					name: employee.name,
					idNumber: employee.id_number,
					scoreTrend: "up",
					score: 0,
					avatar: "",
					active: ((store.employee && store.employee._id == employee._id)?true:false)
				}
			});
		}
		return newState;
	},
	render: function(){
		return (
			<div className="FunctionContainer TimePunch">
				<ActionAndPeopleContainer manageEmployeePermission={this.state.manageEmployeePermission} actions={actions} peoples={this.state.peoples} />
				<NumericKeypad number={this.state.number} duty={this.state.duty} leave={this.state.leave} lunch={this.state.lunch} login={this.state.login} leavePermission={this.state.leavePermission} />
			</div>
		);
	}
});

module.exports = TimePunch;