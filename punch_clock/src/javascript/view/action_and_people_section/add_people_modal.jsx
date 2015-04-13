var React = require("react");
var Bootstrap = require("react-bootstrap"),
	Modal = Bootstrap.Modal,
	Button = Bootstrap.Button,
	Input = Bootstrap.Input;
	
var AddPeopleModal = React.createClass({
	getInitialState: function() {
		return {
			name: "",
			id_number: "",
			passcode: ""
		};
	},
	handleAddNewPeople: function(){
		if(this.state.name == ""){
			return alert("姓名為必填欄位");
		}
		if(this.state.id_number == ""){
			return alert("員工編號為必填欄位");
		}
		if(this.state.passcode == "" || !(/[0-9]{8}/.test(this.state.passcode))){
			return alert("登入密碼為必填欄位，且只包含1-9的8碼數字");
		}
		this.props.onAddPeople(this.state.name, this.state.id_number, this.state.passcode);
		this.props.onRequestHide();
	},
	handleNameChange: function(event){
		this.setState({name: event.target.value});
	},
	handleIDNumberChange: function(event){
		this.setState({id_number: event.target.value});
	},
	handlePasscodeChange: function(event){
		this.setState({passcode: event.target.value});
	},
	render: function(){
		return (
			<Modal {...this.props} title="新增員工" animation>
				<div className="modal-body">
					<form>
						<Input key="AddPeopleModalName" type="text" value={this.state.name} onChange={this.handleNameChange} addonBefore="姓名" /><br />
						<Input key="AddPeopleModalIDNumber" type="text" value={this.state.id_number} onChange={this.handleIDNumberChange} addonBefore="員工編號" /><br />
						<Input key="AddPeopleModalPasscode" type="password" value={this.state.passcode} onChange={this.handlePasscodeChange} addonBefore="登入密碼" />
					</form>
				</div>
				<div className="modal-footer">
					<Button bsStyle="success" onClick={this.handleAddNewPeople}>確認新增</Button>
					<Button bsStyle="danger" onClick={this.props.onRequestHide}>關閉</Button>
				</div>
			</Modal>
		);
	}
});

module.exports = AddPeopleModal;