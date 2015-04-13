var React = require("react");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React);
var Bootstrap = require("react-bootstrap"),
	Modal = Bootstrap.Modal,
	Button = Bootstrap.Button,
	OverlayMixin = Bootstrap.OverlayMixin;

var People = require("./people.jsx");
var AddPeopleModal = require("./add_people_modal.jsx");

var PeopleList = React.createClass({
	mixins: [FluxMixin, OverlayMixin],
	getInitialState: function(){
		return {
			isAddPeopleModalOpen: false
		};
	},
	handleAddPeopleModal: function(){
		this.setState({
			isAddPeopleModalOpen: !this.state.isAddPeopleModalOpen
		});
	},
	handleAddPeople: function(name, idNumber, passcode){
		var store = this.getFlux().store("CompanyStore");
		this.getFlux().actions.addEmployee(store.company._id, name, idNumber, passcode);
	},
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
				<div key={Math.random()} className="Item People">
					<div className="LeftColumn" onClick={this.handleAddPeopleModal}>
						<div className="Icon Yellow">
							<i className="fa fa-plus-square"></i>
						</div>
						<div className="Title">
							新增帳號
						</div>
					</div>
				</div>
			);
		}
		return (
			<div className="PeopleList">
				{rows}
			</div>
		);
	},
	renderOverlay: function(){
		if(!this.state.isAddPeopleModalOpen){
			return <span />;
		}
		var store = this.getFlux().store("CompanyStore");
		return (
			<AddPeopleModal onRequestHide={this.handleAddPeopleModal} onAddPeople={this.handleAddPeople}/>
		);
	}
});

module.exports = PeopleList;