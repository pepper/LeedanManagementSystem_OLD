var React = require("react");
var	Router = require("react-router");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React);
var WorkItem = require("./work_item.jsx");

var WorkItemList = React.createClass({
	mixins: [FluxMixin, Router.Navigation, Router.State],
	handleConfirmWorkItemList: function(){
		var store = this.getFlux().store("CompanyStore");
		this.getFlux().actions.addWorkingItemList(store.company._id, store.employee._id, store.employee.newWorkingItemList);
		this.transitionTo("time_punch");
	},
	handleLogout: function(){
		this.getFlux().actions.logoutEmployee();
	},
	render: function(){
		var rows = [];
		this.props.works.forEach(function(work){
			rows.push(
				<WorkItem {...work} />
			);
		});
		return (
			<div className="FunctionContentContainer WorkingRecord">
				<div className="HeadArea">
					<div className="Title">工作項目紀錄</div>
				</div>
				<div className="ContentAreaContainer">
					<div className="ContentArea WorkItemList">
						{rows}
					</div>
					<div className="ActionContainer">
						<div className="Confirm" onTouchEnd={this.handleConfirmWorkItemList}>
							<i className="fa fa-check-circle-o"></i><br />
							確認
						</div>
						<div className="Summery">
							單日累計積分：{this.props.todayTotal}
						</div>
						<div className="SignOut" onTouchEnd={this.handleLogout}>
							<i className="fa fa-sign-out"></i><br />
							登出
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = WorkItemList;