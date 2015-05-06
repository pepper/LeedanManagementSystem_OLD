var React = require("react");
var	Router = require("react-router");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React);

var PaySheet = require("./pay_sheet.jsx");

var PaySheetContainer = React.createClass({
	mixins: [FluxMixin, Router.Navigation, Router.State],
	getInitialState: function(){
		var routerParams = this.context.router.getCurrentParams()
		return {
			employeeId: routerParams.employeeId
		};
	},
	render: function(){
		var routerParams = this.context.router.getCurrentParams();
		this.state.employeeId = routerParams.employeeId;
		var store = this.getFlux().store("CompanyStore");

		this.state.employee = store.employee;
		store.company.employee_list.some(function(employee){
			if(employee.id_number == this.state.employeeId){
				this.state.employee = employee;
				return true;
			}
		}.bind(this));
		var rows = [];
		this.state.employee.pay_sheet.forEach(function(paySheet){
			rows.push(
				<PaySheet {...paySheet} />
			);
		});
		return (
			<div className="FunctionContentContainer PaySheetContainer">
				<div className="HeadArea">
					<div className="Title">薪資統計</div>
				</div>
				<div className="ContentAreaContainer">
					{rows}
				</div>
			</div>
		);
	}
});

module.exports = PaySheetContainer;