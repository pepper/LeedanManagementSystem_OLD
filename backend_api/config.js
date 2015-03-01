var path = require("path");

var config = {
	// Database
	MONGO_DATABASE_ADDRESS: "localhost",
	MONGO_DATABASE_NAME: "leedan"
	// Score & Schedule Feed
	// TEAM_IMAGE_DIRECTORY: path.join(__dirname, "api_backend", "team_images"),

	// // Image
	// IMAGE_DIRECTORY: path.join(__dirname, "image_bank"),

	// // GCM
	// GCM_KEY: "AIzaSyBrinpnt2W0Iej08WAqEBQXMxhjrpiVdRA",

	// // Parse
	// PARSE_APPLICATION_ID: "WhiW9N4b1ExT5o12wBsykpsiK46OSfQc8WoMOHQj",
	// PARSE_JAVASCRIPT_KEY: "1fTHwq1S0PGJhY7iCiuyWMptu5tswdo3CkenndOG",

	// // Sticker Font
	// STICKER_ICON_FILE: path.join(__dirname, "api_backend", "public", "fonts", "icomoon.ttf"),
	// STICKER_FONT_FILE: path.join(__dirname, "api_backend", "public", "fonts", "impact.ttf"),
}

// Apple Push Notification
// if(process.env.NODE_ENV == "production"){
// 	config.APN_CERT = path.join(__dirname, "key", "ios_apns", "cert_product.pem");
// 	config.APN_KEY = path.join(__dirname, "key", "ios_apns", "key_product.pem");
// }
// else{
// 	config.APN_CERT = path.join(__dirname, "key", "ios_apns", "cert_dev.pem");
// 	config.APN_KEY = path.join(__dirname, "key", "ios_apns", "key_dev.pem");
// }

exports = module.exports = config;