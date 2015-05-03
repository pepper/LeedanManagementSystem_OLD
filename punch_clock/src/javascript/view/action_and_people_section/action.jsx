var React = require("react");

var Action = React.createClass({
	render: function(){
		var iconClassString = "fa fa-" + this.props.icon;

		return (
			<div className="Item IconItem">
				<i className={iconClassString}></i>
				<div onClick={this.props.action}>{this.props.title}</div>
			</div>
		);
	}
});

module.exports = Action;