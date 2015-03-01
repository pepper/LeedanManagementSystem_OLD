var React = require("react");
var WorkItem = require("./work_item.jsx");

var WorkItemList = React.createClass({
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
				</div>
			</div>
		);
	}
});

module.exports = WorkItemList;