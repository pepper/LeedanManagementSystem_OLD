var React = require("react");
var Action = require("./action.jsx");
var PeopleList = require("./people_list.jsx");

var ActionAndPeopleContainer = React.createClass({
	render: function(){
		var rows = [];
		if(String(this.props.manageEmployeePermission) == "true"){
			this.props.manageEmployeePermission = true;
		}
		else{
			this.props.manageEmployeePermission = false;
		}
		if(this.props.manageEmployeePermission){
			rows.push(
				<div key={Math.random()} className="Item IconItem AdministratorMode">
					<i className="fa fa-wrench"></i>
					<div>Administrator</div>
				</div>
			);
		}
		this.props.actions.forEach(function(action){
			rows.push(<Action {...action} />);
		});
		rows.push(<PeopleList key={Math.random()} editMode={this.props.manageEmployeePermission} peoples={this.props.peoples} />);
		var emptyCount = 0;
		while(this.props.actions.length + this.props.peoples.length + emptyCount < 11){
			rows.push(<div key={Math.random()} className="Item"></div>);
			emptyCount++;
		}
		return (
			<div className="FunctionMenuContainer ActionAndPeopleContainer">
				<div className="Head">
					<div className="LeftColumn">員工列表</div>
					<div className="RightColumn">總積分</div>
				</div>
				{rows}
			</div>
		);
	}
});

module.exports = ActionAndPeopleContainer;