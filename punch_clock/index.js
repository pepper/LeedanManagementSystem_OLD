var express = require("express");
var logger = require("../utilities/logger.js");
var path = require("path");

var router = express.Router();

router.use(express.static(path.join(__dirname, "public")));

router.get("*", function(req, res) {
	console.log("Hello!!!");
	res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

router.get("/time_punch", function(req, res) {
	res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

router.get("/working_record", function(req, res) {
	res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

router.get("/accounting", function(req, res) {
	res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

router.get("/accounting/*", function(req, res) {
	res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// Export router
exports = module.exports = router;
