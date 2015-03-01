var React = require("react");
var Bootstrap = require("react-bootstrap");
var ModalTrigger = Bootstrap.ModalTrigger;
var Button = Bootstrap.Button;

var People = require("./people.jsx");
var AddPeopleModal = require("./add_people_modal.jsx");

var PeopleList = React.createClass({
	render: function(){
		var rows = [];
		var context = this;
		if(String(context.props.editMode) == "true"){
			context.props.editMode = true;
		}
		else{
			context.props.editMode = false;
		}
		this.props.peoples.forEach(function(people){
			if(context.props.editMode){
				people.editMode = true;
			}
			rows.push(<People key={people.idNumber} {...people} />);
		});
		if(context.props.editMode){
			rows.push(
				<ModalTrigger key={Math.random()} modal={<AddPeopleModal />}>
					<div className="Item People">
						<Button></Button>
						<div className="LeftColumn">
							<div className="Icon Yellow">
								<i className="fa fa-plus-square"></i>
							</div>
							<div className="Title">
								新增帳號
							</div>
						</div>
					</div>
				</ModalTrigger>
			);
		}
		return (
			<div className="PeopleList">
				{rows}
			</div>
		);
	}
});

module.exports = PeopleList;