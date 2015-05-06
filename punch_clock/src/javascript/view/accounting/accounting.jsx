var React = require("react");
var	Router = require("react-router"),
	RouteHandler = Router.RouteHandler;
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ActionAndPeopleContainer = require("../action_and_people_section/container.jsx");
var PaySheetContainer = require("./pay_sheet_container.jsx");

function addKeyToArrayItem(targetList){
	targetList.map(function(target){
		target.key = "ID" + Math.random();
		return target;
	});
}

var Accounting = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("CompanyStore"), Router.Navigation, Router.State],
	getStateFromFlux: function(){
		var store = this.getFlux().store("CompanyStore");
		var newState = {
			loading: store.loading,
			error: store.error,
			company: store.company,
			peoples: [],
			action_list: []
		}

		if(store.company && store.company.employee_list){
			if(store.employee){
				newState.login = true;
				if(store.employee.permission.indexOf("manage_accounting") >= 0){
					newState.manageAccountingPermission = true;
				}
				else{
					this.transitionTo("/punch_clock/accounting/pay_sheet/" + store.employee.id_number);
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
					active: ((store.employee && store.employee._id == employee._id)?true:false),
					url: (newState.manageAccountingPermission || (store.employee && store.employee._id == employee._id))?"/punch_clock/accounting/pay_sheet/" + employee.id_number:""
				}
			});

			if(newState.manageAccountingPermission){
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
			}
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
				<RouteHandler />
			</div>
		);
	}
});

module.exports = Accounting;