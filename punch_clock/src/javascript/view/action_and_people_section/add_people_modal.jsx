var React = require("react");
var Bootstrap = require("react-bootstrap");
var Modal = Bootstrap.Modal;
var Button = Bootstrap.Button;

var AddPeopleModal = React.createClass({
	render: function(){
		return (
			<Modal {...this.props} title="新增員工" animation>
				<div className="modal-body">
					這是新增員工的介面
				</div>
				<div className="modal-footer">
					<Button onClick={this.props.onRequestHide}>關閉</Button>
				</div>
			</Modal>
		);
	}
});

module.exports = AddPeopleModal;