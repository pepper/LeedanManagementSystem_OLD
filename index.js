var express				= require("express");
var bodyParser			= require("body-parser");
var http				= require("http");
var https				= require("https");
var path				= require("path");
// var session				= require("express-session");
// var MongoStore			= require("connect-mongo")(session);
// var socketIo			= require("socket.io");

var logger				= require("./utilities/logger");

// Router
var punchClock			= require("./punch_clock");
var backendAPI			= require("./backend_api");

// var documentation		= require("./documentations");
// var apiBackend			= require("./api_backend");
// var indexWebsite		= require("./index_website");
// var serviceManagement	= require("./service_management");
// var tvWebsite			= require("./tv_website");
// var database			= require("./utilities/database");
// var notification		= require("./utilities/notification");

var app = express();

// database.connect().then(function(db){
	app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
	app.use(bodyParser.json({limit: '1mb'}));
	// app.use(session({
	// 	secret: "ru.4ru6au4a831j6el4nj4su3",
	// 	store: new MongoStore({
	// 		db : "10x10Session",
	// 	}),
	// 	resave: true,
	// 	saveUninitialized: true
	// }));

	// app.use("/docs", documentation);
	app.use("/api", backendAPI);
	// app.use("/management", serviceManagement);
	// app.use("/tv", tvWebsite);
	// app.use("/", indexWebsite);
	app.use("/punch_clock", punchClock);
	app.get("/", function(req, res){
		res.send("HI! This is true root");
	});

	logger.info("Start server @80");

	var httpServer = http.createServer(app);
	// var io = socketIo(httpServer);
	// notification.initializeSocketIO(io);
	// var httpsServer = https.createServer(credentials, app);

	httpServer.listen(80);
// }).catch(function(err){
// 	logger.error(err);
// });

module.exports = app;
