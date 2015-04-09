var React = require("react");
var	Router = require("react-router");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ActionAndPeopleContainer = require("../action_and_people_section/container.jsx");
var WorkItemList = require("./work_item_list.jsx");

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
actions = [];

var WorkingRecord = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("CompanyStore"), Router.Navigation, Router.State],
	getStateFromFlux: function(){
		var store = this.getFlux().store("CompanyStore");
		var newState = {
			loading: store.loading,
			error: store.error,
			company: store.company,
			peoples: [],
			newWorkItemList: []
		}
		if(store.company && store.company.employee_list){
			if(store.employee){
				newState.login = true;
				newState.number = false;
				newState.duty = true;
				newState.leave = false;
				newState.lunch = true;
				newState.todayTotal = store.employee.todayTotal;
				if(store.employee.permission.indexOf("manage_employee") >= 0){
					newState.manageEmployeePermission = true;
				}
				if(store.employee.permission.indexOf("leave") >= 0){
					newState.leavePermission = true;
				}
				if(store.employee.newWorkingItemList){
					newState.newWorkItemList = store.employee.newWorkingItemList;
				}
				else{
					setTimeout(function(){
						this.getFlux().actions.createEmptyWorkingItemList();
					}.bind(this), 500);
				}
			}
			else{
				alert("請先打卡登入");
				this.transitionTo("time_punch");
			}
			newState.peoples = store.company.employee_list.map(function(employee){
				return {
					name: employee.name,
					idNumber: employee.id_number,
					scoreTrend: "up",
					score: employee.totalScore,
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
				<WorkItemList todayTotal={this.state.todayTotal} works={this.state.newWorkItemList} />
			</div>
		);
	}
});

module.exports = WorkingRecord;