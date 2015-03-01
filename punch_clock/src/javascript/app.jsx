var attachFastClick = require("fastclick");
var React = require("react");
var Fluxxor = require("fluxxor");
var	Router = require("react-router"),
	Route = Router.Route,  
	DefaultRoute = Router.DefaultRoute;

var MainContainer = require("./view/main_container.jsx");
var TimePunch = require("./view/time_punch/time_punch.jsx");
var WorkingRecord = require("./view/working_record/working_record.jsx");

var CompanyStore = require("./store/companyStore");

var Actions = require("./actions");

var stores = {
	CompanyStore: new CompanyStore()
};

var flux = new Fluxxor.Flux(stores, Actions);

//For debug usage
flux.on("dispatch", function(type, payload){
	if(console && console.log) {
		console.log("[Dispatch]", type, payload);
	}
});

var routes = (
	<Route path="/punch_clock/" handler={MainContainer}>
		<Route name="time_punch" handler={TimePunch}>
		</Route>
		<Route name="working_record" handler={WorkingRecord}>
		</Route>
		<DefaultRoute handler={TimePunch}/>
	</Route>
);

attachFastClick(document.body);
React.initializeTouchEvents(true);
// React.render(<MainContainer />, document.getElementById("app"));

Router.run(routes, Router.HistoryLocation, function(Handler, state){
	React.render(<Handler flux={flux} />, document.body);
});