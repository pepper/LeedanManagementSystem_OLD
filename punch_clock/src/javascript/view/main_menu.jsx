var React = require("react");
var	Router = require("react-router"),
	Link = Router.Link;

var MainMenu = React.createClass({
	render: function(){
		var rows = [];
		this.props.menus.forEach(function(menu){
			var classString = "fa fa-" + menu.icon;
			rows.push(
				<div className="Item" key={menu.key}>
					<Link to={menu.link}>
						<i className={classString}></i>
						<div className="Description">{menu.description}</div>
					</Link>
				</div>
			);
		});
		return (
			<div className="MainMenu">
				<div className="Logo"></div>
				{rows}
			</div>
		);
	}
});

module.exports = MainMenu;