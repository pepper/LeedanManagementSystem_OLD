var React = require("react");
var	Router = require("react-router"),
	Link = Router.Link,
	RouteHandler = Router.RouteHandler;
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var MainMenu = require("./main_menu.jsx");

function addKeyToArrayItem(targetList){
	targetList.map(function(target){
		target.key = "ID" + Math.random();
		return target;
	});
}

var mainMenuData = [{
	icon: "bell-o",
	description: "Time Punch",
	link: "time_punch"
}, {
	icon: "diamond",
	description: "Working Record",
	link: "working_record"
}];
addKeyToArrayItem(mainMenuData);

var MainContainer = React.createClass({
	mixins: [FluxMixin],
	render: function(){
		return (
			<div className="MainContainer">
				<MainMenu menus={mainMenuData} />
				<RouteHandler params={this.props.params} />
			</div>
		);
	},
	componentDidMount: function(){
		this.getFlux().actions.loadCompany();
	}
});

module.exports = MainContainer;