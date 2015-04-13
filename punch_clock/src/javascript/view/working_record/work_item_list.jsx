var React = require("react");
var	Router = require("react-router");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React);
var Bootstrap = require("react-bootstrap"),
	Modal = Bootstrap.Modal,
	Button = Bootstrap.Button,
	OverlayMixin = Bootstrap.OverlayMixin;

var WorkItem = require("./work_item.jsx");
var ConfirmWorkModal = require("./confirm_work_modal.jsx");

var WorkItemList = React.createClass({
	mixins: [FluxMixin, Router.Navigation, Router.State, OverlayMixin],
	getInitialState: function(){
		return {
			isModalOpen: false
		};
	},
	handleConfirmWorkModal: function(){
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	},
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
						<div className="Confirm" onClick={this.handleConfirmWorkModal}>
							<i className="fa fa-check-circle-o"></i><br />
							確認
						</div>
						<div className="Summery">
							單日累計積分：{this.props.todayTotal}
						</div>
						<div className="SignOut" onClick={this.handleLogout}>
							<i className="fa fa-sign-out"></i><br />
							登出
						</div>
					</div>
				</div>
			</div>
		);
	},
	renderOverlay: function(){
		if(!this.state.isModalOpen){
			return <span />;
		}
		var store = this.getFlux().store("CompanyStore");
		return (
			<ConfirmWorkModal onRequestHide={this.handleConfirmWorkModal} onConfirmWork={this.handleConfirmWorkItemList} workingItemList={store.employee.newWorkingItemList}/>
		);
	}
});

module.exports = WorkItemList;