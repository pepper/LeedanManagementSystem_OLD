var React = require("react");
var	Router = require("react-router");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ActionAndPeopleContainer = require("../action_and_people_section/container.jsx");
var PaySheet = require("./pay_sheet.jsx");

function addKeyToArrayItem(targetList){
	targetList.map(function(target){
		target.key = "ID" + Math.random();
		return target;
	});
}

var WorkingRecord = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("CompanyStore"), Router.Navigation, Router.State],
	getStateFromFlux: function(){
		var store = this.getFlux().store("CompanyStore");
		var newState = {
			loading: store.loading,
			error: store.error,
			company: store.company,
			peoples: []
		}

		// Action List
		newState.action_list = [{
			icon: "print",
			title: "全部列印"
		}, {
			icon: "file-pdf-o",
			title: "全部列印至檔案"
		}, {
			icon: "server",
			title: "產生上月薪資單",
			action: this.generatePaySheet
		}];
		addKeyToArrayItem(newState.action_list);

		if(store.company && store.company.employee_list){
			if(store.employee){
				newState.login = true;
				newState.todayTotal = store.employee.todayTotal;
				if(store.employee.permission.indexOf("manage_accounting") >= 0){
					newState.manageAccountingPermission = true;
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
	generatePaySheet: function(){
		this.getFlux().actions.generatePaySheet();
	},
	render: function(){
		return (
			<div className="FunctionContainer Accounting">
				<ActionAndPeopleContainer manageEmployeePermission={this.state.manageEmployeePermission} actions={this.state.action_list} peoples={this.state.peoples} />
			</div>
		);
	}
});

module.exports = WorkingRecord;