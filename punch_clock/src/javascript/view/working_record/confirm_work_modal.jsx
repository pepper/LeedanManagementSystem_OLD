var React = require("react");
var Bootstrap = require("react-bootstrap"),
	Modal = Bootstrap.Modal,
	Button = Bootstrap.Button,
	Badge = Bootstrap.Badge;

var ConfirmWorkModal = React.createClass({
	render: function(){
		var workingItemList = this.props.workingItemList.filter(function(workingItem){
			return workingItem.score > 0;
		}).map(function(workingItem){
			return (
				<li>{workingItem.title}: <Badge>{workingItem.score}</Badge></li>
			)
		});

		return (
			<Modal {...this.props} title="新增工作項目紀錄" animation>
				<div className="modal-body">
					<ul>{workingItemList}</ul>
				</div>
				<div className="modal-footer">
					<Button bsStyle="success" onClick={this.props.onConfirmWork}>確認新增</Button>
					<Button bsStyle="danger" onClick={this.props.onRequestHide}>關閉</Button>
				</div>
			</Modal>
		);
	}
});

module.exports = ConfirmWorkModal;