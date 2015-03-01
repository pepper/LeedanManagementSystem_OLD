var React = require("react");
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

var works = [{
	title: "繞線",
	score: 12,
	total: 343,
	lastModified: new Date()
}, {
	title: "電機組裝",
	score: 2,
	total: 54,
	lastModified: new Date()
}, {
	title: "會計入帳",
	score: 24,
	total: 234,
	lastModified: new Date()
}, {
	title: "製圖",
	score: 65,
	total: 90,
	lastModified: new Date()
}, {
	title: "備料",
	score: 12,
	total: 111,
	lastModified: new Date()
},  {
	title: "電機測試",
	score: 43,
	total: 323,
	lastModified: new Date()
},  {
	title: "變速機組裝",
	score: 2,
	total: 8,
	lastModified: new Date()
},  {
	title: "磁石貼附",
	score: 23,
	total: 43,
	lastModified: new Date()
},  {
	title: "清潔",
	score: 2,
	total: 45,
	lastModified: new Date()
},  {
	title: "買備料",
	score: 18,
	total: 92,
	lastModified: new Date()
}];
addKeyToArrayItem(works);

var WorkingRecord = React.createClass({
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
				<WorkItemList works={works} />
			</div>
		);
	}
});

module.exports = WorkingRecord;